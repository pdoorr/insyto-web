import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'fwnaiu91',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function checkApplications() {
  try {
    const applications = await client.fetch(
      `*[_type == "jobApplication"] | order(appliedAt desc)`
    )

    console.log(`\n=== Candidature trovate: ${applications.length} ===\n`)

    applications.forEach((app: any, index: number) => {
      console.log(`${index + 1}. ${app.name}`)
      console.log(`   Email: ${app.email}`)
      console.log(`   Telefono: ${app.phone}`)
      console.log(`   Posizione: ${app.position}`)
      console.log(`   Stato: ${app.status}`)
      console.log(`   Data: ${new Date(app.appliedAt).toLocaleString('it-IT')}`)
      console.log(`   CV: ${app.cv ? '✓ Presente' : '✗ Assente'}`)
      console.log('')
    })

    if (applications.length === 0) {
      console.log('Nessuna candidatura trovata.')
    }
  } catch (error) {
    console.error('Errore:', error)
  }
}

checkApplications()
