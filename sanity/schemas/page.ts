import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Pagina',
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
      title: 'Contenuto',
      type: 'localeBlock',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
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
          type: 'object',
          fieldset: 'translations',
          fields: [
            {
              name: 'metaTitle',
              title: 'Meta Title',
              type: 'string',
            },
            {
              name: 'metaDescription',
              title: 'Meta Description',
              type: 'text',
            },
          ],
        },
        {
          name: 'en',
          title: 'English',
          type: 'object',
          fieldset: 'translations',
          fields: [
            {
              name: 'metaTitle',
              title: 'Meta Title',
              type: 'string',
            },
            {
              name: 'metaDescription',
              title: 'Meta Description',
              type: 'text',
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title.it',
      slug: 'slug.current',
    },
    prepare({ title, slug }) {
      return {
        title,
        subtitle: slug ? `/${slug}` : '',
      }
    },
  },
})

