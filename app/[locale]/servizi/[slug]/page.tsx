import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getServiceBySlug, getServices } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import { getLocalizedField, getLocalizedArray } from '@/lib/sanity/locale'
import { TechnicalSheet, DimensionRule, RevisionNote, PortableText } from '@/components/sheet'
import type { Locale } from '@/i18n'

export const dynamic = 'force-static'

// Data del cartiglio: costante, così la pagina resta statica e riproducibile.
const SHEET_DATE = '2026-08'

export async function generateStaticParams() {
  try {
    const services = await getServices()
    return (services ?? []).map((service: any) => ({
      slug: service.slug?.current || '',
    }))
  } catch (error) {
    // Senza CMS raggiungibile si esce con zero pagine invece di rompere il build.
    console.error('Sanity non raggiungibile in generateStaticParams:', error)
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const service = await getServiceBySlug(slug)

  if (!service) {
    return { title: 'IN SY TO' }
  }

  return {
    title: `${getLocalizedField(service.title, locale as Locale)} | IN SY TO`,
    description: getLocalizedField(service.description, locale as Locale),
  }
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const service = await getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  const t = await getTranslations({ locale, namespace: 'services' })
  const tSheet = await getTranslations({ locale, namespace: 'sheet' })
  const tCta = await getTranslations({ locale, namespace: 'cta' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  const title = getLocalizedField(service.title, locale as Locale)
  const description = getLocalizedField(service.description, locale as Locale)
  const content = getLocalizedArray(service.content, locale as Locale)
  const applications = getLocalizedArray(service.applications, locale as Locale) ?? []
  const banner = service.banner?.[locale]
  const html = service.htmlContent?.[locale]

  return (
    <TechnicalSheet date={SHEET_DATE} sheetNumber="02">
      <div className="px-6 py-12 sm:px-10 sm:py-16">
        <Link
          href={`/${locale}/servizi`}
          className="label-sheet hover:text-sheet-ink"
        >
          ← {tNav('services')}
        </Link>

        <div className="mt-8">
          <DimensionRule />
        </div>

        {banner ? (
          <div className="my-4 border border-sheet-hairline">
            <Image
              src={urlFor(banner).width(1200).height(400).url()}
              alt={banner.alt || title}
              width={1200}
              height={400}
              className="h-auto w-full"
              priority
            />
          </div>
        ) : (
          <h1 className="title-sheet my-3 max-w-[21ch] text-[clamp(1.4rem,3.4vw,2.4rem)] leading-[1.14]">
            {title}
          </h1>
        )}

        <DimensionRule extent={0.7} dashed />

        {description && (
          <p className="mt-6 max-w-[58ch] text-[16px] leading-relaxed text-sheet-soft">
            {description}
          </p>
        )}

        <div className="mt-7">
          <RevisionNote>{t('revisionNote')}</RevisionNote>
        </div>

        {service.image && (
          <div className="mt-10 border border-sheet-hairline">
            <Image
              src={urlFor(service.image).width(1200).height(600).url()}
              alt={
                service.image.alt
                  ? getLocalizedField(service.image.alt, locale as Locale)
                  : title
              }
              width={1200}
              height={600}
              className="h-auto w-full"
            />
          </div>
        )}

        {html ? (
          <div
            className="prose prose-sheet mt-8 max-w-[68ch] text-[15px] leading-relaxed text-sheet-soft prose-headings:title-sheet prose-a:text-primary prose-strong:text-sheet-ink"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div className="mt-8">
            <PortableText value={content as any[]} />
          </div>
        )}
      </div>

      {applications.length > 0 && (
        <div className="border-t border-sheet-hair px-6 py-10 sm:px-10">
          <h2 className="label-sheet">{tSheet('deliverables')}</h2>
          <ul className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {applications.map((application: string, index: number) => (
              <li key={index} className="flex gap-3 text-[14px] leading-relaxed text-sheet-soft">
                <span className="label-sheet tabular pt-[3px]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {application}
              </li>
            ))}
          </ul>
        </div>
      )}

      {service.gallery?.length > 0 && (
        <ul className="grid grid-cols-2 gap-px border-t border-sheet-hair bg-sheet-hairline sm:grid-cols-3 lg:grid-cols-4">
          {service.gallery.map((item: any, index: number) => {
            const image = item.image || item
            const alt = image?.alt
              ? getLocalizedField(image.alt, locale as Locale)
              : `${title} — ${index + 1}`

            return (
              <li key={index} className="relative aspect-square bg-sheet-surface">
                <Image
                  src={urlFor(image).width(600).height(600).url()}
                  alt={alt}
                  width={600}
                  height={600}
                  className="h-full w-full object-cover"
                />
              </li>
            )
          })}
        </ul>
      )}

      <div className="border-t border-sheet-hair px-6 py-10 sm:px-10">
        <h2 className="title-sheet max-w-[24ch] text-[15px]">{tCta('title')}</h2>
        <p className="mt-3 max-w-[58ch] text-[14.5px] leading-relaxed text-sheet-soft">
          {tCta('body')}
        </p>
        <Link
          href={`/${locale}/contatti`}
          className="mt-6 inline-block border border-sheet-ink px-5 py-3 font-draft text-[11px] uppercase tracking-[0.14em] text-sheet-ink transition-colors hover:bg-sheet-ink hover:text-sheet-surface"
        >
          {tCta('action')}
        </Link>
      </div>
    </TechnicalSheet>
  )
}
