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
import PlatformButtons from './PlatformButtons'
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
      <div className="flex-shrink-0 bg-gradient-to-r from-green-600 to-green-700 px-4 py-4 rounded-t-2xl shadow-lg">
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center border border-white/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border border-white" />
            </div>

            <div>
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                Dukan AI Assistant
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </h3>
              <p className="text-white/80 text-xs">
                Online • 24/7 Support
              </p>
            </div>
          </div>

          <div className="flex gap-1">
            <button onClick={handleNewChat} className="p-2 hover:bg-white/10 rounded">
              <MessageCircle className="w-4 h-4 text-white" />
            </button>
            <button onClick={onMinimize} className="p-2 hover:bg-white/10 rounded">
              <Minimize2 className="w-4 h-4 text-white" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 flex flex-col overflow-hidden bg-neutral-50 dark:bg-neutral-800/50">

        <div
          ref={messagesRef}
          className="flex-1 overflow-y-auto p-5 space-y-4"
        >
          <AnimatePresence>

            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}

            {/* ✅ TYPING INDICATOR */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2 items-end"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>

                <div className="bg-white dark:bg-neutral-700 px-3 py-2 rounded-xl flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></span>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* QUICK ACTIONS */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2">
            <QuickActions onActionClick={handleQuickAction} />
          </div>
        )}

        {/* PLATFORM BUTTONS */}
        <div className="px-4 pb-2">
          <PlatformButtons />
        </div>

      </div>

      {/* INPUT */}
      <div className="p-3 border-t bg-white dark:bg-neutral-900 flex gap-2">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about machines, pricing, support..."
          disabled={isProcessing}
          className="flex-1 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 focus:outline-none text-sm"
        />

        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isProcessing}
          className="px-3 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-center text-neutral-400 pb-2">
        Powered by AI
      </p>

    </div>
  )
}