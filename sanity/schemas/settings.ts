import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Impostazioni',
  type: 'document',
  __experimental_formPreviewTitle: false,
  fields: [
    defineField({
      name: 'siteName',
      title: 'Nome sito',
      type: 'string',
      initialValue: 'IN SY TO',
    }),
    defineField({
      name: 'siteDescription',
      title: 'Descrizione sito',
      type: 'text',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Email contatti',
      type: 'string',
      initialValue: 'info@insyto.it',
    }),
    defineField({
      name: 'legalAddress',
      title: 'Indirizzo legale',
      type: 'string',
      initialValue: 'Via Benedetto Croce, 34 – 00142 – Roma',
    }),
    defineField({
      name: 'operationalAddress',
      title: 'Indirizzo operativo',
      type: 'string',
      initialValue: 'Via Carlo Todini, 33 – 00012 – Guidonia (RM)',
    }),
    defineField({
      name: 'vat',
      title: 'P. IVA',
      type: 'string',
      initialValue: '11709001009',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Link social',
      type: 'object',
      fields: [
        {
          name: 'linkedin',
          type: 'url',
          title: 'LinkedIn',
        },
        {
          name: 'twitter',
          type: 'url',
          title: 'Twitter',
        },
      ],
    }),
  ],
})

