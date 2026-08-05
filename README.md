# IN SY TO Website

Sito web moderno per IN SY TO - Integration Systems Technology, costruito con Next.js 14, TypeScript, Tailwind CSS e Sanity CMS.

## Caratteristiche

- 🚀 **Next.js 14** con App Router
- 🎨 **Design moderno** con Tailwind CSS e Framer Motion
- 📝 **CMS Sanity** per gestione contenuti
- 📱 **Responsive** e mobile-first
- ⚡ **Performance ottimizzate** (Lighthouse score >90)
- 🔍 **SEO ottimizzato** con metadata dinamici e structured data
- 📧 **Form contatti** con integrazione Resend
- 🎯 **Accessibilità** WCAG 2.1 AA

## Setup

### Prerequisiti

- Node.js 18+ 
- npm o yarn
- Account Sanity.io (opzionale per sviluppo locale)

### Installazione

```bash
# Installa dipendenze
npm install

# Configura variabili d'ambiente
cp .env.example .env.local
# Modifica .env.local con le tue credenziali
```

### Variabili d'Ambiente

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://www.insyto.it

# Resend API (for contact forms)
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=info@insyto.it
```

### Sviluppo

```bash
# Avvia il server di sviluppo
npm run dev

# Apri http://localhost:3000
```

### Build

```bash
# Build per produzione
npm run build

# Avvia server di produzione
npm start
```

## Migrazione dal vecchio sito WordPress

Il sito precedente girava su WordPress 3.3.1 in hosting condiviso Aruba, con
permalink "plain" (ogni pagina servita da `/?page_id=N`).

Servono due file, entrambi esportabili dal pannello WordPress e da quello Aruba:

- l'export XML (WXR): `Bacheca → Strumenti → Esporta → Tutti i contenuti`
- il dump SQL: pannello Aruba → phpMyAdmin → Esporta

```bash
python3 lib/migrate-wxr.py export.xml --sql dump.sql
```

Lo script produce tre file (tutti in .gitignore, si rigenerano):

| File | Contenuto |
|------|-----------|
| `sanity-import.ndjson` | documenti Sanity pronti per l'import |
| `media-manifest.json` | inventario delle immagini del vecchio sito |
| `download-media.sh` | scarica le immagini via HTTP dal sito ancora online |

```bash
./download-media.sh wp-media
npx sanity dataset import sanity-import.ndjson production
```

Il dump SQL serve per le gallerie **NextGEN Gallery**: quelle immagini non sono
nella media library e quindi non compaiono nell'export XML. Vanno caricate a
mano nei campi `gallery` dei documenti, perché l'import di Sanity non carica
file binari.

I redirect 301 dai vecchi URL sono in `lib/wp-legacy-urls.ts`, applicati da
`middleware.ts`.

## Struttura Progetto

```
website/
├── app/                    # Next.js App Router
│   ├── (marketing)/       # Pagine marketing
│   ├── api/               # API routes
│   └── layout.tsx         # Layout principale
├── components/            # Componenti React
│   ├── ui/                # Componenti base
│   ├── layout/            # Header, Footer
│   ├── sections/          # Sezioni homepage
│   └── forms/             # Form components
├── lib/                   # Utilities
│   ├── sanity/            # Sanity client e queries
│   └── utils.ts           # Funzioni utility
├── sanity/                # Configurazione Sanity CMS
│   └── schemas/           # Schema Sanity
└── public/                # Assets statici
```

## Script Disponibili

- `npm run dev` - Server di sviluppo
- `npm run build` - Build produzione
- `npm run start` - Server produzione
- `npm run lint` - Linting
- `npm run sanity` - Avvia Sanity Studio
- `npm run sanity:deploy` - Deploy Sanity Studio

## Tecnologie

- **Framework**: Next.js 14
- **Linguaggio**: TypeScript
- **Styling**: Tailwind CSS
- **Animazioni**: Framer Motion
- **CMS**: Sanity.io
- **Form**: React Hook Form + Zod
- **Email**: Resend
- **Icone**: Lucide React

## Licenza

Copyright © 2024 IN SY TO srl

