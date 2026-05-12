// hooks/useTranslation.ts
// Translates an array of strings via our server-side API route.
// Results are cached in memory so the same strings are never fetched twice.

import { useState, useEffect, useRef } from 'react'
import { useLanguage, type Language } from '@/contexts/LanguageContext'

// In-memory cache: { "am:Hello World": "ሰላም ዓለም", ... }
const cache = new Map<string, string>()

function cacheKey(lang: Language, text: string) {
  return `${lang}:${text}`
}

/**
 * Translate an array of English strings to the current language.
 *
 * Usage:
 *   const [title, subtitle] = useTranslation(['Our Machines', 'Browse the catalog'])
 *
 * - Returns the original English strings immediately (no flash)
 * - Replaces them with translations once the API responds
 * - Caches results — subsequent renders with the same strings are instant
 * - Falls back to English if the API key is not configured or the call fails
 */
export function useTranslation(englishStrings: string[]): string[] {
  const { language } = useLanguage()
  const [translated, setTranslated] = useState<string[]>(englishStrings)
  // Track the strings we were initialised with so we can detect changes
  const stringsRef = useRef(englishStrings)

  useEffect(() => {
    // English — no translation needed
    if (language === 'en') {
      setTranslated(englishStrings)
      return
    }

    // Check which strings are already cached
    const results = [...englishStrings]
    const missing: { index: number; text: string }[] = []

    englishStrings.forEach((text, i) => {
      const key = cacheKey(language, text)
      if (cache.has(key)) {
        results[i] = cache.get(key)!
      } else {
        missing.push({ index: i, text })
      }
    })

    // All cached — update immediately without a fetch
    if (missing.length === 0) {
      setTranslated(results)
      return
    }

    // Show cached results immediately while fetching the rest
    setTranslated([...results])

    // Fetch missing translations
    let cancelled = false
    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        texts: missing.map(m => m.text),
        targetLang: language,
      }),
    })
      .then(r => r.json())
      .then(data => {
        if (cancelled) return
        if (data.translations) {
          data.translations.forEach((translatedText: string, i: number) => {
            const { index, text } = missing[i]
            cache.set(cacheKey(language, text), translatedText)
            results[index] = translatedText
          })
          setTranslated([...results])
        }
      })
      .catch(err => {
        // Silently fall back to English on error
        console.warn('[useTranslation] fetch failed, using English fallback:', err)
      })

    return () => {
      cancelled = true
    }
  }, [language, englishStrings.join('||')])

  return translated
}
