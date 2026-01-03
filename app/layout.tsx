import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './[locale]/globals.css'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
