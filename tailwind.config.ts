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
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
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

