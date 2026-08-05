import { useTranslations } from 'next-intl'

/**
 * Il foglio: cornice, filo interno e cartiglio in basso.
 *
 * È l'involucro delle pagine di capability. Il cartiglio non è un ornamento —
 * porta gli stessi campi di una tavola reale (committente, oggetto, scala,
 * data, revisione, foglio) e dichiara che questa azienda consegna documenti,
 * che è l'argomento di vendita della sezione.
 */
export default function TechnicalSheet({
  children,
  sheetNumber = '01',
  totalSheets = '08',
  date,
}: {
  children: React.ReactNode
  sheetNumber?: string
  totalSheets?: string
  /** Anno-mese, es. "2026-08". Passato dal chiamante per restare statico. */
  date: string
}) {
  const t = useTranslations('sheet')

  const titleBlock = [
    { label: t('client'), value: 'IN SY TO srl' },
    { label: t('subject'), value: t('subjectValue') },
    { label: t('scale'), value: t('scaleValue') },
    { label: t('date'), value: date },
    { label: t('revision'), value: t('revisionValue') },
    { label: t('sheetNo'), value: `${sheetNumber} / ${totalSheets}` },
  ]

  return (
    <div className="sheet-world px-4 py-6 sm:px-6 sm:py-8">
      <div className="sheet-frame mx-auto max-w-7xl">
        <div className="relative z-10">{children}</div>

        <dl className="relative z-10 grid grid-cols-2 border-t border-sheet-ink sm:grid-cols-3 lg:grid-cols-6">
          {titleBlock.map((field) => (
            <div
              key={field.label}
              className="border-r border-t border-sheet-hairline px-4 py-3 last:border-r-0 lg:border-t-0"
            >
              <dt className="font-draft text-[9px] uppercase tracking-[0.16em] text-sheet-hair">
                {field.label}
              </dt>
              <dd className="mt-1 font-draft text-[12.5px] text-sheet-ink tabular">{field.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
