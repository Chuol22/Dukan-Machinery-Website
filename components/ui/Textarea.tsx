import { forwardRef } from 'react'
import { AlertCircle } from 'lucide-react'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
  rows?: number
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    label, 
    error, 
    helperText, 
    required, 
    rows = 4, 
    className = '',
    disabled,
    ...props 
  }, ref) => {
    const baseStyles = 'w-full px-4 py-2 text-base bg-neutral-50 dark:bg-neutral-900 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 resize-y'
    
    const stateStyles = error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-neutral-200 dark:border-neutral-700 focus:border-primary focus:ring-primary'

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <textarea
          ref={ref}
          rows={rows}
          disabled={disabled}
          className={`${baseStyles} ${stateStyles} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
          {...props}
        />
        
        {error && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea