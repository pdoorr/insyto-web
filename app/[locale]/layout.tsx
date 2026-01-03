import { Header, Footer } from '@/components/layout'
import { generateStructuredData } from '@/lib/seo'
import type { Metadata } from 'next'
import type { Locale } from '@/i18n'
import { Inter, Space_Grotesk } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
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
    <html lang={locale} className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased bg-light text-dark">
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

