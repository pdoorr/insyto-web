import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Locale } from '@/i18n'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, locale: Locale = 'it'): string {
  return new Date(date).toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

