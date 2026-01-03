import { ButtonHTMLAttributes, forwardRef } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', href, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden group'

    const variants = {
      primary: 'bg-gradient-to-r from-primary to-primary-dark text-white hover:from-primary-light hover:to-primary hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 focus:ring-primary',
      secondary: 'bg-gradient-to-r from-secondary to-secondary-dark text-white hover:from-secondary-light hover:to-secondary hover:shadow-lg hover:shadow-secondary/40 hover:-translate-y-0.5 focus:ring-secondary',
      outline: 'border-2 border-primary text-primary hover:bg-gradient-to-r hover:from-primary hover:to-primary-dark hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 focus:ring-primary',
      ghost: 'text-primary hover:bg-primary/10 hover:shadow-md hover:-translate-y-0.5 focus:ring-primary',
    }

    const sizes = {
      sm: 'px-6 py-2.5 text-sm',
      md: 'px-8 py-3 text-base',
      lg: 'px-10 py-4 text-lg',
    }

    const classes = cn(baseStyles, variants[variant], sizes[size], className)

    if (href) {
      return (
        <Link
          href={href}
          className={classes}
          {...(props as any)}
        />
      )
    }

    return (
      <button
        ref={ref}
        className={classes}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export default Button

