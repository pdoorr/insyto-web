const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // I redirect dal vecchio sito WordPress basati sulla query string
  // (/?page_id=333) stanno in middleware.ts: vedi lib/wp-legacy-urls.ts per il
  // motivo. Qui restano solo quelli basati sul path.
  //
  // Volutamente NON reindirizzati: /wp-content/*, /wp-includes/* e le pagine
  // ?attachment_id=N. Non hanno un equivalente sul nuovo sito e un 301 verso la
  // home sarebbe un soft 404. Quando le immagini saranno su Sanity si potranno
  // mappare una per una.
  async redirects() {
    return [
      { source: '/feed', destination: '/it/blog', permanent: true },
      { source: '/feed/:path*', destination: '/it/blog', permanent: true },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.cloud',
      },
      {
        protocol: 'https',
        hostname: 'www.insyto.it',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
}

module.exports = withNextIntl(nextConfig)

