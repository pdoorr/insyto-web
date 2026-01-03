'use client'

import { motion } from 'framer-motion'
import { Card, Heading } from '@/components/ui'
import { useTranslations } from 'next-intl'
import { Rocket, Shield, Factory, Building2 } from 'lucide-react'

export default function Sectors() {
  const t = useTranslations('sectors')

  const sectors = [
    {
      key: 'spazio',
      icon: Rocket,
      color: 'from-primary to-accent',
    },
    {
      key: 'difesa',
      icon: Shield,
      color: 'from-secondary to-primary',
    },
    {
      key: 'industriale',
      icon: Factory,
      color: 'from-accent to-primary',
    },
    {
      key: 'civile',
      icon: Building2,
      color: 'from-primary to-secondary',
    },
  ]

  return (
    <section className="section-padding bg-gradient-to-br from-dark to-dark-light">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Heading as="h2" className="mb-4 text-white">
            {t('title')}
          </Heading>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sectors.map((sector, index) => {
            const Icon = sector.icon
            return (
              <motion.div
                key={sector.key}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card variant="dark" hover className="text-center h-full">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${sector.color} flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">
                    {t(`items.${sector.key}.name`)}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {t(`items.${sector.key}.description`)}
                  </p>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

