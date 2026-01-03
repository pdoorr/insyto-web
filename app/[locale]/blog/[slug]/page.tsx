import { notFound } from 'next/navigation'
import { getBlogPostBySlug, getBlogPosts } from '@/lib/sanity/queries'
import { Heading, Card } from '@/components/ui'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import { getLocalizedField, getLocalizedArray } from '@/lib/sanity/locale'
import { formatDate } from '@/lib/utils'
import type { Locale } from '@/i18n'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post: any) => ({
    slug: post.slug?.current || '',
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: 'Articolo non trovato',
    }
  }

  const title = getLocalizedField(post.title, locale as Locale)
  const excerpt = getLocalizedField(post.excerpt, locale as Locale)

  return {
    title: `${title} | Blog | IN SY TO`,
    description: excerpt || title,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const title = getLocalizedField(post.title, locale as Locale)
  const excerpt = getLocalizedField(post.excerpt, locale as Locale)
  const content = getLocalizedArray(post.content, locale as Locale)
  const categories = getLocalizedArray(post.categories, locale as Locale) || []
  const tags = getLocalizedArray(post.tags, locale as Locale) || []

  const isIt = locale === 'it'

  return (
    <article className="section-padding bg-white">
      <div className="container-custom max-w-4xl">
        <header className="mb-12">
          {post.publishedAt && (
            <time className="text-sm text-dark/60 mb-4 block">
              {formatDate(post.publishedAt, locale as Locale)}
            </time>
          )}
          <Heading as="h1" className="mb-6">
            {title}
          </Heading>
          {excerpt && (
            <p className="text-xl text-dark/80 mb-6">
              {excerpt}
            </p>
          )}
          {post.author && (
            <p className="text-dark/60">
              {isIt ? 'di' : 'by'} <span className="font-medium">{post.author}</span>
            </p>
          )}
        </header>

        {post.image && (
          <div className="mb-12 rounded-2xl overflow-hidden">
            <Image
              src={urlFor(post.image).width(1200).height(600).url()}
              alt={post.image.alt ? getLocalizedField(post.image.alt, locale as Locale) : title}
              width={1200}
              height={600}
              className="w-full h-auto"
            />
          </div>
        )}

        {post.htmlContent && post.htmlContent[locale] ? (
          <Card>
            <div
              className="prose prose-lg max-w-none prose-headings:text-dark prose-p:text-dark/80 prose-a:text-primary prose-strong:text-dark prose-li:text-dark/80"
              dangerouslySetInnerHTML={{ __html: post.htmlContent[locale] }}
            />
          </Card>
        ) : content && content.length > 0 && (
          <Card>
            <div className="prose prose-lg max-w-none">
              {content.map((block: any, index: number) => {
                if (block._type === 'block') {
                  const style = block.style || 'normal'
                  const text = block.children?.map((child: any) => child.text).join('') || ''

                  if (style === 'h2') {
                    return <h2 key={index} className="text-3xl font-bold mt-8 mb-4">{text}</h2>
                  }
                  if (style === 'h3') {
                    return <h3 key={index} className="text-2xl font-semibold mt-6 mb-3">{text}</h3>
                  }
                  return (
                    <p key={index} className="text-dark/80 mb-4 leading-relaxed">
                      {text}
                    </p>
                  )
                }
                if (block._type === 'image') {
                  return (
                    <div key={index} className="my-8 rounded-lg overflow-hidden">
                      <Image
                        src={urlFor(block).width(800).height(600).url()}
                        alt={block.alt ? getLocalizedField(block.alt, locale as Locale) : ''}
                        width={800}
                        height={600}
                        className="w-full h-auto"
                      />
                    </div>
                  )
                }
                return null
              })}
            </div>
          </Card>
        )}

        {(categories.length > 0 || tags.length > 0) && (
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((cat: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {cat}
              </span>
            ))}
            {tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

