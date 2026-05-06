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
      if (paragraph.startsWith('- ')) {
        const items = paragraph.split('\n').filter(line => line.startsWith('- '))
        return (
          <ul key={idx} className="space-y-1 mt-2">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{item.substring(2)}</span>
              </li>
            ))}
          </ul>
        )
      }
      
      // Check for bold text
      const boldRegex = /\*\*(.*?)\*\*/g
      const withBold = paragraph.split(boldRegex).map((part, i) => {
        if (i % 2 === 1) {
          return <strong key={i} className="font-semibold text-primary">{part}</strong>
        }
        return part
      })
      
      return (
        <p key={idx} className={idx > 0 ? 'mt-2' : ''}>
          {withBold}
        </p>
      )
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      {/* Avatar */}
      {isBot && (
        <div className="flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg border-2 border-white/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
        </div>
      )}

      {/* Message Content */}
      <div className={`max-w-[85%] ${isBot ? 'order-2' : 'order-1'}`}>
        <div
          className={`relative px-5 py-3 rounded-2xl shadow-sm ${
            isBot
              ? 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-tl-none border border-neutral-200 dark:border-neutral-700'
              : 'bg-gradient-to-br from-primary to-primary-dark text-white rounded-tr-none'
          }`}
        >
          <div className="text-sm leading-relaxed break-words pr-2">
            {formatMessage(message.content)}
          </div>

          {/* Timestamp */}
          <div
            className={`text-xs mt-1 ${
              isBot ? 'text-gray-400' : 'text-white/70'
            }`}
          >
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>

          {/* Action Buttons for Bot Messages */}
          {isBot && (
            <div className="absolute -bottom-6 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                aria-label="Copy message"
              >
                {isCopied ? (
                  <CheckCheck className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3 text-gray-400" />
                )}
              </button>
              <button
                onClick={() => handleFeedback('like')}
                className={`p-1 rounded transition-colors ${
                  feedback === 'like'
                    ? 'text-primary'
                    : 'text-gray-400 hover:text-primary'
                }`}
                aria-label="Like"
              >
                <ThumbsUp className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleFeedback('dislike')}
                className={`p-1 rounded transition-colors ${
                  feedback === 'dislike'
                    ? 'text-red-500'
                    : 'text-gray-400 hover:text-red-500'
                }`}
                aria-label="Dislike"
              >
                <ThumbsDown className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User Avatar */}
      {!isBot && (
        <div className="flex-shrink-0 order-3">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-md">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </motion.div>
  )
}