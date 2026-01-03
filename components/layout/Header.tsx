'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Globe } from 'lucide-react'
import { Button } from '@/components/ui'
import { useTranslations } from 'next-intl'
import { locales, localeNames, localeFlags, type Locale } from '@/i18n'

interface HeaderProps {
  locale: Locale
}

export default function Header({ locale: currentLocale }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const t = useTranslations('nav')
  const tCommon = useTranslations('common')

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('about'), href: '/profilo' },
    {
      name: t('services'),
      href: '/servizi',
      submenu: [
        { name: 'Macchine', href: '/servizi/macchine' },
        { name: 'Impianti', href: '/servizi/impianti' },
        { name: 'Sistemi Elettronici', href: '/servizi/sistemi-elettronici' },
        { name: 'Radiocomunicazione', href: '/servizi/radiocomunicazione' },
      ],
    },
    { name: t('portfolio'), href: '/portfolio' },
    { name: t('blog'), href: '/blog' },
    { name: t('workWithUs'), href: '/lavora-con-noi' },
    { name: t('contact'), href: '/contatti' },
  ]

  const localePath = (path: string) => `/${currentLocale}${path}`

  const switchLocale = (newLocale: Locale) => {
    if (typeof window !== 'undefined') {
      const pathWithoutLocale = window.location.pathname.replace(`/${currentLocale}`, '') || '/'
      return `/${newLocale}${pathWithoutLocale}`
    }
    return `/${newLocale}`
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/20">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={localePath('/')} className="flex items-center">
            <Image
              src="/logo.png"
              alt="IN SY TO - Integration Systems Technology"
              width={150}
              height={40}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => {
              if (item.submenu) {
                return (
                  <div
                    key={item.name}
                    className="relative group"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <button className="text-dark hover:text-primary transition-colors font-medium">
                      {item.name}
                    </button>
                    {servicesOpen && (
                      <div className="absolute top-full left-0 -mt-1 w-64 glass rounded-lg shadow-lg p-2">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.name}
                            href={localePath(subitem.href)}
                            className="block px-4 py-2 text-sm text-dark hover:text-primary hover:bg-primary/10 rounded transition-colors"
                          >
                            {subitem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }
              return (
                <Link
                  key={item.name}
                  href={localePath(item.href)}
                  className="text-dark hover:text-primary transition-colors font-medium"
                >
                  {item.name}
                </Link>
              )
            })}
            <Button href={localePath('/contatti')} size="sm">
              {tCommon('contactUs')}
            </Button>

            {/* Language Switcher */}
            <div
              className="relative"
              onMouseEnter={() => setLangMenuOpen(true)}
              onMouseLeave={() => setLangMenuOpen(false)}
            >
              <button className="flex items-center space-x-2 text-dark hover:text-primary transition-colors font-medium">
                <Globe size={18} />
                <span>{localeFlags[currentLocale]} {localeNames[currentLocale]}</span>
              </button>
              {langMenuOpen && (
                <div className="absolute top-full right-0 -mt-1 w-40 glass rounded-lg shadow-lg p-2">
                  {locales.map((loc) => (
                    <Link
                      key={loc}
                      href={switchLocale(loc)}
                      className={`block px-4 py-2 text-sm hover:text-primary hover:bg-primary/10 rounded transition-colors ${
                        loc === currentLocale ? 'text-primary font-medium' : 'text-dark'
                      }`}
                    >
                      {localeFlags[loc]} {localeNames[loc]}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-dark"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/20">
            {navigation.map((item) => {
              if (item.submenu) {
                return (
                  <div key={item.name} className="py-2">
                    <div className="text-dark font-medium mb-2">{item.name}</div>
                    <div className="pl-4 space-y-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.name}
                          href={localePath(subitem.href)}
                          className="block py-2 text-sm text-dark/80 hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              }
              return (
                <Link
                  key={item.name}
                  href={localePath(item.href)}
                  className="block py-2 text-dark hover:text-primary transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            })}
            <div className="pt-4 space-y-2">
              <Button href={localePath('/contatti')} className="w-full" size="sm">
                {tCommon('contactUs')}
              </Button>

              {/* Mobile Language Switcher */}
              <div className="pt-2 border-t border-white/20">
                <div className="text-sm text-dark/60 mb-2">Language</div>
                <div className="space-y-1">
                  {locales.map((loc) => (
                    <Link
                      key={loc}
                      href={switchLocale(loc)}
                      className={`block px-4 py-2 text-sm hover:text-primary hover:bg-primary/10 rounded transition-colors ${
                        loc === currentLocale ? 'text-primary font-medium' : 'text-dark'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {localeFlags[loc]} {localeNames[loc]}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

