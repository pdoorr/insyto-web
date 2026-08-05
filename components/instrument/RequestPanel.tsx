import { useTranslations } from 'next-intl'
import Link from 'next/link'

/**
 * Chiusura della home.
 *
 * La nota sull'export control non è legalese di riempimento: il sito è il
 * primo contatto e mostra solo capability e heritage, mentre il dettaglio
 * tecnico passa da NDA. Dirlo apertamente qualifica l'interlocutore.
 */
export default function RequestPanel({ locale }: { locale: string }) {
  const t = useTranslations('cta')

  return (
    <section className="px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
      <div className="max-w-[62ch]">
        <h2 className="font-mono text-[clamp(1.25rem,2.4vw,1.9rem)] font-medium uppercase tracking-tight text-instrument-bright text-balance">
          {t('title')}
        </h2>
        <p className="mt-5 text-[15.5px] leading-relaxed text-instrument-dim">{t('body')}</p>

        <Link
          href={`/${locale}/contatti`}
          className="mt-8 inline-block border border-instrument-signal px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-instrument-signal transition-colors hover:bg-instrument-signal hover:text-instrument-ground"
        >
          {t('action')}
        </Link>

        <p className="mt-6 flex items-start gap-2 label-instrument leading-relaxed">
          <span aria-hidden="true" className="text-instrument-signal">
            ▲
          </span>
          {t('note')}
        </p>
      </div>
    </section>
  )
}
