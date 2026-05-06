'use client'

import { useState, useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

export interface CounterProps {
  initialValue?: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
  label?: string
  format?: (value: number) => string
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export default function Counter({ 
  initialValue = 0, 
  min = -Infinity, 
  max = Infinity, 
  step = 1,
  onChange,
  label,
  format = (value) => value.toString(),
  size = 'md',
  animated = true
}: CounterProps) {
  const [value, setValue] = useState(initialValue)
  const [isAnimating, setIsAnimating] = useState(false)

  const springValue = useSpring(initialValue, { stiffness: 300, damping: 30 })
  const displayValue = useTransform(springValue, (latest) => format(Math.round(latest)))

  useEffect(() => {
    springValue.set(value)
  }, [value, springValue])

  const updateValue = (newValue: number) => {
    const clampedValue = Math.min(max, Math.max(min, newValue))
    setValue(clampedValue)
    onChange?.(clampedValue)
    
    if (animated) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  const increment = () => updateValue(value + step)
  const decrement = () => updateValue(value - step)

  const sizes = {
    sm: 'w-28 h-8 text-sm',
    md: 'w-32 h-10 text-base',
    lg: 'w-40 h-12 text-lg',
  }

  const buttonSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }

  return (
    <div className="inline-flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
      )}
      
      <div className={`flex items-center gap-2 ${sizes[size]}`}>
        <button
          onClick={decrement}
          disabled={value <= min}
          className={`${buttonSizes[size]} rounded-full border border-neutral-200 dark:border-neutral-700 flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Minus className="w-3 h-3" />
        </button>
        
        <div className="flex-1 text-center font-semibold relative">
          {animated ? (
            <motion.span
              animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {displayValue}
            </motion.span>
          ) : (
            format(value)
          )}
        </div>
        
        <button
          onClick={increment}
          disabled={value >= max}
          className={`${buttonSizes[size]} rounded-full border border-neutral-200 dark:border-neutral-700 flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
      
      {(min > -Infinity || max < Infinity) && (
        <p className="text-xs text-neutral-500">
          Range: {format(min)} - {format(max)}
        </p>
      )}
    </div>
  )
}