// contexts/LanguageContext.tsx
'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'am' | 'om'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translations
const translations = {
  en: {
    'nav.home': 'Home',
    'nav.machines': 'Machines',
    'nav.order': 'Order',
    'nav.process': 'Process',
    'nav.testimonials': 'Testimonials',
    'nav.insights': 'Insights',
    'nav.contact': 'Contact',
  },
  am: {
    'nav.home': 'መነሻ',
    'nav.machines': 'ማሽኖች',
    'nav.order': 'ትዕዛዝ',
    'nav.process': 'ሂደት',
    'nav.testimonials': 'ምስክርነቶች',
    'nav.insights': 'ግንዛቤዎች',
    'nav.contact': 'አግኙን',
  },
  om: {
    'nav.home': 'Mana',
    'nav.machines': 'Mashiinota',
    'nav.order': 'Ajaju',
    'nav.process': 'Adeemsa',
    'nav.testimonials': 'Raggaasoota',
    'nav.insights': 'Hubannoo',
    'nav.contact': 'Quunnamti',
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('language', language)
    }
  }, [language, mounted])

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key
  }

  if (!mounted) {
    return null
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}