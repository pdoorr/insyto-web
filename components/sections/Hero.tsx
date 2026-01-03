'use client'

import { motion } from 'framer-motion'
import { Button, Heading } from '@/components/ui'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import type { Locale } from '@/i18n'

interface HeroProps {
  locale?: Locale
}

export default function Hero({ locale: propLocale }: HeroProps = {}) {
  const t = useTranslations('hero')
  const tCommon = useTranslations('common')
  const tNav = useTranslations('nav')
  const hookLocale = useLocale() as Locale
  const componentLocale = propLocale || hookLocale

  const isIt = componentLocale === 'it'

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 animate-gradient" />

      {/* Floating orbs for visual interest */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(to right, #0066FF 1px, transparent 1px), linear-gradient(to bottom, #0066FF 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-primary/20 mb-8 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-dark">
              {isIt ? '20+ Anni di Eccellenza' : '20+ Years of Excellence'}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heading as="h1" className="mb-6 text-5xl md:text-6xl lg:text-7xl text-gradient-animated">
              {t('title')}
            </Heading>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-dark/80 mb-8 leading-relaxed"
          >
            {t('subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              href={`/${componentLocale}/contatti`}
              size="lg"
              className="group"
            >
              {tCommon('contactUs')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              href={`/${componentLocale}/servizi`}
              variant="outline"
              size="lg"
            >
              {isIt ? 'I nostri servizi' : 'Our Services'}
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
          >
            {[
              {
                value: '20+',
                label: isIt ? 'Anni di Esperienza' : 'Years of Experience'
              },
              {
                value: '100+',
                label: isIt ? 'Progetti Completati' : 'Projects Completed'
              },
              {
                value: '100%',
                label: isIt ? 'Clienti Fidelizzati' : 'Retained Clients'
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-xs md:text-sm text-dark/60">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-dark/30 flex items-start justify-center p-2">
          <motion.div
            className="w-1 h-2 bg-dark/50 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-light to-transparent" />
    </section>
  )
}

