import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'jobApplication',
  title: 'Candidatura',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome e Cognome',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Telefono',
      type: 'string',
    }),
    defineField({
      name: 'position',
      title: 'Posizione ricercata',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'experience',
      title: 'Esperienza e competenze',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'message',
      title: 'Messaggio aggiuntivo',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'cv',
      title: 'CV',
      type: 'file',
      description: 'Curriculum Vitae del candidato',
    }),
    defineField({
      name: 'status',
      title: 'Stato',
      type: 'string',
      initialValue: 'new',
      options: {
        list: [
          { title: 'Nuovo', value: 'new' },
          { title: 'In revisione', value: 'reviewing' },
          { title: 'Da contattare', value: 'to-contact' },
          { title: 'Contattato', value: 'contacted' },
          { title: 'Colloquio programmato', value: 'interview-scheduled' },
          { title: 'Assunto', value: 'hired' },
          { title: 'Rifiutato', value: 'rejected' },
        ],
      },
    }),
    defineField({
      name: 'notes',
      title: 'Note interne',
      type: 'text',
      rows: 3,
      description: 'Note per il team HR',
    }),
    defineField({
      name: 'appliedAt',
      title: 'Data candidatura',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'position',
      status: 'status',
      appliedAt: 'appliedAt',
    },
    prepare(selection) {
      const { title, subtitle, status, appliedAt } = selection
      return {
        title: `${title} - ${subtitle}`,
        subtitle: `${status} • ${new Date(appliedAt).toLocaleDateString('it-IT')}`,
      }
    },
  },
  orderings: [
    {
      title: 'Data (più recenti)',
      name: 'appliedAtDesc',
      by: [{ field: 'appliedAt', direction: 'desc' }],
    },
    {
      title: 'Data (più vecchi)',
      name: 'appliedAtAsc',
      by: [{ field: 'appliedAt', direction: 'asc' }],
    },
    {
      title: 'Nome A-Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
})
