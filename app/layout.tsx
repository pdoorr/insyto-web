// I font sono dichiarati in app/[locale]/layout.tsx, che e' il layout che
// possiede <html> e <body>: qui sarebbero scaricati e mai applicati.
import type { Metadata } from 'next'
import './[locale]/globals.css'

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
