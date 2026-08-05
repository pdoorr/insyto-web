import { useTranslations } from 'next-intl'

/**
 * Striscia di telemetria sotto il banco.
 *
 * Solo fatti verificabili: anno di inizio attività, costituzione della srl,
 * numero di settori, norme applicate. Nessun numero che non si possa
 * dimostrare — è la stessa regola che il piano di espansione si è dato.
 */
export default function TelemetryStrip() {
  const t = useTranslations('telemetry')

  const readings = [
    { label: t('operatingSince'), value: t('operatingSinceValue') },
    { label: t('incorporated'), value: t('incorporatedValue') },
    { label: t('sectors'), value: t('sectorsValue') },
    { label: t('compliance'), value: t('complianceValue'), suffix: t('complianceSuffix') },
  ]

  return (
    <dl className="grid grid-cols-2 border-b rule-instrument md:grid-cols-4">
      {readings.map((reading) => (
        <div
          key={reading.label}
          className="border-r border-t rule-instrument px-6 py-5 last:border-r-0 md:border-t-0"
        >
          <dt className="label-instrument">{reading.label}</dt>
          <dd className="mt-2 font-mono text-2xl tracking-tight text-instrument-bright tabular">
            {reading.value}
            {reading.suffix && (
              <span className="ml-1 text-xs tracking-[0.06em] text-instrument-signal">
                · {reading.suffix}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}
