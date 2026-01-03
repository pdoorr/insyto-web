import { getBlogPosts } from '@/lib/sanity/queries'
import { Heading, Card } from '@/components/ui'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import { formatDate } from '@/lib/utils'
import { getLocalizedField } from '@/lib/sanity/locale'
import type { Locale } from '@/i18n'

interface BlogPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { locale } = await params
  const isIt = locale === 'it'

  return {
    title: isIt ? 'Blog | IN SY TO' : 'Blog | IN SY TO',
    description: isIt
      ? 'News e aggiornamenti da IN SY TO - Integration Systems Technology'
      : 'News and updates from IN SY TO - Integration Systems Technology',
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params
  const posts = await getBlogPosts()

  return (
    <div className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <Heading as="h1" className="mb-6">
            Blog & News
          </Heading>
          <p className="text-xl text-dark/80 max-w-3xl mx-auto">
            {locale === 'it'
              ? 'Resta aggiornato sulle ultime novità e progetti di IN SY TO'
              : 'Stay updated on the latest news and projects from IN SY TO'}
          </p>
        </div>

        {posts.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-dark/60">
              {locale === 'it' ? 'Nessun articolo disponibile al momento.' : 'No articles available at the moment.'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => {
              const title = getLocalizedField(post.title, locale as Locale)
              const excerpt = getLocalizedField(post.excerpt, locale as Locale)
              const imageAlt = post.image?.alt ? getLocalizedField(post.image.alt, locale as Locale) : title

              return (
                <Link
                  key={post._id}
                  href={`/${locale}/blog/${post.slug?.current || ''}`}
                >
                  <Card hover className="h-full group overflow-hidden flex flex-col">
                    {post.image && (
                      <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={urlFor(post.image).width(600).height(400).url()}
                          alt={imageAlt}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col">
                      {post.publishedAt && (
                        <time className="text-sm text-dark/60 mb-2">
                          {formatDate(post.publishedAt, locale as Locale)}
                        </time>
                      )}
                      <h3 className="text-xl font-bold mb-3 text-dark group-hover:text-primary transition-colors">
                        {title}
                      </h3>
                      {excerpt && (
                        <p className="text-dark/70 line-clamp-3 mb-4 flex-1">
                          {excerpt}
                        </p>
                      )}
                      {post.author && (
                        <p className="text-sm text-dark/60">
                          {locale === 'it' ? 'di' : 'by'} {post.author}
                        </p>
                      )}
                    </div>
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

