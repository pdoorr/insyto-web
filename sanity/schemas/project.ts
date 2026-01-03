import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Progetto',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title.it',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descrizione',
      type: 'localeString',
    }),
    defineField({
      name: 'content',
      title: 'Contenuto (Portable Text)',
      type: 'localeBlock',
    }),
    defineField({
      name: 'htmlContent',
      title: 'Contenuto HTML (alternativo)',
      type: 'object',
      fieldsets: [
        {
          title: 'Translations',
          name: 'translations',
          options: { collapsible: true, collapsed: false },
        },
      ],
      fields: [
        {
          name: 'it',
          title: 'Italiano',
          type: 'text',
          fieldset: 'translations',
          rows: 10,
        },
        {
          name: 'en',
          title: 'English',
          type: 'text',
          fieldset: 'translations',
          rows: 10,
        },
      ],
      description: 'Incolla qui il codice HTML. Verrà usato invece del Contenuto Portable Text se presente.',
    }),
    defineField({
      name: 'sector',
      title: 'Settore',
      type: 'localeString',
    }),
    defineField({
      name: 'service',
      title: 'Servizio',
      type: 'reference',
      to: [{ type: 'service' }],
    }),
    defineField({
      name: 'images',
      title: 'Immagini (header)',
      type: 'array',
      of: [
        {
          type: 'image',
          fields: [
            {
              name: 'alt',
              type: 'localeString',
              title: 'Testo alternativo',
            },
          ],
        },
      ],
      description: 'Immagini da mostrare in testa alla pagina',
    }),
    defineField({
      name: 'gallery',
      title: 'Galleria immagini (mosaico in fondo)',
      type: 'array',
      of: [
        defineField({
          name: 'image',
          title: 'Immagine',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Testo alternativo',
              type: 'localeString',
            }),
          ],
        }),
      ],
      description: 'Immagini da mostrare in un mosaico in fondo alla pagina',
    }),
    defineField({
      name: 'featured',
      title: 'In evidenza',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'date',
      title: 'Data',
      type: 'date',
    }),
  ],
  preview: {
    select: {
      title: 'title.it',
      media: 'images.0',
      sector: 'sector.it',
    },
    prepare({ title, media, sector }) {
      return {
        title,
        media,
        subtitle: sector ? `Settore: ${sector}` : '',
      }
    },
  },
})

