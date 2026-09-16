import { client } from './client'
import { getCmsQueries, isCmsSourceEnabled } from '../cms-source.mjs'

/*
 * Sorgente contenuti: default Sanity, opt-in CMS.
 *
 * Ogni query guarda INSYTO_CONTENT_SOURCE:
 *   - non impostato o diverso da 'cms' -> client Sanity, GROQ invariato
 *     (comportamento e build Vercel esistenti restano identici);
 *   - 'cms' -> le query leggono ESCLUSIVAMENTE l'export del CMS PHP
 *     (INSYTO_CMS_EXPORT_URL con Bearer token), mappato da lib/cms-source.mjs
 *     sulla stessa forma documento. In modalita' CMS un export assente o non
 *     valido termina la build (fail-hard, vedi getCmsQueries): le query non
 *     possono restituire dati di ripiego perche' le pagine con testi di
 *     riserva intercetterebbero l'errore e produrebbero un sito vuoto ma
 *     "riuscito".
 *
 * In modalita' CMS i campi che Sanity proiettava con dereferenziazioni GROQ
 * (nativeWidth/nativeHeight da asset->metadata) non sono presenti nel
 * payload esportato: i renderer (FigurePlate) gia' degradano con la larghezza
 * di tavoletta quando mancano.
 */

export const getPages = async () => {
  if (isCmsSourceEnabled()) return getCmsQueries().getPages()
  return client.fetch('*[_type == "page"] | order(_createdAt desc)')
}

export const getPageBySlug = async (slug: string) => {
  if (isCmsSourceEnabled()) return getCmsQueries().getPageBySlug(slug)
  return client.fetch(`*[_type == "page" && slug.current == $slug][0]`, { slug })
}

export const getServices = async () => {
  if (isCmsSourceEnabled()) return getCmsQueries().getServices()
  return client.fetch('*[_type == "service"] | order(_createdAt asc)')
}

/*
  Le dimensioni native servono alla tavoletta di figura, che dichiara in
  didascalia da quale file viene l'immagine e non la ingrandisce mai. Sono
  proiettate come numeri invece di dereferenziare l'asset, cosi' `asset` resta
  un riferimento e urlFor continua a funzionare come prima.
*/
const IMAGE_DIMENSIONS = `
  "nativeWidth": asset->metadata.dimensions.width,
  "nativeHeight": asset->metadata.dimensions.height
`

export const getServiceBySlug = async (slug: string) => {
  if (isCmsSourceEnabled()) return getCmsQueries().getServiceBySlug(slug)
  return client.fetch(
    `*[_type == "service" && slug.current == $slug][0]{
      ...,
      image{ ..., ${IMAGE_DIMENSIONS} },
      gallery[]{ ..., ${IMAGE_DIMENSIONS} }
    }`,
    { slug }
  )
}

export const getProjects = async () => {
  if (isCmsSourceEnabled()) return getCmsQueries().getProjects()
  return client.fetch('*[_type == "project"] | order(date desc, _createdAt desc)')
}

export const getFeaturedProjects = async () => {
  if (isCmsSourceEnabled()) return getCmsQueries().getFeaturedProjects()
  return client.fetch('*[_type == "project" && featured == true] | order(date desc) [0...6]')
}

export const getProjectBySlug = async (slug: string) => {
  if (isCmsSourceEnabled()) return getCmsQueries().getProjectBySlug(slug)
  return client.fetch(
    `*[_type == "project" && slug.current == $slug][0]{
      ...,
      images[]{ ..., ${IMAGE_DIMENSIONS} },
      gallery[]{ ..., ${IMAGE_DIMENSIONS} }
    }`,
    { slug }
  )
}

export const getBlogPosts = async () => {
  if (isCmsSourceEnabled()) return getCmsQueries().getBlogPosts()
  return client.fetch('*[_type == "blogPost"] | order(publishedAt desc)')
}

export const getFeaturedBlogPosts = async () => {
  if (isCmsSourceEnabled()) return getCmsQueries().getFeaturedBlogPosts()
  return client.fetch('*[_type == "blogPost" && featured == true] | order(publishedAt desc) [0...3]')
}

export const getBlogPostBySlug = async (slug: string) => {
  if (isCmsSourceEnabled()) return getCmsQueries().getBlogPostBySlug(slug)
  return client.fetch(`*[_type == "blogPost" && slug.current == $slug][0]`, { slug })
}

export const getSettings = async () => {
  if (isCmsSourceEnabled()) return getCmsQueries().getSettings()
  return client.fetch('*[_type == "settings"][0]')
}

export const getCompanyProfile = async () => {
  if (isCmsSourceEnabled()) return getCmsQueries().getCompanyProfile()
  return client.fetch('*[_type == "companyProfile"][0]')
}
