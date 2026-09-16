/*
 * Sorgente contenuti opt-in per la build statica: export del CMS PHP.
 *
 * Motivazione: `lib/sanity/queries.ts` interroga direttamente il client
 * Sanity, quindi un salvataggio nel CMS non puo' influenzare la build. Con
 * INSYTO_CONTENT_SOURCE=cms le stesse query leggono ESCLUSIVAMENTE l'export
 * pubblicato da `GET /api/cms-export.php` (Bearer token), senza alcun
 * fallback a Sanity: un export assente o non valido deve fermare la build,
 * non produrre un sito vuoto "riuscito".
 *
 * Contratto dell'export (schema 1, vedi aruba/php/lib/cms.php):
 *   { manifest: { schema_version: 1, generated_at, document_count, media_count },
 *     documents: [ { doc_type, slug, locale, title, payload,
 *                    payload_sha256, published_at } ],
 *     media: { <asset_ref>: { asset_ref, url, mime_type, size_bytes,
 *                              sha256, width_px, height_px, editorial_title,
 *                              alt_text } } }
 * Ogni payload importato conserva il documento Sanity originale sotto
 * `_source.document` (vedi aruba/php/tools/import-sanity.php): e' esattamente
 * la forma che i renderer gia' consumano, quindi la mappatura si limita a
 * estrarlo dopo averne verificato la coerenza.
 *
 * Il default resta Sanity: finche' INSYTO_CONTENT_SOURCE non vale 'cms', quel
 * modulo non viene toccato (vedi queries.ts).
 */

/** Versione dello schema di export accettata dal client. */
export const CMS_EXPORT_SCHEMA_VERSION = 1

/** Timeout esplicito di default per la richiesta di export. */
export const DEFAULT_TIMEOUT_MS = 15000

export const CONTENT_SOURCE_ENV = 'INSYTO_CONTENT_SOURCE'
export const EXPORT_URL_ENV = 'INSYTO_CMS_EXPORT_URL'
export const EXPORT_TOKEN_ENV = 'INSYTO_CMS_EXPORT_TOKEN'
export const EXPORT_TIMEOUT_ENV = 'INSYTO_CMS_EXPORT_TIMEOUT_MS'

/** doc_type CMS -> _type Sanity del documento conservato in _source.document. */
const DOC_TYPE_TO_SANITY = {
  page: 'page',
  service: 'service',
  project: 'project',
  blog_post: 'blogPost',
  settings: 'settings',
  company_profile: 'companyProfile',
}

const LOCALES = ['it', 'en']

export class CmsSourceError extends Error {
  /**
   * @param {string} code CMS_CONFIG | CMS_HTTP | CMS_JSON | CMS_SCHEMA |
   *                      CMS_PAYLOAD | CMS_EMPTY | CMS_TIMEOUT | CMS_NETWORK
   */
  constructor(code, message) {
    super(message)
    this.name = 'CmsSourceError'
    this.code = code
  }
}

/* Media locali: l'annotazione e' non enumerabile, vive solo durante la build
 * e non riscrive i payload CMS importati. */
export const CMS_MEDIA_ANNOTATION = Symbol('insyto.cmsMedia')

const MEDIA_REF_PATTERN = /^image-[a-z0-9][a-z0-9-]{0,160}-[1-9]\d{0,4}x[1-9]\d{0,4}-(?:png|jpg|jpeg|gif|webp|avif|svg)$/
const MEDIA_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'image/svg+xml']
const MEDIA_ENTRY_KEYS = ['asset_ref', 'url', 'mime_type', 'size_bytes', 'sha256', 'width_px', 'height_px', 'editorial_title', 'alt_text']

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isPositiveDimension(value) {
  return value === null || (Number.isInteger(value) && value >= 1 && value <= 99999)
}

function validateMediaEntry(ref, entry) {
  if (!MEDIA_REF_PATTERN.test(ref)) {
    throw new CmsSourceError('CMS_MEDIA', `media "${String(ref).slice(0, 64)}": chiave asset_ref malformata.`)
  }
  if (!isPlainObject(entry)) {
    throw new CmsSourceError('CMS_MEDIA', `media "${ref}": entrata non oggetto.`)
  }
  const keys = Object.keys(entry).sort()
  const expected = [...MEDIA_ENTRY_KEYS].sort()
  if (keys.length !== expected.length || keys.some((key, index) => key !== expected[index])) {
    throw new CmsSourceError('CMS_MEDIA', `media "${ref}": chiavi inattese o mancanti.`)
  }
  if (entry.asset_ref !== ref) {
    throw new CmsSourceError('CMS_MEDIA', `media "${ref}": asset_ref incoerente con la chiave.`)
  }
  if (typeof entry.url !== 'string' || !entry.url.startsWith('/') || entry.url.startsWith('//')) {
    throw new CmsSourceError('CMS_MEDIA', `media "${ref}": URL non locale.`)
  }
  let parsedUrl
  try {
    parsedUrl = new URL(entry.url, 'https://sorgente.locale')
  } catch {
    throw new CmsSourceError('CMS_MEDIA', `media "${ref}": URL non valida.`)
  }
  if (parsedUrl.origin !== 'https://sorgente.locale' || parsedUrl.searchParams.get('ref') !== ref) {
    throw new CmsSourceError('CMS_MEDIA', `media "${ref}": URL non punta al media coerente.`)
  }
  if (!MEDIA_MIME_TYPES.includes(entry.mime_type)) {
    throw new CmsSourceError('CMS_MEDIA', `media "${ref}": mime non ammesso.`)
  }
  if (!Number.isInteger(entry.size_bytes) || entry.size_bytes <= 0 || entry.size_bytes > 4294967295) {
    throw new CmsSourceError('CMS_MEDIA', `media "${ref}": size_bytes non valido.`)
  }
  if (typeof entry.sha256 !== 'string' || /^[0-9a-f]{64}$/.test(entry.sha256) === false) {
    throw new CmsSourceError('CMS_MEDIA', `media "${ref}": sha256 assente o malformato.`)
  }
  if (!isPositiveDimension(entry.width_px) || !isPositiveDimension(entry.height_px)) {
    throw new CmsSourceError('CMS_MEDIA', `media "${ref}": dimensioni non valide.`)
  }
  if (entry.alt_text !== null && typeof entry.alt_text !== 'string') {
    throw new CmsSourceError('CMS_MEDIA', `media "${ref}": alt_text non valida.`)
  }
  if (entry.editorial_title !== null && typeof entry.editorial_title !== 'string') {
    throw new CmsSourceError('CMS_MEDIA', `media "${ref}": editorial_title non valida.`)
  }

  return entry
}

function validateMediaSection(media) {
  const validated = {}
  for (const [ref, entry] of Object.entries(media)) {
    validated[ref] = validateMediaEntry(ref, entry)
  }
  return validated
}

export function cmsMediaForImage(source) {
  if (!isPlainObject(source)) return null
  const direct = source[CMS_MEDIA_ANNOTATION]
  if (isPlainObject(direct)) return direct
  if (isPlainObject(source.asset)) {
    const viaAsset = source.asset[CMS_MEDIA_ANNOTATION]
    if (isPlainObject(viaAsset)) return viaAsset
  }
  return null
}

function annotateCmsDocument(document, media) {
  const documentId = isPlainObject(document) && typeof document._id === 'string' ? document._id : '?'
  const visit = (value) => {
    if (Array.isArray(value)) {
      value.forEach(visit)
      return
    }
    if (!isPlainObject(value)) return
    const asset = isPlainObject(value.asset) ? value.asset : null
    if (asset && typeof asset._ref === 'string' && asset._ref !== '') {
      const entry = media[asset._ref]
      if (!isPlainObject(entry)) {
        throw new CmsSourceError('CMS_PAYLOAD', `documento "${documentId}": asset_ref "${asset._ref.slice(0, 64)}" referenziato ma privo di media locale nell'export.`)
      }
      Object.defineProperty(value, CMS_MEDIA_ANNOTATION, {
        value: entry, enumerable: false, writable: true, configurable: true,
      })
    }
    for (const key of Object.keys(value)) visit(value[key])
  }
  visit(document)
}

/** Il source CMS e' attivo solo con il valore esplicito 'cms' (case/spazi tollerati). */
export function isCmsSourceEnabled(env = process.env) {
  return String(env[CONTENT_SOURCE_ENV] ?? '').trim().toLowerCase() === 'cms'
}

/**
 * Risolve e valida i tre (piu' il timeout opzionale) env del source CMS.
 * Fallisce con CMS_CONFIG: mai valori di ripiego silenziosi.
 */
export function resolveCmsExportConfig(env = process.env) {
  const url = String(env[EXPORT_URL_ENV] ?? '').trim()
  if (url === '') {
    throw new CmsSourceError('CMS_CONFIG', `${EXPORT_URL_ENV} non impostato: export CMS non configurato.`)
  }
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    throw new CmsSourceError('CMS_CONFIG', `${EXPORT_URL_ENV} non e' un URL valido.`)
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new CmsSourceError('CMS_CONFIG', `${EXPORT_URL_ENV} deve usare http o https.`)
  }

  const token = String(env[EXPORT_TOKEN_ENV] ?? '').trim()
  if (token === '') {
    throw new CmsSourceError('CMS_CONFIG', `${EXPORT_TOKEN_ENV} mancante: l'export richiede il Bearer token.`)
  }

  const rawTimeout = String(env[EXPORT_TIMEOUT_ENV] ?? '').trim()
  let timeoutMs = DEFAULT_TIMEOUT_MS
  if (rawTimeout !== '') {
    timeoutMs = Number(rawTimeout)
    if (!Number.isFinite(timeoutMs) || !Number.isInteger(timeoutMs) || timeoutMs <= 0) {
      throw new CmsSourceError('CMS_CONFIG', `${EXPORT_TIMEOUT_ENV} deve essere un intero di millisecondi positivo.`)
    }
  }

  return { url: parsed.toString(), token, timeoutMs }
}

/**
 * Scarica e valida l'export. Qualsiasi anomalia (rete, HTTP, JSON, schema,
 * payload incoerente) diventa una CmsSourceError: nessun fallback, nessun
 * elenco vuoto "verosimile".
 *
 * @returns {Promise<{manifest: object, documents: Array<object>}>}
 *          documents contiene i documenti Sanity originali (_source.document).
 */
export async function loadCmsExport(config, fetchImpl = fetch) {
  if (!isPlainObject(config)) {
    throw new CmsSourceError('CMS_CONFIG', 'Configurazione export assente.')
  }
  let parsed
  try {
    parsed = new URL(config.url)
  } catch {
    throw new CmsSourceError('CMS_CONFIG', 'URL di export non valido.')
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new CmsSourceError('CMS_CONFIG', 'URL di export deve usare http o https.')
  }
  const token = typeof config.token === 'string' ? config.token.trim() : ''
  if (token === '') {
    throw new CmsSourceError('CMS_CONFIG', 'Token di export mancante.')
  }
  const timeoutMs = Number.isInteger(config.timeoutMs) && config.timeoutMs > 0
    ? config.timeoutMs
    : DEFAULT_TIMEOUT_MS

  let response
  try {
    response = await fetchImpl(parsed.toString(), {
      // Il CMS accetta il token solo via header Bearer (mai in query string).
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(timeoutMs),
    })
  } catch (error) {
    if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
      throw new CmsSourceError('CMS_TIMEOUT', `Export CMS non risposto entro ${timeoutMs}ms.`)
    }
    throw new CmsSourceError('CMS_NETWORK', `Export CMS non raggiungibile: ${error?.message ?? 'errore di rete'}.`)
  }

  if (!response.ok) {
    throw new CmsSourceError('CMS_HTTP', `Export CMS ha risposto HTTP ${response.status} (attesi 2xx).`)
  }

  let text
  try {
    text = await response.text()
  } catch (error) {
    throw new CmsSourceError('CMS_NETWORK', `Corpo dell'export non leggibile: ${error?.message ?? 'errore'}.`)
  }

  let payload
  try {
    payload = JSON.parse(text)
  } catch {
    throw new CmsSourceError('CMS_JSON', "L'export CMS non e' JSON valido.")
  }

  return validateExport(payload)
}

/**
 * Valida il payload di export (schema 1) e lo mappa ai documenti Sanity che
 * i renderer gia' consumano. Pubblicita' dei documenti: l'export contiene
 * solo i pubblicati per contratto del endpoint; qui si verifica che ogni
 * riga porti `published_at` e che il payload sia coerente con doc_type,
 * slug e _id dichiarati.
 */
export function validateExport(payload) {
  if (!isPlainObject(payload)) {
    throw new CmsSourceError('CMS_SCHEMA', "L'export CMS non e' un oggetto.")
  }
  const { manifest } = payload
  if (!isPlainObject(manifest)) {
    throw new CmsSourceError('CMS_SCHEMA', "Manifest dell'export mancante.")
  }
  if (manifest.schema_version !== CMS_EXPORT_SCHEMA_VERSION) {
    throw new CmsSourceError('CMS_SCHEMA', `Schema export ${JSON.stringify(manifest.schema_version)} non supportato: atteso ${CMS_EXPORT_SCHEMA_VERSION}.`)
  }
  if (typeof manifest.generated_at !== 'string' || manifest.generated_at.trim() === '') {
    throw new CmsSourceError('CMS_SCHEMA', "generated_at mancante nel manifest dell'export.")
  }
  if (!Array.isArray(payload.documents)) {
    throw new CmsSourceError('CMS_SCHEMA', "Elenco documenti dell'export mancante.")
  }
  if (manifest.document_count !== payload.documents.length) {
    throw new CmsSourceError('CMS_SCHEMA', `document_count (${String(manifest.document_count)}) diverso dai documenti presenti (${payload.documents.length}): export parziale o corrotto.`)
  }
  if (payload.documents.length === 0) {
    throw new CmsSourceError('CMS_EMPTY', "Export CMS vuoto: una build con zero contenuti non e' un successo.")
  }
  if (!isPlainObject(payload.media)) {
    throw new CmsSourceError('CMS_SCHEMA', 'Sezione "media" dell\'export mancante o non oggetto: aggiornare il CMS.')
  }
  if (manifest.media_count !== Object.keys(payload.media).length) {
    throw new CmsSourceError('CMS_SCHEMA', `media_count (${String(manifest.media_count)}) diverso dai media presenti (${Object.keys(payload.media).length}): export parziale o corrotto.`)
  }
  const media = validateMediaSection(payload.media)

  const documents = payload.documents.map((row, index) => mapExportRow(row, index))
  for (const document of documents) annotateCmsDocument(document, media)
  return { manifest, documents }
}

/**
 * Verifica una riga dell'export ed estrae il documento Sanity originale.
 * La coerenza richiesta (doc_type <-> _type, slug, _id <-> system.id)
 * impedisce che un documento importato male passi per un altro.
 */
function mapExportRow(row, index) {
  const where = `documenti[${index}]`
  if (!isPlainObject(row)) {
    throw new CmsSourceError('CMS_PAYLOAD', `${where}: riga non oggetto.`)
  }
  if (typeof row.doc_type !== 'string' || !(row.doc_type in DOC_TYPE_TO_SANITY)) {
    throw new CmsSourceError('CMS_PAYLOAD', `${where}: doc_type "${String(row.doc_type)}" sconosciuto.`)
  }
  const expectedType = DOC_TYPE_TO_SANITY[row.doc_type]
  if (typeof row.slug !== 'string' || row.slug.trim() === '') {
    throw new CmsSourceError('CMS_PAYLOAD', `${where}: slug mancante.`)
  }
  if (!LOCALES.includes(row.locale)) {
    throw new CmsSourceError('CMS_PAYLOAD', `${where}: locale "${String(row.locale)}" non ammesso.`)
  }
  if (typeof row.title !== 'string' || row.title.trim() === '') {
    throw new CmsSourceError('CMS_PAYLOAD', `${where}: titolo mancante.`)
  }
  if (typeof row.published_at !== 'string' || row.published_at.trim() === '') {
    throw new CmsSourceError('CMS_PAYLOAD', `${where}: published_at mancante (solo i pubblicati stanno nell'export).`)
  }
  if (typeof row.payload_sha256 !== 'string' || /^[0-9a-f]{64}$/.test(row.payload_sha256) === false) {
    throw new CmsSourceError('CMS_PAYLOAD', `${where}: payload_sha256 assente o malformato.`)
  }
  const source = isPlainObject(row.payload) ? row.payload._source : undefined
  if (!isPlainObject(source)) {
    throw new CmsSourceError('CMS_PAYLOAD', `${where}: payload privo di _source (documento non importato da Sanity?).`)
  }
  const system = isPlainObject(source.system) ? source.system : undefined
  const document = isPlainObject(source.document) ? source.document : undefined
  if (!system || !document) {
    throw new CmsSourceError('CMS_PAYLOAD', `${where}: _source privo di system/document.`)
  }
  if (typeof document._id !== 'string' || document._id.trim() === '') {
    throw new CmsSourceError('CMS_PAYLOAD', `${where}: documento senza _id.`)
  }
  if (system.id !== document._id) {
    throw new CmsSourceError('CMS_PAYLOAD', `${where}: _source.system.id incoerente con _id.`)
  }
  if (document._type !== expectedType) {
    throw new CmsSourceError('CMS_PAYLOAD', `${where}: doc_type "${row.doc_type}" ma _type "${String(document._type)}": payload incoerente.`)
  }
  if (system.type !== document._type) {
    throw new CmsSourceError('CMS_PAYLOAD', `${where}: _source.system.type incoerente con _type.`)
  }
  const documentSlug = isPlainObject(document.slug) && typeof document.slug.current === 'string'
    ? document.slug.current
    : ''
  const slugOptional = row.doc_type === 'settings' || row.doc_type === 'company_profile'
  if (documentSlug === '' && !slugOptional) {
    throw new CmsSourceError('CMS_PAYLOAD', `${where}: documento senza slug.current.`)
  }
  if (documentSlug !== '' && documentSlug !== row.slug) {
    throw new CmsSourceError('CMS_PAYLOAD', `${where}: slug del documento ("${documentSlug}") diverso da quello della riga ("${row.slug}").`)
  }
  return document
}

/* ------------------------------------------------------------------ */
/* Query equivalenti a quelle Sanity (filtri/ordinamenti osservabili   */
/* dal frontend, vedi lib/sanity/queries.ts).                          */
/* ------------------------------------------------------------------ */

function compareValues(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  const sa = a == null ? '' : String(a)
  const sb = b == null ? '' : String(b)
  if (sa === sb) return 0
  return sa < sb ? -1 : 1
}

function orderDocuments(documents, keys) {
  // Ordine stabile, come GROQ |order(...): le pari restano nell'ordine dato.
  return [...documents].sort((a, b) => {
    for (const { key, direction } of keys) {
      const compared = compareValues(a[key], b[key])
      if (compared !== 0) return direction === 'desc' ? -compared : compared
    }
    return 0
  })
}

function byType(documents, sanityType) {
  return documents.filter((document) => document._type === sanityType)
}

function bySlug(documents, sanityType, slug) {
  return documents.find(
    (document) => document._type === sanityType && document.slug?.current === slug
  )
}

/**
 * Crea le query sulla sorgente CMS. `load` restituisce { manifest, documents }
 * (gia' validati): nelle pagine ogni chiamata ri-legge dalla cache del loader,
 * che ricarica l'export una sola volta per processo di build.
 */
export function createCmsQueries(load) {
  async function documents() {
    const { documents: list } = await load()
    return list
  }

  return {
    getPages: async () => orderDocuments(byType(await documents(), 'page'), [{ key: '_createdAt', direction: 'desc' }]),
    getPageBySlug: async (slug) => bySlug(await documents(), 'page', slug),

    getServices: async () => orderDocuments(byType(await documents(), 'service'), [{ key: '_createdAt', direction: 'asc' }]),
    getServiceBySlug: async (slug) => bySlug(await documents(), 'service', slug),

    getProjects: async () => orderDocuments(byType(await documents(), 'project'), [
      { key: 'date', direction: 'desc' },
      { key: '_createdAt', direction: 'desc' },
    ]),
    getFeaturedProjects: async () => orderDocuments(
      byType(await documents(), 'project').filter((project) => project.featured === true),
      [{ key: 'date', direction: 'desc' }]
    ).slice(0, 6),
    getProjectBySlug: async (slug) => bySlug(await documents(), 'project', slug),

    getBlogPosts: async () => orderDocuments(byType(await documents(), 'blogPost'), [{ key: 'publishedAt', direction: 'desc' }]),
    getFeaturedBlogPosts: async () => orderDocuments(
      byType(await documents(), 'blogPost').filter((post) => post.featured === true),
      [{ key: 'publishedAt', direction: 'desc' }]
    ).slice(0, 3),
    getBlogPostBySlug: async (slug) => bySlug(await documents(), 'blogPost', slug),

    getSettings: async () => byType(await documents(), 'settings')[0],
    getCompanyProfile: async () => byType(await documents(), 'companyProfile')[0],
  }
}

/* ------------------------------------------------------------------ */
/* Cablaggio di produzione: un solo download per processo e fallimento */
/* esplicito della build.                                              */
/* ------------------------------------------------------------------ */

let cachedExport = null

async function loadCmsExportOnce() {
  cachedExport ??= loadCmsExport(resolveCmsExportConfig())
  return cachedExport
}

/**
 * Errore fatale della build: stampa una diagnostica chiara su stderr e
 * termina con rc != 0. Non e' intercettabile dai try/catch delle pagine
 * (che hanno testi di riserva): in CMS mode un export rotto NON deve
 * produrre una build apparentemente valida ma vuota.
 */
function failHardExit(error) {
  console.error(
    '[cms-source] Sorgente contenuti CMS non utilizzabile e fallback vietato.\n' +
    `[cms-source] ${error?.code ?? 'CMS_ERROR'}: ${error?.message ?? String(error)}\n` +
    `[cms-source] Controllare ${CONTENT_SOURCE_ENV}, ${EXPORT_URL_ENV}, ${EXPORT_TOKEN_ENV} ` +
    "e che l'endpoint di esportazione risponda con un export valido."
  )
  process.exit(1)
}

/** Query di produzione sulla sorgente CMS. */
export function getCmsQueries({ onFatal = failHardExit } = {}) {
  return createCmsQueries(async () => {
    try {
      return await loadCmsExportOnce()
    } catch (error) {
      onFatal?.(error)
      throw error
    }
  })
}

/**
 * Preflight per la build statica: scarica e valida l'export PRIMA di
 * `next build`, cosi' URL/token/export non validi fermano la build con
 * rc non-zero. Ritorna un riassunto per il log (senza URL ne' token).
 */
export async function preflightCmsExport(env = process.env, { log = console.log } = {}) {
  const config = resolveCmsExportConfig(env)
  const { manifest, documents } = await loadCmsExport(config)

  const byType = {}
  for (const document of documents) {
    byType[document._type] = (byType[document._type] ?? 0) + 1
  }
  const tally = Object.entries(byType)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([type, count]) => `${type}: ${count}`)
    .join(', ')

  log(
    `Preflight sorgente CMS: export valido (schema ${manifest.schema_version}), ` +
    `${documents.length} documenti — ${tally}.`
  )
  log('Preflight sorgente CMS: il conteggio dei tipi sopra e\' osservabilita\': un tipo assente non blocca la build, come in modalita\' Sanity.')
  return { documentCount: documents.length, byType }
}
