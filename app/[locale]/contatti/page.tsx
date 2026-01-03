import { Heading } from '@/components/ui'
import ContactForm from '@/components/forms/ContactForm'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Card } from '@/components/ui'

export const metadata = {
  title: 'Contatti | IN SY TO',
  description: 'Contatta IN SY TO per informazioni sui nostri servizi',
}

export default function ContattiPage() {
  return (
    <div className="section-padding bg-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Heading as="h1" className="mb-6">
              Contattaci
            </Heading>
            <p className="text-xl text-dark/80">
              Siamo qui per rispondere alle tue domande e discutere dei tuoi progetti
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">Email</h3>
                    <a
                      href="mailto:info@insyto.it"
                      className="text-primary hover:underline"
                    >
                      info@insyto.it
                    </a>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">Sede Legale</h3>
                    <p className="text-dark/80">
                      Via Benedetto Croce, 34<br />
                      00142 – Roma
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">Sede Operativa</h3>
                    <p className="text-dark/80">
                      Via Carlo Todini, 33<br />
                      00012 – Guidonia (RM)
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

