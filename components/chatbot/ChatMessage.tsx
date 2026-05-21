'use client'

import { motion } from 'framer-motion'
import { Bot, User, CheckCheck, Copy, ThumbsUp, ThumbsDown } from 'lucide-react'
import { useState } from 'react'
import type { Message } from '@/types/chatbot.types'

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null)
  const isBot = message.role === 'assistant'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleFeedback = (type: 'like' | 'dislike') => {
    setFeedback(type)
    // Here you would send feedback to your analytics
    console.log(`Feedback for message: ${type}`)
  }

  // Format message content with markdown-like styling
  const formatMessage = (content: string) => {
    // Split into paragraphs
    const paragraphs = content.split('\n\n')
    
    return paragraphs.map((paragraph, idx) => {
      // Check if it's a list item
      if (paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('* ')) {
        const items = paragraph.split('\n').filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))
        return (
          <ul key={idx} className="space-y-2 mt-2 mb-2">
            {items.map((item, i) => {
              const itemContent = item.trim().substring(2)
              return (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-orange-500 mt-2" />
                  <span className="flex-1">{formatBoldText(itemContent)}</span>
                </li>
              )
            })}
          </ul>
        )
      }
      
      return (
        <p key={idx} className={idx > 0 ? 'mt-3' : ''}>
          {formatBoldText(paragraph)}
        </p>
      )
    })
  }

  const formatBoldText = (text: string) => {
    const boldRegex = /\*\*(.*?)\*\*/g
    return text.split(boldRegex).map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-bold text-inherit border-b border-orange-500/30">{part}</strong>
      }
      return part
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex gap-3 group ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      {/* Avatar */}
      {isBot && (
        <div className="flex-shrink-0 self-end mb-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center shadow-md border-2 border-white dark:border-gray-800">
            <Bot className="w-5 h-5 text-white" />
          </div>
        </div>
      )}

      {/* Message Content */}
      <div className={`max-w-[85%] flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
        <div
          className={`relative px-4 py-3 md:px-5 md:py-3.5 rounded-2xl shadow-sm transition-all ${
            isBot
              ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-200/50 dark:border-gray-700/50'
              : 'bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-br-none shadow-orange-500/20'
          }`}
        >
          <div className="text-[15px] md:text-base leading-relaxed break-words">
            {formatMessage(message.content)}
          </div>

          {/* Timestamp */}
          <div
            className={`text-[10px] mt-1.5 font-medium uppercase tracking-wider ${
              isBot ? 'text-gray-400' : 'text-white/60'
            }`}
          >
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>

        {/* Action Buttons for Bot Messages */}
        {isBot && (
          <div className="flex gap-1.5 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-1">
            <button
              onClick={handleCopy}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              title="Copy message"
            >
              {isCopied ? (
                <CheckCheck className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-gray-400" />
              )}
            </button>
            <div className="w-[1px] h-3 bg-gray-200 dark:bg-gray-700 self-center mx-0.5" />
            <button
              onClick={() => handleFeedback('like')}
              className={`p-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700 ${
                feedback === 'like'
                  ? 'text-orange-500 bg-orange-500/5'
                  : 'text-gray-400 hover:text-orange-500'
              }`}
              title="Helpful"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleFeedback('dislike')}
              className={`p-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700 ${
                feedback === 'dislike'
                  ? 'text-red-500 bg-red-500/5'
                  : 'text-gray-400 hover:text-red-500'
              }`}
              title="Not helpful"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {!isBot && (
        <div className="flex-shrink-0 self-end mb-1">
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shadow-md border-2 border-white dark:border-gray-800">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
    </motion.div>
  )
}