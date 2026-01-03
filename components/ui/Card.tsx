import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'dark'
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, ...props }, ref) => {
    const variants = {
      default: 'bg-white border border-gray-200',
      glass: 'glass shadow-lg',
      dark: 'glass-dark text-white',
    }
    
    const hoverEffect = hover ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1' : ''
    
    return (
      <div
        ref={ref}
        className={cn('rounded-xl p-6', variants[variant], hoverEffect, className)}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

export default Card

