'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, Monitor } from 'lucide-react'

type Theme = 'light' | 'dark' | 'system'

export default function ModeToggle() {
  const [theme, setTheme] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      applyTheme('system')
    }
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    
    if (newTheme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (systemDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    } else if (newTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: newTheme } }))
  }

  const cycleTheme = () => {
    if (theme === 'light') handleThemeChange('dark')
    else if (theme === 'dark') handleThemeChange('system')
    else handleThemeChange('light')
  }

  const getThemeIcon = () => {
    if (theme === 'light') return Sun
    if (theme === 'dark') return Moon
    return Monitor
  }

  const getThemeLabel = () => {
    if (theme === 'light') return 'Light'
    if (theme === 'dark') return 'Dark'
    return 'System'
  }

  const Icon = getThemeIcon()

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 w-9 h-9" />
    )
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={cycleTheme}
      className="relative group p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300"
      aria-label={`Current theme: ${getThemeLabel()}. Click to change`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : theme === 'light' ? 180 : 90 }}
        transition={{ duration: 0.3 }}
      >
        <Icon className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400 group-hover:text-primary transition-colors" />
      </motion.div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 px-1.5 py-0.5 bg-neutral-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {getThemeLabel()}
      </div>
    </motion.button>
  )
}