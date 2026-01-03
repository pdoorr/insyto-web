import imageUrlBuilder from '@sanity/image-url'
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

export function urlFor(source: any) {
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

