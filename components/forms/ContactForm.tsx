'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, Textarea, Card } from '@/components/ui'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(2, 'Il nome deve essere di almeno 2 caratteri'),
  email: z.string().email('Email non valida'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'L\'oggetto deve essere di almeno 5 caratteri'),
  message: z.string().min(10, 'Il messaggio deve essere di almeno 10 caratteri'),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Errore nell\'invio del messaggio')
      }

      setSubmitStatus('success')
      reset()
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Invia un messaggio</h2>
      
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <p className="text-green-800">Messaggio inviato con successo! Ti risponderemo presto.</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">Errore nell'invio del messaggio. Riprova più tardi.</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Nome *"
          {...register('name')}
          error={errors.name?.message}
          placeholder="Il tuo nome"
        />

        <Input
          label="Email *"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="tua.email@esempio.com"
        />

        <Input
          label="Telefono"
          type="tel"
          {...register('phone')}
          error={errors.phone?.message}
          placeholder="+39 123 456 7890"
        />

        <Input
          label="Oggetto *"
          {...register('subject')}
          error={errors.subject?.message}
          placeholder="Oggetto del messaggio"
        />

        <Textarea
          label="Messaggio *"
          rows={6}
          {...register('message')}
          error={errors.message?.message}
          placeholder="Scrivi il tuo messaggio qui..."
        />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Invio in corso...
            </>
          ) : (
            'Invia messaggio'
          )}
        </Button>
      </form>
    </Card>
  )
}

