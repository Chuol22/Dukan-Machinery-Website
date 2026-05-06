'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChatbotButton from './ChatbotButton'
import ChatWindow from './ChatWindow'
import { ChatProvider } from '@/contexts/ChatbotContext'

interface ChatbotWidgetProps {
  position?: 'bottom-right' | 'bottom-left'
}

export default function ChatbotWidget({ position = 'bottom-right' }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)

  useEffect(() => {
    if (!isOpen && !isMinimized) {
      const timer = setTimeout(() => setHasUnread(true), 30000)
      return () => clearTimeout(timer)
    } else {
      setHasUnread(false)
    }
  }, [isOpen, isMinimized])

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev)
    setIsMinimized(false)
    setHasUnread(false)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  const handleMinimize = () => {
    setIsMinimized(true)
    setIsOpen(false)
  }

  const handleRestore = () => {
    setIsMinimized(false)
    setIsOpen(true)
  }

  const isRight = position === 'bottom-right'

  return (
    <ChatProvider>
      <div className={`fixed z-[9999] bottom-6 ${isRight ? 'right-6' : 'left-6'}`}>

        {/* CHAT WINDOW */}
        <AnimatePresence>
          {isOpen && !isMinimized && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={`
                absolute bottom-20
                ${isRight ? 'right-0' : 'left-0'}
                w-[95vw] sm:w-[450px] md:w-[500px] lg:w-[550px]
                h-[600px] max-h-[85vh]
                bg-white dark:bg-neutral-900
                rounded-2xl shadow-2xl overflow-hidden
                border border-neutral-200 dark:border-neutral-700
              `}
            >
              <ChatWindow onClose={handleClose} onMinimize={handleMinimize} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* BUTTON */}
        <ChatbotButton
          onClick={handleToggle}
          isOpen={isOpen || isMinimized}
          hasUnread={hasUnread}
          onMinimizedRestore={isMinimized ? handleRestore : undefined}
        />

      </div>
    </ChatProvider>
  )
}