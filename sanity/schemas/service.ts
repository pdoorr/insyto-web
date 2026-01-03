import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Servizio',
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
      name: 'icon',
      title: 'Icona',
      type: 'string',
      description: 'Nome icona da lucide-react',
    }),
    defineField({
      name: 'banner',
      title: 'Banner (sostituisce il titolo)',
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
          type: 'image',
          fieldset: 'translations',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Testo alternativo',
              type: 'string',
            },
          ],
        },
        {
          name: 'en',
          title: 'English',
          type: 'image',
          fieldset: 'translations',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Testo alternativo',
              type: 'string',
            },
          ],
        },
      ],
      description: 'Se presente, questa immagine verrà mostrata al posto del titolo del servizio. Carica un\'immagine diversa per ogni lingua.',
    }),
    defineField({
      name: 'description',
      title: 'Descrizione breve',
      type: 'localeString',
    }),
    defineField({
      name: 'content',
      title: 'Contenuto completo (Portable Text)',
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
      name: 'applications',
      title: 'Applicazioni',
      type: 'array',
      of: [{ type: 'localeString' }],
    }),
    defineField({
      name: 'image',
      title: 'Immagine principale',
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
    defineField({
      name: 'gallery',
      title: 'Galleria immagini (mosaico)',
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
      description: 'Immagini da mostrare in un mosaico sotto il contenuto',
    }),
  ],
  preview: {
    select: {
      title: 'title.it',
      media: 'image',
    },
  },
})

