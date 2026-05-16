'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Minimize2,
  Send,
  Bot,
  Sparkles,
  MessageCircle,
  Zap
} from 'lucide-react'

import ChatMessage from './ChatMessage'
import QuickActions from './QuickActions'
import { useChatbot } from '@/contexts/ChatbotContext'

interface ChatWindowProps {
  onClose: () => void
  onMinimize: () => void
}

export default function ChatWindow({ onClose, onMinimize }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('')
  const messagesRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, clearMessages, isProcessing } = useChatbot()

  // ✅ Smooth auto-scroll
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages, isProcessing])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return
    await sendMessage(inputValue.trim())
    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleQuickAction = async (action: string) => {
    await sendMessage(action)
  }

  const handleNewChat = () => {
    clearMessages()
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900">

      {/* HEADER */}
      <div className="flex-shrink-0 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 px-4 py-3 rounded-t-2xl shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Dukan AI Assistant</h3>
              <div className="flex items-center gap-1">
                <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                <p className="text-white/80 text-xs">Online</p>
              </div>
            </div>
          </div>

          <div className="flex gap-1">
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-white/15 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 flex flex-col overflow-hidden bg-neutral-50/50 dark:bg-neutral-950/20 backdrop-blur-[2px]">

        <div
          ref={messagesRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800"
        >
          <AnimatePresence initial={false}>

            {messages.map((msg, i) => (
              <ChatMessage key={msg.id || i} message={msg} />
            ))}

            {/* ✅ TYPING INDICATOR */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="flex gap-3 items-end"
              >
                <div className="w-9 h-9 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                  <Bot className="w-5 h-5 text-orange-500" />
                </div>

                <div className="bg-white dark:bg-neutral-800 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1.5 border border-neutral-100 dark:border-neutral-700">
                  <span className="w-2 h-2 bg-orange-500/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-orange-500/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-orange-500/60 rounded-full animate-bounce"></span>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* QUICK ACTIONS */}
        {messages.length <= 1 && (
          <div className="px-4 py-2 bg-gradient-to-t from-white via-white to-transparent dark:from-neutral-900 dark:via-neutral-900">
            <QuickActions onActionClick={handleQuickAction} />
          </div>
        )}

      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="flex gap-3 items-center bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-1 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isProcessing}
            className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-sm md:text-base text-neutral-700 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
          />

          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            className="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl disabled:opacity-50 disabled:grayscale transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

    </div>
  )
}