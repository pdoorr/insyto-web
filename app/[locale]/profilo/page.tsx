import { Heading, Card } from '@/components/ui'
import { CheckCircle2 } from 'lucide-react'
import { getCompanyProfile } from '@/lib/sanity/queries'

export const metadata = {
  title: 'Profilo | IN SY TO',
  description: 'Chi siamo: IN SY TO srl - Integration Systems Technology',
}

// Dati statici di fallback
const staticProfile = {
  title: 'Profilo Aziendale',
  intro: 'IN SY TO srl si contraddistingue sul mercato grazie alle sue caratteristiche di professionalità, competenza, esperienza pluriennale, elevati standard di sicurezza, certificazioni e qualità.',
  description: 'IN SY TO srl si occupa della fornitura, installazione, trasformazione, ampliamento e manutenzione di impianti elettrici e di telecomunicazioni e della progettazione, costruzione, integrazione, installazione di:',
  competenciesTitle: 'Le Nostre Competenze',
  competencies: [
    'Sistemi ed impianti elettronici ed elettromeccanici "chiavi in mano"',
    'Sistemi di acquisizione ed elaborazione dati',
    'Impianti elettrici civili ed industriali',
    'Impianti di radiocomunicazione e ponti radio',
    'Impianti di climatizzazione',
    'Documentazione, collaudo e certificazione',
  ],
  legalAddress: {
    address: 'Via Benedetto Croce, 34',
    city: '00142 – Roma',
  },
  operationalAddress: {
    address: 'Via Carlo Todini, 33',
    city: '00012 – Guidonia (RM)',
  },
}

export default async function ProfiloPage() {
  // Recupera i dati dal CMS
  const cmsProfile = await getCompanyProfile()

  // Usa i dati del CMS se disponibili e validi, altrimenti usa i dati statici
  const hasValidCmsData = cmsProfile && cmsProfile.title && typeof cmsProfile.title === 'string'
  const profile = hasValidCmsData ? cmsProfile : staticProfile

  // Estrai le competenze in modo compatibile con entrambi i formati
  const competencies = hasValidCmsData && cmsProfile.competencies
    ? cmsProfile.competencies.map((c: any) => c.text)
    : staticProfile.competencies

  // Estrai indirizzi in modo compatibile
  const legalAddress = (hasValidCmsData && cmsProfile.legalAddress) || staticProfile.legalAddress
  const operationalAddress = (hasValidCmsData && cmsProfile.operationalAddress) || staticProfile.operationalAddress

  return (
    <div className="section-padding bg-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <Heading as="h1" className="mb-8">
            {profile.title}
          </Heading>

          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-xl text-dark/80 mb-6">
              {profile.intro}
            </p>
            <p className="text-lg text-dark/70 mb-6">
              {profile.description}
            </p>
          </div>

          <Card className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              {profile.competenciesTitle}
            </h2>
            <ul className="space-y-4">
              {competencies.map((item: string, index: number) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-dark/80">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card>
              <h3 className="text-xl font-bold mb-4">Sede Legale</h3>
              <p className="text-dark/80">
                {legalAddress?.address && (
                  <>
                    {legalAddress.address}
                    <br />
                  </>
                )}
                {legalAddress?.city}
              </p>
            </Card>
            <Card>
              <h3 className="text-xl font-bold mb-4">Sede Operativa</h3>
              <p className="text-dark/80">
                {operationalAddress?.address && (
                  <>
                    {operationalAddress.address}
                    <br />
                  </>
                )}
                {operationalAddress?.city}
              </p>
            </Card>
          </div>

          {/* HTML extra se presente nel CMS */}
          {cmsProfile?.htmlContent && (
            <Card>
              <div
                className="prose prose-lg max-w-none prose-headings:text-dark prose-p:text-dark/80 prose-a:text-primary prose-strong:text-dark prose-li:text-dark/80"
                dangerouslySetInnerHTML={{ __html: cmsProfile.htmlContent }}
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
