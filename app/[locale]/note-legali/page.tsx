import { Heading, Card } from '@/components/ui'

export const metadata = {
  title: 'Note Legali | IN SY TO',
  description: 'Note legali e privacy policy di IN SY TO',
}

export default function NoteLegaliPage() {
  return (
    <div className="section-padding bg-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <Heading as="h1" className="mb-8">
            Note Legali
          </Heading>

          <div className="prose prose-lg max-w-none space-y-8">
            <Card>
              <h2 className="text-2xl font-bold mb-4">Limitazione di responsabilità</h2>
              <p className="text-dark/80 mb-4">
                Le pagine pubblicate sul presente sito sono pubblicate a cura di IN SY TO srl.
                L&apos;utilizzo del sito da parte di un Visitatore o Utente implica l&apos;accettazione automatica delle presenti clausole.
              </p>
              <p className="text-dark/80">
                IN SY TO srl attua ogni ragionevole sforzo per garantire che le notizie presenti su questo sito siano aggiornate ed esenti da errori,
                inesattezze ed omissioni. Ciò nonostante non è possibile controllare tutte le fonti informative, che sono pertanto fornite &quot;così come sono&quot;.
              </p>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold mb-4">Privacy</h2>
              <p className="text-dark/80 mb-4">
                IN SY TO srl tratta i dati personali nel rispetto del Regolamento (UE) 2016/679 (GDPR) e del D.Lgs. 196/2003.
              </p>
              <p className="text-dark/80 mb-4">
                I dati personali raccolti tramite il sito web sono utilizzati esclusivamente per:
              </p>
              <ul className="list-disc pl-6 text-dark/80 space-y-2">
                <li>Rispondere alle richieste di informazioni</li>
                <li>Gestire le candidature lavorative</li>
                <li>Migliorare i servizi offerti</li>
              </ul>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold mb-4">Diritti dell'interessato</h2>
              <p className="text-dark/80 mb-4">
                Ai sensi del GDPR, l&apos;interessato ha diritto di:
              </p>
              <ul className="list-disc pl-6 text-dark/80 space-y-2">
                <li>Accedere ai propri dati personali</li>
                <li>Richiedere la rettifica o la cancellazione</li>
                <li>Opporsi al trattamento</li>
                <li>Richiedere la portabilità dei dati</li>
              </ul>
              <p className="text-dark/80 mt-4">
                Per esercitare questi diritti, contattare: <a href="mailto:info@insyto.it" className="text-primary hover:underline">info@insyto.it</a>
              </p>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold mb-4">Titolare del trattamento</h2>
              <p className="text-dark/80">
                <strong>IN SY TO srl</strong><br />
                Sede legale: Via Benedetto Croce, 34 – 00142 – Roma<br />
                Sede operativa: Via Carlo Todini, 33 – 00012 – Guidonia (RM)<br />
                P. IVA: 11709001009<br />
                Email: <a href="mailto:info@insyto.it" className="text-primary hover:underline">info@insyto.it</a>
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

