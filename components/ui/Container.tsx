'use client'

import { forwardRef } from 'react'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: boolean
  children: React.ReactNode
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ maxWidth = '2xl', padding = true, children, className = '', ...props }, ref) => {
    const maxWidths = {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      full: 'max-w-full',
    }
    
    return (
      <div
        ref={ref}
        className={`mx-auto ${maxWidths[maxWidth]} ${padding ? 'px-4 sm:px-6 lg:px-8' : ''} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Container.displayName = 'Container'

export default Container