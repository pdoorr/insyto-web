import { getServices } from '@/lib/sanity/queries'
import { Heading, Card } from '@/components/ui'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getLocalizedField } from '@/lib/sanity/locale'
import type { Locale } from '@/i18n'

interface ServicesPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ServicesPageProps) {
  const { locale } = await params
  const isIt = locale === 'it'

  return {
    title: isIt ? 'Servizi | IN SY TO' : 'Services | IN SY TO',
    description: isIt
      ? 'I nostri servizi: progettazione, integrazione, installazione, collaudo e certificazione, manutenzione'
      : 'Our services: design, integration, installation, testing and certification, maintenance',
  }
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params
  const services = await getServices()

  return (
    <div className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <Heading as="h1" className="mb-6">
            {locale === 'it' ? 'I Nostri Servizi' : 'Our Services'}
          </Heading>
          <p className="text-xl text-dark/80 max-w-3xl mx-auto">
            {locale === 'it'
              ? 'Soluzioni complete per ogni esigenza nel campo dei sistemi elettronici ed elettromeccanici'
              : 'Complete solutions for all needs in the field of electronic and electromechanical systems'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service: any) => {
            const title = getLocalizedField(service.title, locale as Locale)
            const description = getLocalizedField(service.description, locale as Locale)

            return (
              <Link
                key={service._id}
                href={`/${locale}/servizi/${service.slug?.current || ''}`}
              >
                <Card hover className="h-full group">
                  {service.icon && (
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">{service.icon}</span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-3 text-dark group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                  {description && (
                    <p className="text-dark/70 mb-4 line-clamp-3">
                      {description}
                    </p>
                  )}
                  <div className="flex items-center text-primary group-hover:translate-x-2 transition-transform">
                    <span className="text-sm font-medium">
                      {locale === 'it' ? 'Scopri di più' : 'Learn more'}
                    </span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

