import { getProjects } from '@/lib/sanity/queries'
import { Heading, Card } from '@/components/ui'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity/image'
import { getLocalizedField } from '@/lib/sanity/locale'
import type { Locale } from '@/i18n'

interface PortfolioPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PortfolioPageProps) {
  const { locale } = await params
  const isIt = locale === 'it'

  return {
    title: isIt ? 'Portfolio | IN SY TO' : 'Portfolio | IN SY TO',
    description: isIt
      ? 'I nostri progetti: esempi di sistemi elettronici ed elettromeccanici realizzati'
      : 'Our projects: examples of electronic and electromechanical systems implemented',
  }
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { locale } = await params
  const projects = await getProjects()

  return (
    <div className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <Heading as="h1" className="mb-6">
            {locale === 'it' ? 'Portfolio Progetti' : 'Project Portfolio'}
          </Heading>
          <p className="text-xl text-dark/80 max-w-3xl mx-auto">
            {locale === 'it'
              ? 'Esempi dei nostri progetti realizzati nei settori Spazio, Difesa, Industriale e Civile'
              : 'Examples of our projects in the Space, Defense, Industrial and Civil sectors'}
          </p>
        </div>

        {projects.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-dark/60">
              {locale === 'it' ? 'Nessun progetto disponibile al momento.' : 'No projects available at the moment.'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project: any) => {
              const title = getLocalizedField(project.title, locale as Locale)
              const description = getLocalizedField(project.description, locale as Locale)
              const sector = getLocalizedField(project.sector, locale as Locale)

              return (
                <Link
                  key={project._id}
                  href={`/${locale}/portfolio/${project.slug?.current || ''}`}
                >
                  <Card hover className="h-full group overflow-hidden">
                    {project.images && project.images[0] && (
                      <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={urlFor(project.images[0]).width(600).height(400).url()}
                          alt={getLocalizedField(project.images[0].alt, locale as Locale) || title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-bold mb-2 text-dark group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    {description && (
                      <p className="text-dark/70 line-clamp-3 mb-4">
                        {description}
                      </p>
                    )}
                    {sector && (
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {sector}
                      </span>
                    )}
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

