import imageUrlBuilder from '@sanity/image-url'
import { cmsMediaForImage } from '../cms-source.mjs'
import { client } from './client'

// Crea il builder solo se Sanity è configurato
let builder: ReturnType<typeof imageUrlBuilder> | null = null

try {
  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'dummy') {
    builder = imageUrlBuilder(client)
  }
} catch (error) {
  console.warn('Errore nell\'inizializzazione di imageUrlBuilder:', error)
  builder = null
}

// Helper per creare un builder placeholder
function createPlaceholderBuilder() {
  const placeholder = {
    width: (w: number) => placeholder,
    height: (h: number) => placeholder,
    url: () => '/placeholder-image.png',
  }
  return placeholder
}

interface ResolvedImage {
  width: (w: number) => ResolvedImage
  height: (h: number) => ResolvedImage
  url: () => string
}

function createLocalBuilder(media: { url: string }): ResolvedImage {
  /*
   * La preview classica vive su localhost/Vercel, mentre i media sono serviti
   * dal CMS PHP su Aruba. In produzione Aruba la variabile resta vuota e il
   * percorso relativo continua a puntare allo stesso host.
   */
  const mediaBaseUrl = process.env.INSYTO_CMS_MEDIA_BASE_URL?.replace(/\/$/, '')
  const mediaUrl = mediaBaseUrl && media.url.startsWith('/') ? `${mediaBaseUrl}${media.url}` : media.url
  const local: ResolvedImage = {
    width: (_w: number) => local,
    height: (_h: number) => local,
    url: () => mediaUrl,
  }
  return local
}

export function urlFor(source: any) {
  const cmsMedia = cmsMediaForImage(source)
  if (cmsMedia && typeof cmsMedia.url === 'string') {
    return createLocalBuilder(cmsMedia)
  }
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  if (!builder || !source || !projectId || projectId === 'dummy') {
    return createPlaceholderBuilder()
  }
  
  try {
    return builder.image(source)
  } catch (error) {
    console.error('Errore nella generazione dell\'URL dell\'immagine:', error)
    return createPlaceholderBuilder()
  }
}
