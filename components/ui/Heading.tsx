import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, as: Component = 'h2', children, ...props }, ref) => {
    // Scala serrata: i titoli di questo sito sono impostati in monospaziato o
    // in Source Code Pro, dove la crenatura larga di default fa perdere peso.
    const sizes = {
      h1: 'text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight',
      h2: 'text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight',
      h3: 'text-xl md:text-2xl lg:text-3xl font-medium tracking-tight',
      h4: 'text-lg md:text-xl lg:text-2xl font-medium',
      h5: 'text-base md:text-lg lg:text-xl font-medium',
      h6: 'text-sm md:text-base lg:text-lg font-medium',
    }

    return (
      <Component
        ref={ref}
        className={cn(sizes[Component], 'text-balance', className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Heading.displayName = 'Heading'

export default Heading

