'use client'

import { motion } from 'framer-motion'
import { Heading, Button } from '@/components/ui'
import { CheckCircle2 } from 'lucide-react'

const features = [
  'Professionalità e competenza',
  'Esperienza pluriennale',
  'Elevati standard di sicurezza',
  'Certificazioni e qualità',
]

export default function About() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Heading as="h2" className="mb-6">
              Progettazione e Integrazione di Sistemi
              <br />
              Elettronici ed Elettromeccanici
            </Heading>
            <p className="text-lg text-dark/80 mb-6">
              IN SY TO srl si contraddistingue sul mercato grazie alle sue caratteristiche di professionalità, competenza, esperienza pluriennale, elevati standard di sicurezza, certificazioni e qualità.
            </p>
            <p className="text-dark/70 mb-8">
              IN SY TO srl si occupa della fornitura, installazione, trasformazione, ampliamento e manutenzione di impianti elettrici e di telecomunicazioni e della progettazione, costruzione, integrazione, installazione di:
            </p>
            <ul className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-dark/80">{feature}</span>
                </motion.li>
              ))}
            </ul>
            <Button href="/profilo" size="lg">
              Scopri di più
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-gradient mb-4">20+</div>
                <div className="text-xl text-dark/80">Anni di esperienza</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

