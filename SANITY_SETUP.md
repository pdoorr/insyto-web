# Configurazione Sanity CMS

Questo progetto include **Sanity.io** come headless CMS per gestire i contenuti del sito in modo dinamico.

## Passaggi per attivare Sanity CMS

### 1. Crea un account su Sanity.io

1. Vai su https://www.sanity.io/
2. Crea un account gratuito (il piano gratuito include fino a 3 dataset)

### 2. Crea un nuovo progetto

1. Dopo il login, clicca su "New project"
2. Nome progetto: `insyto-website`
3. Seleziona "Use dataset template" → "Blank" (o lascia vuoto)

### 3. Ottieni le credenziali

Dalla dashboard del tuo progetto Sanity:
- **Project ID**: Lo trovi in Settings → API → Project ID
- **Dataset**: Di default è `production`

### 4. Configura le variabili d'ambiente

Crea un file `.env.local` nella root del progetto:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=il_tuo_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=token_opzionale_per_query_protette
```

**Esempio:**
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xyz
NEXT_PUBLIC_SANITY_DATASET=production
```

### 5. Installa le dipendenze di Sanity

Le dipendenze Sanity sono già configurate nella cartella `sanity/`. Installale con:

```bash
# Dalla root del progetto
cd sanity
npm install
```

### 6. Deploy degli schema

Dopo aver configurato le variabili d'ambiente (vedi passo 4), puoi fare il deploy degli schema:

```bash
# Dalla cartella sanity/
cd sanity
npx sanity schema deploy
```

### 7. Avvia Sanity Studio (sviluppo)

Per testare Sanity Studio localmente:

```bash
# Dalla cartella sanity/
cd sanity
npm run dev
```

Lo Studio sarà accessibile a http://localhost:3333

### 8. Accesso al Sanity Studio

Dopo aver configurato le variabili d'ambiente, lo Studio sarà accessibile a:

**Produzione:** `https://tuo-dominio.com/studio`
**Sviluppo:** `http://localhost:3000/studio`

### Struttura dei contenuti

Il CMS include già i seguenti tipi di contenuto:

- **Pagine** (`page`) - Pagine del sito con titolo, slug, contenuto e SEO
- **Servizi** (`service`) - Sezione servizi
- **Progetti** (`project`) - Portfolio/Progetti
- **Articoli Blog** (`blogPost`) - Post del blog
- **Impostazioni** (`settings`) - Configurazioni globali

### Utilizzo dei contenuti nel sito

Dopo aver configurato Sanity, puoi utilizzare le query già definite in `lib/sanity/queries.ts`:

```typescript
import { getPages, getPageBySlug } from '@/lib/sanity/queries'

// Recupera tutte le pagine
const pages = await getPages()

// Recupera una pagina specifica
const aboutPage = await getPageBySlug('chi-siamo')
```

### Risoluzione problemi

**Errore "sanity-plugin-structure not found":**
- Le dipendenze sono state aggiornate a Sanity v3
- Esegui `cd sanity && npm install` per reinstallare

**Errore "Project not found":**
- Verifica che `NEXT_PUBLIC_SANITY_PROJECT_ID` sia corretto
- Assicurati che il progetto esista su Sanity.io

**Contenuti non visibili:**
- Verifica che il dataset sia corretto (default: `production`)
- Controlla che i documenti siano pubblicati (non solo in bozza)

**Studio non accessibile:**
- Riavvia il server di sviluppo dopo aver aggiunto `.env.local`
- Verifica che le variabili d'ambiente siano caricate correttamente

### Risorse utili

- Documentazione Sanity: https://www.sanity.io/docs
- Sanity CMS Guide: https://www.sanity.io/guides
- Query GROQ: https://www.sanity.io/docs/groq
