import type { Locale } from '@/i18n'

/**
 * Extract localized string from Sanity localized field
 * @param field - The localized field object with it/en properties
 * @param locale - The current locale
 * @returns The localized string or falls back to Italian
 */
export function getLocalizedField(
  field: { it?: string | null; en?: string | null } | undefined | null,
  locale: Locale
): string {
  if (!field) return ''

  // Try to get the locale-specific value
  const value = field[locale]
  if (value) return value

  // Fall back to Italian as default
  return field.it || ''
}

/**
 * Extract localized array (Portable Text) from Sanity localized field
 * @param field - The localized field object with it/en properties
 * @param locale - The current locale
 * @returns The localized array or falls back to Italian
 */
export function getLocalizedArray(
  field: { it?: any[] | null; en?: any[] | null } | undefined | null,
  locale: Locale
): any[] {
  if (!field) return []

  // Try to get the locale-specific value
  const value = field[locale]
  if (value && Array.isArray(value)) return value

  // Fall back to Italian as default
  return field.it || []
}

/**
 * Extract localized value from array of localized objects
 * @param items - Array of localized objects
 * @param locale - The current locale
 * @returns Array of localized values
 */
export function getLocalizedFromArray<T>(
  items: Array<{ it?: T | null; en?: T | null }> | undefined | null,
  locale: Locale
): T[] {
  if (!items || !Array.isArray(items)) return []

  return items
    .map((item) => {
      const value = item[locale]
      if (value) return value
      return item.it as T
    })
    .filter((value): value is T => value !== null && value !== undefined && value !== '')
}
