import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@sanity/client'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const position = formData.get('position') as string
    const experience = formData.get('experience') as string
    const message = formData.get('message') as string
    const subject = formData.get('subject') as string
    const cvFile = formData.get('cv') as File | null

    // Validate required fields
    if (!name || !email || !phone || !position || !experience) {
      return NextResponse.json(
        { error: 'Campi obbligatori mancanti' },
        { status: 400 }
      )
    }

    // Upload CV to Sanity if present
    let cvAsset = null
    if (cvFile) {
      try {
        const cvArrayBuffer = await cvFile.arrayBuffer()
        const cvBuffer = Buffer.from(cvArrayBuffer)

        const asset = await sanity.assets.upload('file', cvBuffer, {
          filename: cvFile.name,
        })

        cvAsset = {
          _ref: asset._id,
          _type: 'reference',
        }
      } catch (error) {
        console.error('Error uploading CV:', error)
        // Continue without CV if upload fails
      }
    }

    // Save application to Sanity
    const application = {
      _type: 'jobApplication',
      name,
      email,
      phone,
      position,
      experience,
      message: message || '',
      cv: cvAsset,
      status: 'new',
      appliedAt: new Date().toISOString(),
    }

    try {
      const result = await sanity.create(application)
      console.log('Application saved to Sanity:', result._id)
    } catch (error) {
      console.error('Error saving to Sanity:', error)
      // Return error instead of continuing
      return NextResponse.json(
        { error: 'Errore nel salvataggio della candidatura' },
        { status: 500 }
      )
    }

    // Send email notification
    if (resend) {
      const emailContent = `
        <h2>Nuova candidatura ricevuta</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefono:</strong> ${phone}</p>
        <p><strong>Posizione:</strong> ${position}</p>
        <p><strong>Esperienza:</strong></p>
        <p>${experience.replace(/\n/g, '<br>')}</p>
        ${message ? `<p><strong>Messaggio:</strong><br>${message.replace(/\n/g, '<br>')}</p>` : ''}
        ${cvFile ? '<p><em>CV allegato</em></p>' : ''}
      `

      await resend.emails.send({
        from: 'IN SY TO <noreply@insyto.it>',
        to: process.env.CONTACT_EMAIL || 'info@insyto.it',
        reply_to: email,
        subject: subject || `Candidatura: ${position}`,
        html: emailContent,
      })
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('Application form error:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
