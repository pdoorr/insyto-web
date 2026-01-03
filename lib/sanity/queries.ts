import { client } from './client'

export const getPages = async () => {
  return client.fetch('*[_type == "page"] | order(_createdAt desc)')
}

export const getPageBySlug = async (slug: string) => {
  return client.fetch(`*[_type == "page" && slug.current == $slug][0]`, { slug })
}

export const getServices = async () => {
  return client.fetch('*[_type == "service"] | order(_createdAt asc)')
}

export const getServiceBySlug = async (slug: string) => {
  return client.fetch(`*[_type == "service" && slug.current == $slug][0]`, { slug })
}

export const getProjects = async () => {
  return client.fetch('*[_type == "project"] | order(date desc, _createdAt desc)')
}

export const getFeaturedProjects = async () => {
  return client.fetch('*[_type == "project" && featured == true] | order(date desc) [0...6]')
}

export const getProjectBySlug = async (slug: string) => {
  return client.fetch(`*[_type == "project" && slug.current == $slug][0]`, { slug })
}

export const getBlogPosts = async () => {
  return client.fetch('*[_type == "blogPost"] | order(publishedAt desc)')
}

export const getFeaturedBlogPosts = async () => {
  return client.fetch('*[_type == "blogPost" && featured == true] | order(publishedAt desc) [0...3]')
}

export const getBlogPostBySlug = async (slug: string) => {
  return client.fetch(`*[_type == "blogPost" && slug.current == $slug][0]`, { slug })
}

export const getSettings = async () => {
  return client.fetch('*[_type == "settings"][0]')
}

export const getCompanyProfile = async () => {
  return client.fetch('*[_type == "companyProfile"][0]')
}
