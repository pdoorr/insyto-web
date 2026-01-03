import { Heading, Card } from '@/components/ui'
import JobApplicationForm from '@/components/forms/JobApplicationForm'

export const metadata = {
  title: 'Lavora con noi | IN SY TO',
  description: 'Candidati per lavorare con IN SY TO - Integration Systems Technology',
}

export default function LavoraConNoiPage() {
  return (
    <div className="section-padding bg-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Heading as="h1" className="mb-6">
              Lavora con noi
            </Heading>
            <p className="text-xl text-dark/80">
              Unisciti al nostro team di professionisti nel settore dei sistemi elettronici ed elettromeccanici
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Card className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Perché lavorare con noi</h2>
                <ul className="space-y-3 text-dark/80">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Ambiente dinamico e innovativo</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Progetti stimolanti in settori strategici</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Opportunità di crescita professionale</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Team di esperti e competenti</span>
                  </li>
                </ul>
              </Card>

              <Card>
                <h2 className="text-2xl font-bold mb-4">Cosa cerchiamo</h2>
                <p className="text-dark/80 mb-4">
                  Siamo sempre alla ricerca di professionisti qualificati nel campo dell'ingegneria elettronica, 
                  elettromeccanica, automazione e telecomunicazioni.
                </p>
                <p className="text-dark/80">
                  Se sei interessato a far parte del nostro team, invia la tua candidatura compilando il form.
                </p>
              </Card>
            </div>

            <div>
              <JobApplicationForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

