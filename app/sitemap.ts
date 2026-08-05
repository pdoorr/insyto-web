import { MetadataRoute } from 'next'
import { getServices, getProjects, getBlogPosts, getPages } from '@/lib/sanity/queries'
import { locales, defaultLocale } from '@/i18n'

// Il middleware usa localePrefix: 'always', quindi ogni URL pubblico ha il
// prefisso della lingua (/it/profilo). Senza prefisso la sitemap elencherebbe
// URL che rispondono 307 verso la versione con prefisso: i crawler seguirebbero
// un redirect per ogni pagina, sprecando crawl budget subito dopo la migrazione
// dal vecchio sito. Ogni percorso viene quindi emesso una volta per lingua, con
// gli alternate hreflang che le collegano fra loro.

type Entry = {
  path: string
  lastModified?: Date
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}

const staticEntries: Entry[] = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/profilo', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/servizi', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/portfolio', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/blog', changeFrequency: 'daily', priority: 0.8 },
  { path: '/lavora-con-noi', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contatti', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/note-legali', changeFrequency: 'yearly', priority: 0.3 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.insyto.it').replace(/\/$/, '')

  const url = (locale: string, path: string) => `${baseUrl}/${locale}${path}`

  const expand = (entries: Entry[]): MetadataRoute.Sitemap =>
    entries.flatMap((entry) =>
      locales.map((locale) => ({
        url: url(locale, entry.path),
        lastModified: entry.lastModified ?? new Date(),
        changeFrequency: entry.changeFrequency,
        priority: entry.priority,
        alternates: {
          languages: Object.fromEntries([
            ...locales.map((alt) => [alt, url(alt, entry.path)]),
            ['x-default', url(defaultLocale, entry.path)],
          ]),
        },
      }))
    )

  try {
    const [services, projects, blogPosts, pages] = await Promise.all([
      getServices(),
      getProjects(),
      getBlogPosts(),
      getPages(),
    ])

    const dynamicEntries: Entry[] = [
      ...services.map((service: any) => ({
        path: `/servizi/${service.slug?.current || ''}`,
        lastModified: service._updatedAt ? new Date(service._updatedAt) : undefined,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
      ...projects.map((project: any) => ({
        path: `/portfolio/${project.slug?.current || ''}`,
        lastModified: project.date ? new Date(project.date) : undefined,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
      ...blogPosts.map((post: any) => ({
        path: `/blog/${post.slug?.current || ''}`,
        lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
      ...pages.map((page: any) => ({
        path: `/${page.slug?.current || ''}`,
        lastModified: page._updatedAt ? new Date(page._updatedAt) : undefined,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    ]

    // Le pagine Sanity possono avere lo stesso slug di una rotta statica
    // (es. "profilo"): senza dedup finirebbero due volte in sitemap.
    const staticPaths = new Set(staticEntries.map((entry) => entry.path))
    const unique = dynamicEntries.filter(
      (entry) => entry.path !== '/' && !staticPaths.has(entry.path)
    )

    return expand([...staticEntries, ...unique])
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return expand(staticEntries)
  }
}
