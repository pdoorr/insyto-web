'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * Il banco di misura della home.
 *
 * Ogni capacità è un canale con un proprio profilo d'onda: selezionarlo
 * ridisegna il tracciato. Non è decorazione — è il modo in cui la pagina dice
 * che cosa vendiamo, cioè la verifica, senza doverlo scrivere.
 */

const CHANNELS = [
  { key: 'progettazione', freq: 1.1, amp: 0.52, noise: 0.05, square: 0 },
  { key: 'integrazione', freq: 2.3, amp: 0.4, noise: 0.09, square: 0 },
  { key: 'installazione', freq: 0.7, amp: 0.62, noise: 0.03, square: 0.6 },
  { key: 'collaudo', freq: 3.4, amp: 0.3, noise: 0.16, square: 0 },
  { key: 'manutenzione', freq: 1.6, amp: 0.34, noise: 0.02, square: 0.25 },
] as const

const SIGNAL = '#FFB03A'
const GRID = 'rgba(126,168,186,.13)'

export default function TestBench({ locale }: { locale: string }) {
  const t = useTranslations('hero')
  const tServices = useTranslations('services')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const phaseRef = useRef(0)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)

  // activeRef evita di far ripartire il loop di animazione a ogni selezione.
  useEffect(() => {
    activeRef.current = active
  }, [active])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas.getBoundingClientRect()
    if (width === 0 || height === 0) return
    const middle = height / 2
    ctx.clearRect(0, 0, width, height)

    // Graticola.
    ctx.strokeStyle = GRID
    ctx.lineWidth = 1
    for (let i = 0; i <= 12; i++) {
      const x = (width / 12) * i
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Tracciato del canale selezionato.
    const channel = CHANNELS[activeRef.current]
    ctx.beginPath()
    for (let x = 0; x <= width; x++) {
      const angle = (x / width) * Math.PI * 2 * channel.freq * 3 + phaseRef.current
      let value = Math.sin(angle)
      if (channel.square) {
        value = value * (1 - channel.square) + (value > 0 ? channel.square : -channel.square)
      }
      value += Math.sin(angle * 7.3) * channel.noise
      const y = middle - value * middle * channel.amp * 1.5
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.strokeStyle = SIGNAL
    ctx.lineWidth = 1.6
    ctx.shadowColor = 'rgba(255,176,58,.55)'
    ctx.shadowBlur = 7
    ctx.stroke()
    ctx.shadowBlur = 0
  }, [])

  const resize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.max(1, Math.round(rect.width * dpr))
    canvas.height = Math.max(1, Math.round(rect.height * dpr))
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    draw()
  }, [draw])

  useEffect(() => {
    resize()
    window.addEventListener('resize', resize)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let cancelled = false

    const loop = () => {
      if (cancelled) return
      phaseRef.current += 0.016
      draw()
      frameRef.current = requestAnimationFrame(loop)
    }

    // Con reduced-motion il tracciato resta fermo ma cambia ancora al
    // cambio di canale: l'informazione si conserva, il movimento no.
    const start = () => {
      cancelAnimationFrame(frameRef.current)
      if (reduced.matches) draw()
      else frameRef.current = requestAnimationFrame(loop)
    }

    start()
    reduced.addEventListener('change', start)

    return () => {
      cancelled = true
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
      reduced.removeEventListener('change', start)
    }
  }, [draw, resize])

  // Ridisegna subito alla selezione, così funziona anche a animazione ferma.
  useEffect(() => {
    draw()
  }, [active, draw])

  return (
    <section className="graticule border-b rule-instrument">
      <div className="grid lg:grid-cols-[1fr_340px]">
        <div className="px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-instrument-signal">
            {t('kicker')}
          </p>

          <h1 className="mt-6 max-w-[18ch] font-mono text-[clamp(1.6rem,3.9vw,2.9rem)] font-medium uppercase leading-[1.1] tracking-tight text-instrument-bright text-balance">
            {t('titleLead')}{' '}
            <span className="text-instrument-signal">{t('titleAccent')}</span>
          </h1>

          <p className="mt-6 max-w-[52ch] text-[15.5px] leading-relaxed text-instrument-dim">
            {t('subtitle')}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/contatti`}
              className="border border-instrument-signal px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-instrument-signal transition-colors hover:bg-instrument-signal hover:text-instrument-ground"
            >
              {t('primaryAction')}
            </Link>
            <Link
              href={`/${locale}/servizi`}
              className="border border-instrument-rule px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-instrument-text transition-colors hover:border-instrument-dim"
            >
              {t('secondaryAction')}
            </Link>
          </div>

          <canvas
            ref={canvasRef}
            role="img"
            aria-label={`${t('traceActive')}: ${tServices(`items.${CHANNELS[active].key}.name`)}`}
            className="mt-10 block h-[168px] w-full border rule-instrument bg-instrument-ground/60"
          />
          <div className="flex justify-between pt-2 font-mono text-[10px] tracking-[0.1em] text-instrument-dim">
            <span>{t('traceStart')}</span>
            <span className="uppercase">{t('traceActive')}</span>
            <span>{t('traceEnd')}</span>
          </div>
        </div>

        <div className="border-t rule-instrument bg-instrument-panel lg:border-l lg:border-t-0">
          <h2 className="label-instrument px-6 pt-6">{t('channelsLabel')}</h2>
          <ul className="mt-1">
            {CHANNELS.map((channel, index) => (
              <li key={channel.key}>
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  aria-pressed={active === index}
                  className={cn(
                    'grid w-full grid-cols-[26px_1fr] items-center gap-3 border-t rule-instrument px-6 py-4 text-left transition-colors',
                    active === index ? 'bg-instrument-signal/[0.07]' : 'hover:bg-instrument-signal/[0.04]'
                  )}
                >
                  <span
                    className={cn(
                      'font-mono text-[10.5px] tabular',
                      active === index ? 'text-instrument-signal' : 'text-instrument-dim'
                    )}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={cn(
                      'font-mono text-[12.5px] uppercase tracking-[0.07em]',
                      active === index ? 'text-instrument-bright' : 'text-instrument-text'
                    )}
                  >
                    {tServices(`items.${channel.key}.name`)}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t rule-instrument px-6 py-6">
            <p className="label-instrument leading-relaxed">{t('channelsHint')}</p>
            <p className="mt-5 font-mono text-[12px] leading-relaxed text-instrument-text">
              {tServices(`items.${CHANNELS[active].key}.short`)}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
