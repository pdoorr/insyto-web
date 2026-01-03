'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail, MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/i18n'

interface FooterProps {
  locale: Locale
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  const currentYear = new Date().getFullYear()

  const localePath = (path: string) => `/${locale}${path}`

  const footerLinks = {
    company: [
      { name: tNav('about'), href: '/profilo' },
      { name: tNav('services'), href: '/servizi' },
      { name: tNav('portfolio'), href: '/portfolio' },
      { name: tNav('workWithUs'), href: '/lavora-con-noi' },
    ],
    services: [
      { name: 'Macchine', href: '/servizi/macchine' },
      { name: 'Impianti', href: '/servizi/impianti' },
      { name: 'Sistemi Elettronici', href: '/servizi/sistemi-elettronici' },
      { name: 'Radiocomunicazione', href: '/servizi/radiocomunicazione' },
    ],
    legal: [
      { name: 'Note Legali', href: '/note-legali' },
      { name: 'Privacy Policy', href: '/privacy' },
    ],
  }

  return (
    <footer className="bg-dark text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link href={localePath('/')} className="inline-block mb-4">
              <Image
                src="/logo.png"
                alt="IN SY TO - Integration Systems Technology"
                width={150}
                height={40}
                className="brightness-0 invert"
              />
            </Link>
            <p className="text-white/80 mb-4">
              {t('company')}
            </p>
            <p className="text-white/60 text-sm">
              {locale === 'it'
                ? 'Progettazione, integrazione, installazione, collaudo e certificazione di sistemi elettronici ed elettromeccanici.'
                : 'Design, integration, installation, testing and certification of electronic and electromechanical systems.'}
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">{locale === 'it' ? 'Azienda' : 'Company'}</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={localePath(link.href)}
                    className="text-white/80 hover:text-white hover:font-bold hover:scale-105 inline-block transition-all duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">{tNav('services')}</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={localePath(link.href)}
                    className="text-white/80 hover:text-white hover:font-bold hover:scale-105 inline-block transition-all duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">{tNav('contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:info@insyto.it"
                  className="text-white/80 hover:text-white hover:font-bold hover:scale-105 inline-block transition-all duration-300"
                >
                  info@insyto.it
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div className="text-white/80 text-sm">
                  <div>Sede legale: Via Benedetto Croce, 34</div>
                  <div>00142 – Roma</div>
                  <div className="mt-2">Sede operativa: Via Carlo Todini, 33</div>
                  <div>00012 – Guidonia (RM)</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/60 text-sm">
              © {currentYear} IN SY TO srl - {t('vat')}: 11709001009
            </p>
            <div className="flex space-x-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={localePath(link.href)}
                  className="text-white/60 hover:text-white hover:font-bold hover:scale-105 text-sm inline-block transition-all duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

