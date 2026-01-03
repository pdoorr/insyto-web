import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ requestLocale }) => {
  // Ensure that a valid locale is used
  let locale = await requestLocale

  const locales = ['it', 'en']
  const defaultLocale = 'it'

  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
