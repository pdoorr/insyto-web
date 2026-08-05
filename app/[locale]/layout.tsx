import { Header, Footer } from '@/components/layout'
import { generateStructuredData } from '@/lib/seo'
import type { Metadata } from 'next'
import type { Locale } from '@/i18n'
import { Geist, Geist_Mono, Source_Code_Pro } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import './globals.css'

const sans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

// Banco di misura: titoli, etichette e valori.
const mono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

// Tavola tecnica: titoli e annotazioni delle pagine di capability.
const draft = Source_Code_Pro({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-draft',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'IN SY TO - Integration Systems Technology',
  description: 'Progettazione, integrazione, installazione, collaudo e certificazione di sistemi elettronici ed elettromeccanici',
  keywords: ['sistemi elettronici', 'elettromeccanici', 'progettazione', 'integrazione', 'spazio', 'difesa', 'industriale'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.insyto.it'),
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Get messages for the locale
  const messages = await getMessages({ locale })

  const organizationSchema = generateStructuredData({
    type: 'Organization',
    name: 'IN SY TO srl',
    description: 'Integration Systems Technology - Progettazione, integrazione, installazione, collaudo e certificazione di sistemi elettronici ed elettromeccanici',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.insyto.it',
  })

  return (
    <html lang={locale} className={`${sans.variable} ${mono.variable} ${draft.variable}`}>
      <body className="antialiased bg-instrument-ground text-instrument-text">
        <NextIntlClientProvider messages={messages}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          />
          <Header locale={locale as Locale} />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer locale={locale as Locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

