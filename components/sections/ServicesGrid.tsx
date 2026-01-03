'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, Heading } from '@/components/ui'
import { Card3D } from '@/components/effects/Card3D'
import { ScrollReveal } from '@/components/effects/ScrollReveal'
import { useTranslations } from 'next-intl'
import {
  Settings,
  Wrench,
  Zap,
  CheckCircle,
  Hammer,
} from 'lucide-react'

export default function ServicesGrid() {
  const t = useTranslations('services')
  const tCommon = useTranslations('common')

  const services = [
    {
      key: 'progettazione',
      icon: Settings,
      href: '/servizi/progettazione',
      color: 'from-primary to-primary-dark',
    },
    {
      key: 'integrazione',
      icon: Wrench,
      href: '/servizi/integrazione',
      color: 'from-secondary to-secondary-dark',
    },
    {
      key: 'installazione',
      icon: Zap,
      href: '/servizi/installazione',
      color: 'from-accent to-accent-dark',
    },
    {
      key: 'collaudo',
      icon: CheckCircle,
      href: '/servizi/collaudo',
      color: 'from-primary to-accent',
    },
    {
      key: 'manutenzione',
      icon: Hammer,
      href: '/servizi/manutenzione',
      color: 'from-secondary to-primary',
    },
  ]

  return (
    <section className="section-padding bg-gradient-to-b from-white to-light/50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Heading as="h2" className="mb-4">
            {t('title')}
          </Heading>
          <p className="text-xl text-dark/80 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <ScrollReveal key={service.key} delay={index * 100}>
                <Link href={service.href}>
                  <Card3D>
                    <Card hover className="h-full group relative overflow-hidden">
                      {/* Animated gradient border on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                      {/* Icon container with enhanced effects */}
                      <div className="relative mb-6">
                        <div className={`absolute inset-0 bg-gradient-to-br ${service.color} blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-2xl`} />
                        <div className={`relative w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="relative">
                        <h3 className="text-xl font-bold mb-3 text-dark group-hover:text-primary transition-colors duration-300">
                          {t(`items.${service.key}.name`)}
                        </h3>
                        <p className="text-dark/70 leading-relaxed">
                          {t(`items.${service.key}.description`)}
                        </p>

                        {/* Arrow indicator on hover */}
                        <div className="mt-4 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-sm font-medium">{tCommon('learnMore')}</span>
                          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Card>
                  </Card3D>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

