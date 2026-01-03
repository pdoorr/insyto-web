import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'blogPost',
  title: 'Articolo Blog',
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
      name: 'excerpt',
      title: 'Estratto',
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
      name: 'author',
      title: 'Autore',
      type: 'string',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data pubblicazione',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categorie',
      type: 'array',
      of: [{ type: 'localeString' }],
    }),
    defineField({
      name: 'tags',
      title: 'Tag',
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
      name: 'featured',
      title: 'In evidenza',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title.it',
      author: 'author',
      media: 'image',
      publishedAt: 'publishedAt',
    },
    prepare({ title, author, media, publishedAt }) {
      return {
        title,
        media,
        subtitle: author && publishedAt
          ? `${author} - ${new Date(publishedAt).toLocaleDateString('it-IT')}`
          : publishedAt
          ? new Date(publishedAt).toLocaleDateString('it-IT')
          : '',
      }
    },
  },
})

