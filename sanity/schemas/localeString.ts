export default {
  name: 'localeString',
  title: 'Localized String',
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
      type: 'string',
      fieldset: 'translations',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'en',
      title: 'English',
      type: 'string',
      fieldset: 'translations',
    },
  ],
}
