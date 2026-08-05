/**
 * Mappa degli URL del vecchio sito WordPress verso il nuovo sito.
 *
 * Il vecchio WP (3.3.1) aveva `permalink_structure` vuoto, cioe' permalink
 * "plain": ogni pagina era servita da / con un parametro in query string
 * (/?page_id=333), non da uno slug nel path. Gli id vengono dall'export
 * WordPress del 2026-08-05 (vedi lib/migrate-wxr.py).
 *
 * I redirect sono applicati in middleware.ts e non in next.config.js perche'
 * i redirect di next.config.js ricopiano la query string sulla destinazione
 * (/?page_id=333 diventerebbe /it/profilo?page_id=333), creando un secondo URL
 * indicizzabile per la stessa pagina.
 */

/** Parametro ?page_id=N -> percorso sul nuovo sito. */
export const WP_PAGE_IDS: Record<string, string> = {
  16: '/it/contatti',
  28: '/it',
  231: '/it/servizi/impianti',
  246: '/it/servizi/sistemi-radiocomunicazione',
  249: '/it/servizi/sistemi-elettronici',
  321: '/it/lavora-con-noi',
  325: '/it/servizi/macchine',
  333: '/it/profilo',
  343: '/it/note-legali',
}

/**
 * Altri parametri WordPress senza un equivalente esatto: si reindirizza al
 * contenitore corretto invece di restituire un 404.
 * - ?p=N            i due post erano contenuti demo di WordPress
 * - ?portfolio_page il custom post type di esempio del vecchio tema
 */
const WP_FALLBACKS: Record<string, string> = {
  p: '/it/blog',
  portfolio_page: '/it/portfolio',
}

/**
 * Destinazione per una richiesta al vecchio sito, o null se non e' un URL
 * WordPress conosciuto. Da chiamare solo per il path "/".
 */
export function legacyDestination(params: URLSearchParams): string | null {
  const pageId = params.get('page_id')
  if (pageId && pageId in WP_PAGE_IDS) {
    return WP_PAGE_IDS[pageId]
  }

  for (const [param, destination] of Object.entries(WP_FALLBACKS)) {
    if (params.has(param)) {
      return destination
    }
  }

  return null
}
