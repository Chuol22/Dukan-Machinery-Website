// ThemeContext.tsx — light/dark theme state and persistence
'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// User-selectable theme; effectiveTheme resolves light to system preference
type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  effectiveTheme: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Hydrate from localStorage on first client render
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light'
    const savedTheme = localStorage.getItem('theme') as Theme | null
    return savedTheme && ['light', 'dark'].includes(savedTheme) ? savedTheme : 'light'
  })
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light')

  const effectiveTheme = theme === 'light' ? systemTheme : theme

  // Track OS color-scheme and sync initial dark class
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const updateSystemTheme = (matches: boolean) => {
      setSystemTheme(matches ? 'dark' : 'light')
    }

    updateSystemTheme(mediaQuery.matches)

    const savedTheme = localStorage.getItem('theme') as Theme | null
    const isValid = savedTheme && ['light', 'dark'].includes(savedTheme)
    if (isValid) {
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    }

    const handleChange = (event: MediaQueryListEvent) => {
      updateSystemTheme(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Apply dark class and persist user choice
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', effectiveTheme === 'dark')

    localStorage.setItem('theme', theme)
  }, [theme, effectiveTheme])

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === 'light') return 'dark'
      if (prev === 'dark') return 'light'
      return 'light'
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook for consuming theme context
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
