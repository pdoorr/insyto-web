import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  gradient?: boolean
}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, as: Component = 'h2', gradient = false, children, ...props }, ref) => {
    const sizes = {
      h1: 'text-4xl md:text-5xl lg:text-6xl font-bold',
      h2: 'text-3xl md:text-4xl lg:text-5xl font-bold',
      h3: 'text-2xl md:text-3xl lg:text-4xl font-semibold',
      h4: 'text-xl md:text-2xl lg:text-3xl font-semibold',
      h5: 'text-lg md:text-xl lg:text-2xl font-medium',
      h6: 'text-base md:text-lg lg:text-xl font-medium',
    }
    
    return (
      <Component
        ref={ref}
        className={cn(
          sizes[Component],
          gradient && 'text-gradient',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Heading.displayName = 'Heading'

export default Heading

