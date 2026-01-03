import { MetadataRoute } from 'next'
import { getServices, getProjects, getBlogPosts, getPages } from '@/lib/sanity/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.insyto.it'

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/profilo`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/servizi`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lavora-con-noi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contatti`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/note-legali`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Dynamic routes from Sanity
  try {
    const [services, projects, blogPosts, pages] = await Promise.all([
      getServices(),
      getProjects(),
      getBlogPosts(),
      getPages(),
    ])

    const serviceRoutes: MetadataRoute.Sitemap = services.map((service: any) => ({
      url: `${baseUrl}/servizi/${service.slug?.current || ''}`,
      lastModified: service._updatedAt ? new Date(service._updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    const projectRoutes: MetadataRoute.Sitemap = projects.map((project: any) => ({
      url: `${baseUrl}/portfolio/${project.slug?.current || ''}`,
      lastModified: project.date ? new Date(project.date) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug?.current || ''}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    const pageRoutes: MetadataRoute.Sitemap = pages.map((page: any) => ({
      url: `${baseUrl}/${page.slug?.current || ''}`,
      lastModified: page._updatedAt ? new Date(page._updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [...staticRoutes, ...serviceRoutes, ...projectRoutes, ...blogRoutes, ...pageRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticRoutes
  }
}

