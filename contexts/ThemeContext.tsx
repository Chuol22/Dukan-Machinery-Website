// contexts/ThemeContext.tsx
'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'


type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  effectiveTheme: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light'
    const savedTheme = localStorage.getItem('theme') as Theme | null
    return savedTheme && ['light', 'dark'].includes(savedTheme) ? savedTheme : 'light'
  })
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light')




  // Calculate effective theme
  const effectiveTheme = theme === 'light' ? systemTheme : theme

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const updateSystemTheme = (matches: boolean) => {
      setSystemTheme(matches ? 'dark' : 'light')
    }

    updateSystemTheme(mediaQuery.matches)

    // Apply saved theme class immediately (state already initialized lazily).
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




  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', effectiveTheme === 'dark')

    // Persist selected theme (light/dark/system)
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

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}