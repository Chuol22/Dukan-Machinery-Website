'use client'

import { forwardRef } from 'react'
import { ChevronDown, AlertCircle } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: SelectOption[]
  error?: string
  helperText?: string
  required?: boolean
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    label, 
    options, 
    error, 
    helperText, 
    required, 
    placeholder, 
    className = '',
    disabled,
    value,
    ...props 
  }, ref) => {
    const baseStyles = 'w-full px-4 py-2 text-base bg-gray-50 dark:bg-gray-900 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 appearance-none cursor-pointer'
    
    const stateStyles = error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-primary'

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <select
            ref={ref}
            disabled={disabled}
            value={value}
            className={`${baseStyles} ${stateStyles} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled={!!value}>{placeholder}</option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        
        {error && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select