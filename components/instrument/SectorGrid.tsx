import { useTranslations } from 'next-intl'

const SECTORS = ['spazio', 'difesa', 'industriale', 'civile'] as const

/**
 * I quattro settori, trattati come voci di un pannello e non come card:
 * niente icone decorative, l'ordinale fa da riferimento.
 */
export default function SectorGrid() {
  const t = useTranslations('sectors')

  return (
    <section className="border-b rule-instrument px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
      <h2 className="max-w-[20ch] font-mono text-[clamp(1.25rem,2.4vw,1.9rem)] font-medium uppercase tracking-tight text-instrument-bright text-balance">
        {t('title')}
      </h2>
      <p className="mt-4 max-w-[54ch] text-[15px] leading-relaxed text-instrument-dim">
        {t('subtitle')}
      </p>

      <ul className="mt-12 grid gap-px border-t rule-instrument sm:grid-cols-2 lg:grid-cols-4">
        {SECTORS.map((sector, index) => (
          <li key={sector} className="border-b border-r rule-instrument py-6 pr-6 last:border-r-0">
            <p className="font-mono text-[10.5px] tabular text-instrument-signal">
              {String(index + 1).padStart(2, '0')}
            </p>
            <h3 className="mt-3 font-mono text-sm uppercase tracking-[0.08em] text-instrument-bright">
              {t(`items.${sector}.name`)}
            </h3>
            <p className="mt-3 text-[13.5px] leading-relaxed text-instrument-dim">
              {t(`items.${sector}.description`)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
