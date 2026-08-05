import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ---------------------------------------------------------------
        // Due mondi visivi, non due palette dello stesso sito.
        //
        // "instrument" e' il banco di misura: fondo scuro, graticola, un solo
        // colore di segnale. Regge la home e le pagine dove si mostra la
        // verifica.
        //
        // "sheet" e' la tavola di disegno esecutivo: carta fredda, inchiostro,
        // rosso solo per i segni di revisione. Regge le pagine di capability,
        // dove conta il rigore documentale.
        //
        // I due non vanno mescolati nella stessa sezione.
        // ---------------------------------------------------------------
        instrument: {
          ground: '#090E12',
          panel: '#0F161B',
          rule: '#1D2930',
          text: '#B7C6CD',
          dim: '#6B7F89',
          bright: '#F1F6F8',
          signal: '#FFB03A',
          ok: '#59C08A',
        },
        sheet: {
          paper: '#E6E9E4',
          surface: '#F1F3EF',
          ink: '#12181B',
          soft: '#48544F',
          hair: '#9DA9A4',
          hairline: '#C4CDC8',
          revision: '#B33A28',
        },
        // Primary - Blu principale del testo "INSYTO"
        primary: {
          DEFAULT: '#2c5f7c',
          light: '#4a7a96',
          dark: '#1e4257',
        },
        // Secondary - Arancione per accenti (rimosso dal logo ma mantenuto per contrasto)
        secondary: {
          DEFAULT: '#FF6B35',
          light: '#FF8C66',
          dark: '#CC5529',
        },
        // Accent - Blu chiaro del testo secondario "Integration Systems Technologies"
        accent: {
          DEFAULT: '#6b9cb3',
          light: '#8db5c7',
          dark: '#4a7a96',
        },
        // Dark - Sfondo scuro
        dark: {
          DEFAULT: '#0A0E27',
          light: '#1A1E37',
          lighter: '#2A2E47',
        },
        // Light - Sfondo chiaro
        light: {
          DEFAULT: '#F5F7FA',
          dark: '#E5E9F2',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        // Titoli e dati del banco di misura: il monospaziato allinea le cifre
        // in colonna, non e' un vezzo estetico.
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        // Scritte della tavola tecnica, come le annotazioni di un disegno.
        draft: ['var(--font-draft)', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        // Graticola dello strumento.
        graticule:
          'linear-gradient(rgba(126,168,186,.075) 1px, transparent 1px),' +
          'linear-gradient(90deg, rgba(126,168,186,.075) 1px, transparent 1px)',
      },
      backgroundSize: {
        graticule: '44px 44px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'gradient': 'gradient 15s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config

