import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'companyProfile',
  title: 'Profilo Aziendale',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo',
      type: 'string',
      initialValue: 'Profilo Aziendale',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Introduzione',
      type: 'text',
      rows: 3,
      description: 'Testo introduttivo grande',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descrizione',
      type: 'text',
      rows: 3,
      description: 'Descrizione delle attività',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'competenciesTitle',
      title: 'Titolo Competenze',
      type: 'string',
      initialValue: 'Le Nostre Competenze',
    }),
    defineField({
      name: 'competencies',
      title: 'Competenze',
      type: 'array',
      of: [defineType({
        type: 'object',
        fields: [
          defineField({
            name: 'text',
            title: 'Competenza',
            type: 'string',
            validation: (Rule) => Rule.required(),
          }),
        ],
      })],
    }),
    defineField({
      name: 'legalAddress',
      title: 'Sede Legale',
      type: 'object',
      fields: [
        defineField({
          name: 'address',
          title: 'Indirizzo',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'city',
          title: 'Città e CAP',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'operationalAddress',
      title: 'Sede Operativa',
      type: 'object',
      fields: [
        defineField({
          name: 'address',
          title: 'Indirizzo',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'city',
          title: 'Città e CAP',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'htmlContent',
      title: 'Contenuto HTML Extra (opzionale)',
      type: 'text',
      description: 'Incolla qui il codice HTML per contenuti aggiuntivi. Verrà aggiunto dopo le sedi.',
      rows: 10,
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
