'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, Textarea, Card } from '@/components/ui'
import { Loader2, CheckCircle2, AlertCircle, Upload, FileText, X } from 'lucide-react'

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
  const [cvFile, setCvFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Il file è troppo grande. Maximum 5MB.')
        return
      }
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        alert('Formato non supportato. Usa PDF, DOC o DOCX.')
        return
      }
      setCvFile(file)
    }
  }

  const removeFile = () => {
    setCvFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('email', data.email)
      formData.append('phone', data.phone)
      formData.append('position', data.position)
      formData.append('experience', data.experience)
      formData.append('message', data.message || '')
      formData.append('subject', `Candidatura: ${data.position}`)

      if (cvFile) {
        formData.append('cv', cvFile)
      }

      const response = await fetch('/api/application', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Errore nell\'invio della candidatura')
      }

      setSubmitStatus('success')
      reset()
      setCvFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
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
          <p className="text-red-800">Errore nell&apos;invio della candidatura. Riprova più tardi.</p>
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

        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            CV (PDF, DOC, DOCX - max 5MB)
          </label>
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="cv-upload"
            />
            <label
              htmlFor="cv-upload"
              className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-dark/30 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <Upload className="w-5 h-5 text-dark/60" />
              <span className="text-sm text-dark/60">
                {cvFile ? cvFile.name : 'Clicca per caricare il CV'}
              </span>
            </label>
            {cvFile && (
              <button
                type="button"
                onClick={removeFile}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {cvFile && (
            <div className="mt-2 flex items-center gap-2 text-sm text-dark/60">
              <FileText className="w-4 h-4" />
              <span>{(cvFile.size / 1024).toFixed(0)} KB</span>
            </div>
          )}
        </div>

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

