import { usePathname } from 'next/navigation'
import { useParams } from 'next/navigation'
import type { Locale } from '@/i18n'

/**
 * Hook to get the current locale and build localized paths
 */
export function useLocalePath() {
  const params = useParams()
  const pathname = usePathname()
  const locale = (params?.locale as Locale) || 'it'

  /**
   * Build a path with the current locale
   * @param path - The path without locale prefix (e.g., '/servizi')
   * @returns The full localized path (e.g., '/it/servizi')
   */
  function localePath(path: string): string {
    return `/${locale}${path}`
  }

  /**
   * Switch to a different locale
   * @param newLocale - The locale to switch to
   * @returns The current pathname in the new locale
   */
  function switchLocale(newLocale: Locale): string {
    // Remove the current locale from pathname and add the new one
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
    return `/${newLocale}${pathWithoutLocale}`
  }

  return {
    locale,
    localePath,
    switchLocale,
  }
}
