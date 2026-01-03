import { Metadata } from 'next'

export function generateMetadata({
  title,
  description,
  image,
  url,
}: {
  title: string
  description?: string
  image?: string
  url?: string
}): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.insyto.it'
  const fullTitle = `${title} | IN SY TO`
  const fullDescription = description || 'IN SY TO - Integration Systems Technology. Progettazione, integrazione, installazione, collaudo e certificazione di sistemi elettronici ed elettromeccanici.'

  return {
    title: fullTitle,
    description: fullDescription,
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: url || siteUrl,
      siteName: 'IN SY TO',
      images: image ? [{ url: image }] : [],
      locale: 'it_IT',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: url || siteUrl,
    },
  }
}

export function generateStructuredData({
  type,
  name,
  description,
  url,
  image,
}: {
  type: 'Organization' | 'WebSite' | 'Article' | 'Service'
  name: string
  description?: string
  url?: string
  image?: string
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.insyto.it'

  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    ...(description && { description }),
    ...(url && { url }),
    ...(image && { image }),
  }

  if (type === 'Organization') {
    return {
      ...baseData,
      '@type': 'Organization',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Via Benedetto Croce, 34',
        addressLocality: 'Roma',
        postalCode: '00142',
        addressCountry: 'IT',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'info@insyto.it',
        contactType: 'customer service',
      },
    }
  }

  return baseData
}

