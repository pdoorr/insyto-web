'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, Textarea, Card } from '@/components/ui'
import { Loader2, CheckCircle2, AlertCircle, Upload } from 'lucide-react'

const applicationSchema = z.object({
  name: z.string().min(2, 'Il nome deve essere di almeno 2 caratteri'),
  email: z.string().email('Email non valida'),
  phone: z.string().min(10, 'Numero di telefono non valido'),
  position: z.string().min(3, 'Specifica la posizione di interesse'),
  experience: z.string().min(10, 'Descrivi la tua esperienza'),
  message: z.string().optional(),
})

type ApplicationFormData = z.infer<typeof applicationSchema>

export default function JobApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  })

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          subject: `Candidatura: ${data.position}`,
          message: `Candidatura per: ${data.position}\n\nEsperienza:\n${data.experience}\n\n${data.message || ''}`,
        }),
      })

      if (!response.ok) {
        throw new Error('Errore nell\'invio della candidatura')
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
      <h2 className="text-2xl font-bold mb-6">Invia la tua candidatura</h2>
      
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <p className="text-green-800">Candidatura inviata con successo! Ti contatteremo presto.</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">Errore nell'invio della candidatura. Riprova più tardi.</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Nome e Cognome *"
          {...register('name')}
          error={errors.name?.message}
          placeholder="Il tuo nome completo"
        />

        <Input
          label="Email *"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="tua.email@esempio.com"
        />

        <Input
          label="Telefono *"
          type="tel"
          {...register('phone')}
          error={errors.phone?.message}
          placeholder="+39 123 456 7890"
        />

        <Input
          label="Posizione di interesse *"
          {...register('position')}
          error={errors.position?.message}
          placeholder="Es: Ingegnere Elettronico"
        />

        <Textarea
          label="Esperienza e competenze *"
          rows={6}
          {...register('experience')}
          error={errors.experience?.message}
          placeholder="Descrivi la tua esperienza, competenze e formazione..."
        />

        <Textarea
          label="Messaggio aggiuntivo"
          rows={4}
          {...register('message')}
          error={errors.message?.message}
          placeholder="Eventuali note aggiuntive..."
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
            <>
              <Upload className="w-5 h-5 mr-2" />
              Invia candidatura
            </>
          )}
        </Button>
      </form>
    </Card>
  )
}

