'use client'

import { forwardRef, useState } from 'react'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  helperText?: string
  required?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    success, 
    icon, 
    iconPosition = 'left',
    helperText,
    required,
    type = 'text',
    className = '',
    disabled,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    const baseStyles = 'w-full px-4 py-2 text-base bg-neutral-50 dark:bg-neutral-900 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200'
    
    const stateStyles = error
      ? 'border-red-500 focus:ring-red-500'
      : success
      ? 'border-green-500 focus:ring-green-500'
      : 'border-neutral-200 dark:border-neutral-700 focus:border-primary focus:ring-primary'

    const paddingStyles = icon && iconPosition === 'left' ? 'pl-10' : icon && iconPosition === 'right' ? 'pr-10' : ''

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            className={`${baseStyles} ${stateStyles} ${paddingStyles} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            {...props}
          />
          
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
          
          {!isPassword && icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
              {icon}
            </div>
          )}
        </div>
        
        {error && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
        
        {success && !error && (
          <div className="flex items-center gap-1 mt-1 text-green-500 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Valid input</span>
          </div>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input