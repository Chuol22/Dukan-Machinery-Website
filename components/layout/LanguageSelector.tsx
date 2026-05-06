// components/LanguageSelector.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ChevronDown } from 'lucide-react'

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
  { code: 'om', name: 'Oromoo', flag: '🇪🇹' },
]

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage } = useLanguage()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = languages.find(lang => lang.code === language)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 px-2 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all duration-200"
      >
        <Globe className="w-4 h-4" />
        <span className="text-xs font-black">{currentLanguage?.flag}</span>
        <span className="text-xs font-black hidden sm:inline">{currentLanguage?.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-40 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden z-50"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as any)
                  setIsOpen(false)
                }}
                className={`flex items-center space-x-2 w-full px-3 py-1.5 text-xs transition-colors ${
                  language === lang.code
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
                {language === lang.code && (
                  <motion.div
                    layoutId="activeLanguage"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}