import Link from 'next/link'
import { getServices } from '@/lib/sanity/queries'
import { getLocalizedField } from '@/lib/sanity/locale'
import { TechnicalSheet, DimensionRule, RevisionNote } from '@/components/sheet'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n'

/**
 * Pagina capability: mondo "tavola".
 *
 * Due tassonomie, che sono davvero due cose diverse:
 * - le cinque capacità (che cosa facciamo, dal disegno alla manutenzione),
 *   che vivono nel catalogo messaggi perché sono stabili e vanno tradotte;
 * - i domini applicativi (che cosa costruiamo), che vivono su Sanity e sono i
 *   bersagli dei redirect 301 dal vecchio sito.
 */

const CAPABILITIES = [
  'progettazione',
  'integrazione',
  'installazione',
  'collaudo',
  'manutenzione',
] as const

// Data del cartiglio: costante, così la pagina resta statica e riproducibile.
const SHEET_DATE = '2026-08'

interface ServicesPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ServicesPageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'services' })

  return {
    title: `${t('title')} | IN SY TO`,
    description: t('subtitle'),
  }
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'services' })
  const tSheet = await getTranslations({ locale, namespace: 'sheet' })

  // I domini arricchiscono la pagina ma non la reggono: se il CMS non risponde
  // le capacità restano comunque leggibili.
  let domains: any[] = []
  try {
    domains = (await getServices()) ?? []
  } catch (error) {
    console.error('Sanity non raggiungibile, mostro solo le capacità:', error)
  }

  return (
    <TechnicalSheet date={SHEET_DATE}>
      <div className="px-6 py-12 sm:px-10 sm:py-16">
        <DimensionRule />

        <h1 className="title-sheet my-3 max-w-[21ch] text-[clamp(1.4rem,3.4vw,2.4rem)] leading-[1.14]">
          {t('sheetTitle')}
        </h1>

        <DimensionRule extent={0.7} dashed />

        <p className="mt-6 max-w-[58ch] text-[16px] leading-relaxed text-sheet-soft">
          {t('sheetIntro')}
        </p>

        <div className="mt-7">
          <RevisionNote>{t('revisionNote')}</RevisionNote>
        </div>
      </div>

      <ul className="grid border-t border-sheet-hair sm:grid-cols-2 lg:grid-cols-3">
        {CAPABILITIES.map((capability, index) => (
          <li
            key={capability}
            className="border-b border-r border-sheet-hairline px-6 py-6 last:border-r-0"
          >
            <p className="label-sheet tabular">A—{String(index + 1).padStart(2, '0')}</p>
            <h2 className="title-sheet mt-3 text-[13px] tracking-[0.04em]">
              {t(`items.${capability}.name`)}
            </h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-sheet-soft">
              {t(`items.${capability}.description`)}
            </p>
          </li>
        ))}

        <li className="border-b border-sheet-hairline px-6 py-6">
          <p className="label-sheet">{tSheet('standards')}</p>
          <p className="mt-3 font-draft text-[12.5px] leading-relaxed text-sheet-ink">
            {tSheet('standardsValue')}
          </p>
          <p className="label-sheet mt-5">{tSheet('deliverables')}</p>
          <p className="mt-3 font-draft text-[12.5px] leading-relaxed text-sheet-ink">
            {tSheet('deliverablesValue')}
          </p>
        </li>
      </ul>

      {domains.length > 0 && (
        <ul className="grid border-t border-sheet-hair sm:grid-cols-2 lg:grid-cols-4">
          {domains.map((domain: any, index: number) => {
            const title = getLocalizedField(domain.title, locale as Locale)
            const description = getLocalizedField(domain.description, locale as Locale)
            const slug = domain.slug?.current

            return (
              <li key={domain._id} className="border-b border-r border-sheet-hairline last:border-r-0">
                <Link
                  href={`/${locale}/servizi/${slug ?? ''}`}
                  className="group block h-full px-6 py-6 transition-colors hover:bg-sheet-paper"
                >
                  <p className="label-sheet tabular">B—{String(index + 1).padStart(2, '0')}</p>
                  <h2 className="title-sheet mt-3 text-[13px] tracking-[0.04em] group-hover:text-primary">
                    {title}
                  </h2>
                  {description && (
                    <p className="mt-2 line-clamp-4 text-[13.5px] leading-relaxed text-sheet-soft">
                      {description}
                    </p>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </TechnicalSheet>
  )
}
