import { TestBench, TelemetryStrip, SectorGrid, RequestPanel } from '@/components/instrument'

/**
 * Home: mondo "strumento".
 *
 * L'ordine è quello di una lettura da pannello — che cosa misuriamo, i dati
 * verificabili, dove finiscono i sistemi, come iniziare. Le pagine di
 * capability passano invece al mondo "tavola".
 */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return (
    <>
      <TestBench locale={locale} />
      <TelemetryStrip />
      <SectorGrid />
      <RequestPanel locale={locale} />
    </>
  )
}
