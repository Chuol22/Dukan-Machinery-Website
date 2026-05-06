'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Plus, Minus } from 'lucide-react'

export interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
}

export interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  defaultOpenItems?: string[]
  variant?: 'default' | 'bordered' | 'separated'
  icon?: 'chevron' | 'plus-minus'
}

export default function Accordion({ 
  items, 
  allowMultiple = false, 
  defaultOpenItems = [],
  variant = 'default',
  icon = 'chevron'
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpenItems)

  const toggleItem = (itemId: string) => {
    if (allowMultiple) {
      setOpenItems(prev => 
        prev.includes(itemId) 
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      )
    } else {
      setOpenItems(prev => 
        prev.includes(itemId) ? [] : [itemId]
      )
    }
  }

  const variants = {
    default: 'border-b border-neutral-200 dark:border-neutral-700 last:border-0',
    bordered: 'border border-neutral-200 dark:border-neutral-700 rounded-lg mb-2',
    separated: 'rounded-lg shadow-md mb-4',
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isOpen = openItems.includes(item.id)
        
        return (
          <div key={item.id} className={variants[variant]}>
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <span className="font-semibold text-neutral-900 dark:text-white">
                {item.title}
              </span>
              {icon === 'chevron' ? (
                <ChevronDown className={`w-5 h-5 text-neutral-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              ) : (
                isOpen ? (
                  <Minus className="w-5 h-5 text-neutral-500" />
                ) : (
                  <Plus className="w-5 h-5 text-neutral-500" />
                )
              )}
            </button>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 text-neutral-600 dark:text-neutral-400">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}