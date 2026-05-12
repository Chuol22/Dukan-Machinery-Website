// contexts/LanguageContext.tsx
'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'

export type Language = 'en' | 'am' | 'om'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  /** Looks up a manually-translated key (nav labels, CTAs, etc.) */
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// ---------------------------------------------------------------------------
// Static translations for high-priority UI strings (nav, CTAs, buttons).
// Everything else is handled by useTranslation() hook via the API.
// ---------------------------------------------------------------------------
const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.machines': 'Machines',
    'nav.order': 'Order',
    'nav.process': 'Process',
    'nav.testimonials': 'Testimonials',
    'nav.insights': 'Insights',
    'nav.contact': 'Contact',
    'hero.cta.machines': 'View Machines',
    'hero.cta.order': 'Order Custom Machine',
    'cta.consultation': 'Request Free Consultation',
    'cta.contact': 'Contact Sales',
    'order.standard': 'Standard Order',
    'order.custom': 'Custom Request',
    'footer.rights': 'All rights reserved.',
  },
  am: {
    'nav.home': 'መነሻ',
    'nav.machines': 'ማሽኖች',
    'nav.order': 'ትዕዛዝ',
    'nav.process': 'ሂደት',
    'nav.testimonials': 'ምስክርነቶች',
    'nav.insights': 'ግንዛቤዎች',
    'nav.contact': 'አግኙን',
    'hero.cta.machines': 'ማሽኖችን ይመልከቱ',
    'hero.cta.order': 'ብጁ ማሽን ያዝዙ',
    'cta.consultation': 'ነፃ ምክር ይጠይቁ',
    'cta.contact': 'ሽያጭ ያነጋግሩ',
    'order.standard': 'መደበኛ ትዕዛዝ',
    'order.custom': 'ብጁ ጥያቄ',
    'footer.rights': 'መብቶች ሁሉ የተጠበቁ ናቸው።',
  },
  om: {
    'nav.home': 'Mana',
    'nav.machines': 'Mashiinota',
    'nav.order': 'Ajaju',
    'nav.process': 'Adeemsa',
    'nav.testimonials': 'Raggaasoota',
    'nav.insights': 'Hubannoo',
    'nav.contact': 'Quunnamti',
    'hero.cta.machines': 'Mashiinota Ilaali',
    'hero.cta.order': 'Mashiina Addaa Ajaji',
    'cta.consultation': 'Gorsa Bilisaa Gaafadhu',
    'cta.contact': 'Gurgurtaa Quunnamti',
    'order.standard': 'Ajaja Idilee',
    'order.custom': 'Gaaffii Addaa',
    'footer.rights': 'Mirgi hundi eegameera.',
  },
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  // Restore saved language on mount
  useEffect(() => {
    const saved = localStorage.getItem('dkm_language') as Language | null
    if (saved && ['en', 'am', 'om'].includes(saved)) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('dkm_language', lang)
  }, [])

  const t = useCallback(
    (key: string): string =>
      translations[language][key] ?? translations['en'][key] ?? key,
    [language]
  )

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
