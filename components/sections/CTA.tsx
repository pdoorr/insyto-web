'use client'

import { motion } from 'framer-motion'
import { Heading } from '@/components/ui'
import { Mail, Phone } from 'lucide-react'

export default function CTA() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary via-primary-dark to-accent">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <Heading as="h2" className="mb-6 text-white">
            Pronto a Iniziare un Progetto?
          </Heading>
          <p className="text-xl text-white/90 mb-8">
            Contattaci per discutere delle tue esigenze e scoprire come possiamo aiutarti
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="mailto:info@insyto.it"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold rounded-lg bg-white text-primary hover:bg-light hover:text-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Mail className="w-5 h-5 mr-2" />
              info@insyto.it
            </a>
            <a
              href="/contatti"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold rounded-lg bg-transparent text-white border-2 border-white hover:bg-white hover:text-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Phone className="w-5 h-5 mr-2" />
              Altri contatti
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

