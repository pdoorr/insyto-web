import { notFound } from 'next/navigation'
import { getProjectBySlug, getProjects } from '@/lib/sanity/queries'
import { Heading, Card } from '@/components/ui'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import { getLocalizedField, getLocalizedArray } from '@/lib/sanity/locale'
import { formatDate } from '@/lib/utils'
import type { Locale } from '@/i18n'

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((project: any) => ({
    slug: project.slug?.current || '',
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    return {
      title: 'Progetto non trovato',
    }
  }

  const title = getLocalizedField(project.title, locale as Locale)
  const description = getLocalizedField(project.description, locale as Locale)

  return {
    title: `${title} | Portfolio | IN SY TO`,
    description: description,
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const title = getLocalizedField(project.title, locale as Locale)
  const description = getLocalizedField(project.description, locale as Locale)
  const content = getLocalizedArray(project.content, locale as Locale)
  const sector = getLocalizedField(project.sector, locale as Locale)

  const isIt = locale === 'it'

  return (
    <div className="section-padding bg-white">
      <div className="container-custom max-w-4xl">
        <Heading as="h1" className="mb-6">
          {title}
        </Heading>

        {description && (
          <p className="text-xl text-dark/80 mb-8">
            {description}
          </p>
        )}

        {project.images && project.images.length > 0 && (
          <div className="mb-12 space-y-4">
            {project.images.map((image: any, index: number) => (
              <div key={index} className="rounded-2xl overflow-hidden">
                <Image
                  src={urlFor(image).width(1200).height(800).url()}
                  alt={image.alt ? getLocalizedField(image.alt, locale as Locale) : title}
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                />
              </div>
            ))}
          </div>
        )}

        {project.htmlContent && project.htmlContent[locale] ? (
          <Card className="mb-8">
            <div
              className="prose prose-lg max-w-none prose-headings:text-dark prose-p:text-dark/80 prose-a:text-primary prose-strong:text-dark prose-li:text-dark/80"
              dangerouslySetInnerHTML={{ __html: project.htmlContent[locale] }}
            />
          </Card>
        ) : content && content.length > 0 && (
          <Card className="mb-8">
            <div className="prose prose-lg max-w-none">
              {content.map((block: any, index: number) => {
                if (block._type === 'block') {
                  return (
                    <p key={index} className="text-dark/80 mb-4">
                      {block.children?.map((child: any) => child.text).join('')}
                    </p>
                  )
                }
                return null
              })}
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {sector && (
            <Card>
              <h3 className="font-bold mb-2">{isIt ? 'Settore' : 'Sector'}</h3>
              <p className="text-dark/80 capitalize">{sector}</p>
            </Card>
          )}
          {project.date && (
            <Card>
              <h3 className="font-bold mb-2">{isIt ? 'Data' : 'Date'}</h3>
              <p className="text-dark/80">
                {formatDate(project.date, locale as Locale)}
              </p>
            </Card>
          )}
        </div>

        {/* Gallery Mosaic */}
        {project.gallery && project.gallery.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">{isIt ? 'Galleria' : 'Gallery'}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {project.gallery.map((item: any, index: number) => {
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
      </div>
    </div>
  )
}

