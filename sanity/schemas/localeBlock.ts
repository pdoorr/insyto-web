export default {
  name: 'localeBlock',
  title: 'Localized Block',
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
      type: 'array',
      of: [{ type: 'block' }],
      fieldset: 'translations',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'en',
      title: 'English',
      type: 'array',
      of: [{ type: 'block' }],
      fieldset: 'translations',
    },
  ],
}
