import { notFound } from 'next/navigation'
import { getServiceBySlug, getServices } from '@/lib/sanity/queries'
import { Heading, Card } from '@/components/ui'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import { getLocalizedField, getLocalizedArray } from '@/lib/sanity/locale'
import type { Locale } from '@/i18n'

export async function generateStaticParams() {
  const services = await getServices()
  return services.map((service: any) => ({
    slug: service.slug?.current || '',
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const service = await getServiceBySlug(slug)

  if (!service) {
    return {
      title: 'Servizio non trovato',
    }
  }

  const title = getLocalizedField(service.title, locale as Locale)
  const description = getLocalizedField(service.description, locale as Locale)

  return {
    title: `${title} | IN SY TO`,
    description: description,
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const service = await getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  const title = getLocalizedField(service.title, locale as Locale)
  const description = getLocalizedField(service.description, locale as Locale)
  const content = getLocalizedArray(service.content, locale as Locale)
  const applications = getLocalizedArray(service.applications, locale as Locale) || []

  const isIt = locale === 'it'

  return (
    <div className="section-padding bg-white">
      <div className="container-custom">
        {/* Hero Section */}
        <div className="mb-16">
          {service.banner && service.banner[locale] ? (
            <div className="rounded-2xl overflow-hidden mb-6">
              <Image
                src={urlFor(service.banner[locale]).width(1200).height(400).url()}
                alt={service.banner[locale].alt || title}
                width={1200}
                height={400}
                className="w-full h-auto"
              />
            </div>
          ) : (
            <Heading as="h1" className="mb-6">
              {title}
            </Heading>
          )}
          {description && (
            <p className="text-xl text-dark/80 max-w-3xl">
              {description}
            </p>
          )}
        </div>

        {/* Image */}
        {service.image && (
          <div className="mb-16 rounded-2xl overflow-hidden">
            <Image
              src={urlFor(service.image).width(1200).height(600).url()}
              alt={service.image.alt ? getLocalizedField(service.image.alt, locale as Locale) : title}
              width={1200}
              height={600}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Content */}
        {service.htmlContent && service.htmlContent[locale] ? (
          <div
            className="prose prose-lg max-w-none mb-16 prose-headings:text-dark prose-p:text-dark/80 prose-a:text-primary prose-strong:text-dark prose-ul:text-dark/80 prose-li:text-dark/80"
            dangerouslySetInnerHTML={{ __html: service.htmlContent[locale] }}
          />
        ) : content && content.length > 0 && (
          <div className="prose prose-lg max-w-none mb-16">
            {/* Render Sanity portable text */}
            <div className="text-dark/80 space-y-4">
              {content.map((block: any, index: number) => {
                if (block._type === 'block') {
                  return (
                    <p key={index} className="text-lg leading-relaxed">
                      {block.children?.map((child: any, childIndex: number) => child.text).join('')}
                    </p>
                  )
                }
                return null
              })}
            </div>
          </div>
        )}

        {/* Applications */}
        {applications.length > 0 && (
          <Card className="mb-16">
            <h2 className="text-2xl font-bold mb-6">{isIt ? 'Applicazioni' : 'Applications'}</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applications.map((app: string, index: number) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-dark/80">{app}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Gallery Mosaic */}
        {service.gallery && service.gallery.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">{isIt ? 'Galleria' : 'Gallery'}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {service.gallery.map((item: any, index: number) => {
                // In Sanity la galleria è un array di oggetti con campo 'image'
                const imageObj = item.image || item
                const imageUrl = urlFor(imageObj).width(400).height(400).url()
                const altText = imageObj?.alt ? getLocalizedField(imageObj.alt, locale as Locale) : `${isIt ? 'Immagine' : 'Image'} ${index + 1}`

                return (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-lg group"
                  >
                    <Image
                      src={imageUrl}
                      alt={altText}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <Card variant="glass" className="bg-gradient-to-br from-primary/10 to-accent/10">
            <h3 className="text-2xl font-bold mb-4">
              {isIt ? 'Interessato a questo servizio?' : 'Interested in this service?'}
            </h3>
            <p className="text-dark/80 mb-6">
              {isIt ? 'Contattaci per maggiori informazioni' : 'Contact us for more information'}
            </p>
            <a
              href={`/${locale}/contatti`}
              className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              {isIt ? 'Contattaci' : 'Contact Us'}
            </a>
          </Card>
        </div>
      </div>
    </div>
  )
}

