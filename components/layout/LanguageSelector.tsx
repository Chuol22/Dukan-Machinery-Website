// components/layout/LanguageSelector.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useLanguage, type Language } from '@/contexts/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ChevronDown } from 'lucide-react'
import { li } from 'framer-motion/client'

const languages: { code: Language; nativeName: string; englishName: string; flag: string }[] = [
  { code: 'en', nativeName: 'English',       englishName: 'English', flag: '🇬🇧' },
  { code: 'am', nativeName: 'አማርኛ',          englishName: 'Amharic', flag: '🇪🇹' },
  { code: 'om', nativeName: 'Afaan Oromoo',  englishName: 'Oromoo',  flag: '🇪🇹' },
]

export default function LanguageSelector() {
  const [isOpen, setIsOpen]       = useState(false)
  const { language, setLanguage } = useLanguage()
  const dropdownRef               = useRef<HTMLDivElement>(null)

  const current = languages.find(l => l.code === language) ?? languages[0]

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (code: Language) => {
    setLanguage(code)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg
                   bg-neutral-100 dark:bg-neutral-800
                   hover:bg-neutral-200 dark:hover:bg-neutral-700
                   transition-all duration-200 select-none
                   min-h-[44px] min-w-[44px]"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-4 h-4" />
        <span className="text-xs font-black">{current.flag}</span>
        <span className="text-xs font-black hidden sm:inline">{current.nativeName}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            role="listbox"
            aria-label="Language options"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48
                       bg-white dark:bg-neutral-800
                       rounded-xl shadow-xl
                       border border-neutral-200 dark:border-neutral-700
                       overflow-hidden z-50"
          >
            {languages.map(lang => {
              const isActive = language === lang.code
              return (
                <li key={lang.code} role="option" aria-selected={isActive}>
                  <button
                    onClick={() => handleSelect(lang.code)}
                    className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm
                                transition-colors duration-150
                                ${isActive
                                  ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                                }`}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <div className="flex flex-col items-start leading-tight">
                      <span className="font-black text-xs">{lang.nativeName}</span>
                      <span className="text-[10px] opacity-60">{lang.englishName}</span>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="activeLang"
                        className="ml-auto w-2 h-2 rounded-full bg-orange-500"
                      />
                    )}
                  </button>
                </li>
              )
            })}

            <li className="px-4 py-2 border-t border-neutral-100 dark:border-neutral-700">
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 leading-tight">
                Powered by Google Translate API
              </p>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
