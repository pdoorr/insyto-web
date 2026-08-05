'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/i18n'

interface FooterProps {
  locale: Locale
}

/**
 * Piede in stile pannello.
 *
 * Rispetto alla versione precedente sono stati rimossi due link rotti: uno
 * verso /servizi/radiocomunicazione (lo slug reale è sistemi-radiocomunicazione)
 * e uno verso /privacy, che non è mai esistito come rotta — le informazioni
 * stanno in /note-legali.
 */
export default function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')

  const localePath = (path: string) => `/${locale}${path}`

  const sitemap = [
    { name: tNav('services'), href: '/servizi' },
    { name: tNav('portfolio'), href: '/portfolio' },
    { name: tNav('about'), href: '/profilo' },
    { name: tNav('workWithUs'), href: '/lavora-con-noi' },
    { name: tNav('contact'), href: '/contatti' },
  ]

  return (
    <footer className="border-t rule-instrument bg-instrument-panel">
      <div className="grid gap-10 px-5 py-14 sm:px-8 md:grid-cols-3 lg:px-10">
        <div>
          <p className="font-mono text-[13px] uppercase tracking-[0.3em] text-instrument-bright">
            IN SY TO
          </p>
          <p className="mt-4 max-w-[38ch] text-[13.5px] leading-relaxed text-instrument-dim">
            Integration Systems Technology
          </p>
          <a
            href="mailto:info@insyto.it"
            className="mt-5 inline-block font-mono text-[12px] text-instrument-signal hover:underline"
          >
            info@insyto.it
          </a>
        </div>

        <nav aria-label={tNav('home')}>
          <h2 className="label-instrument">{t('company')}</h2>
          <ul className="mt-4 space-y-2">
            {sitemap.map((link) => (
              <li key={link.href}>
                <Link
                  href={localePath(link.href)}
                  className="font-mono text-[12px] uppercase tracking-[0.08em] text-instrument-text transition-colors hover:text-instrument-signal"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="label-instrument">{t('address')}</h2>
          <address className="mt-4 space-y-3 text-[13px] not-italic leading-relaxed text-instrument-dim">
            <span className="block">
              <span className="label-instrument block">
                {locale === 'it' ? 'Sede legale' : 'Registered office'}
              </span>
              Via Benedetto Croce, 34 — 00142 Roma
            </span>
            <span className="block">
              <span className="label-instrument block">
                {locale === 'it' ? 'Sede operativa' : 'Operations'}
              </span>
              Via Carlo Todini, 33 — 00012 Guidonia (RM)
            </span>
          </address>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t rule-instrument px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <p className="label-instrument tabular">
          IN SY TO srl · {t('vat')} 11709001009 · {t('rights')}
        </p>
        <Link
          href={localePath('/note-legali')}
          className="label-instrument hover:text-instrument-text"
        >
          {locale === 'it' ? 'Note legali' : 'Legal notice'}
        </Link>
      </div>
    </footer>
  )
}
