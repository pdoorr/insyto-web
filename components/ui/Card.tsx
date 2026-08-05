import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A quale mondo visivo appartiene la superficie.
   * - `sheet`: tavola tecnica, per le pagine di capability
   * - `instrument`: pannello del banco di misura, per home e verifica
   */
  variant?: 'sheet' | 'instrument'
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'sheet', hover = false, ...props }, ref) => {
    // Niente angoli arrotondati: non li ha ne' una tavola ne' un pannello di
    // strumento, ed e' quello che distingue queste superfici da una card generica.
    const variants = {
      sheet: 'bg-sheet-surface border border-sheet-hairline text-sheet-ink',
      instrument: 'bg-instrument-panel border border-instrument-rule text-instrument-text',
    }

    const hoverEffect = {
      sheet: 'transition-colors duration-200 hover:border-sheet-hair',
      instrument: 'transition-colors duration-200 hover:border-instrument-signal/50',
    }

    return (
      <div
        ref={ref}
        className={cn('p-6', variants[variant], hover && hoverEffect[variant], className)}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

export default Card
