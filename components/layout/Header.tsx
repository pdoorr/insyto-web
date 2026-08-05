'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { locales, localeNames, type Locale } from '@/i18n'
import { cn } from '@/lib/utils'

interface HeaderProps {
  locale: Locale
}

/**
 * Barra di strumento, costante su tutto il sito.
 *
 * Resta scura anche sopra le pagine "tavola": il foglio è un documento dentro
 * l'applicazione, e la barra è la cornice che lo contiene.
 *
 * Il sottomenu dei servizi è stato tolto: elencava quattro slug fissi, uno dei
 * quali (/servizi/radiocomunicazione) non esisteva più dopo la migrazione. La
 * pagina /servizi ora fa quel lavoro, e resta sincronizzata con il CMS.
 */
export default function Header({ locale: currentLocale }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const t = useTranslations('nav')

  const navigation = [
    { name: t('services'), href: '/servizi' },
    { name: t('portfolio'), href: '/portfolio' },
    { name: t('about'), href: '/profilo' },
    { name: t('workWithUs'), href: '/lavora-con-noi' },
    { name: t('contact'), href: '/contatti' },
  ]

  const localePath = (path: string) => `/${currentLocale}${path}`

  const switchLocale = (target: Locale) => {
    const rest = pathname.replace(new RegExp(`^/${currentLocale}`), '') || ''
    return `/${target}${rest}`
  }

  const isActive = (href: string) => pathname.startsWith(`/${currentLocale}${href}`)

  return (
    <header className="sticky top-0 z-50 border-b rule-instrument bg-instrument-ground/95 backdrop-blur">
      <nav className="flex items-center gap-6 px-5 py-4 sm:px-8 lg:px-10">
        <Link href={localePath('/')} className="flex items-center">
          <Image
            src="/logo.png"
            alt="IN SY TO — Integration Systems Technology"
            width={132}
            height={35}
            priority
          />
        </Link>

        <ul className="ml-auto hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                href={localePath(item.href)}
                className={cn(
                  'font-mono text-[11px] uppercase tracking-[0.12em] transition-colors',
                  isActive(item.href)
                    ? 'text-instrument-signal'
                    : 'text-instrument-dim hover:text-instrument-text'
                )}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="hidden items-center gap-3 lg:flex">
          {locales.map((loc) => (
            <li key={loc}>
              <Link
                href={switchLocale(loc)}
                lang={loc}
                aria-current={loc === currentLocale ? 'true' : undefined}
                className={cn(
                  'font-mono text-[11px] uppercase tracking-[0.12em] transition-colors',
                  loc === currentLocale
                    ? 'text-instrument-bright'
                    : 'text-instrument-dim hover:text-instrument-text'
                )}
              >
                <span className="sr-only">{localeNames[loc]}</span>
                <span aria-hidden="true">{loc}</span>
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="ml-auto p-2 text-instrument-text lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t rule-instrument lg:hidden">
          <ul>
            {navigation.map((item) => (
              <li key={item.href} className="border-b rule-instrument">
                <Link
                  href={localePath(item.href)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-5 py-4 font-mono text-[12px] uppercase tracking-[0.1em] text-instrument-text"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex gap-5 px-5 py-4">
            {locales.map((loc) => (
              <Link
                key={loc}
                href={switchLocale(loc)}
                lang={loc}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'font-mono text-[12px] uppercase tracking-[0.12em]',
                  loc === currentLocale ? 'text-instrument-bright' : 'text-instrument-dim'
                )}
              >
                {localeNames[loc]}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
