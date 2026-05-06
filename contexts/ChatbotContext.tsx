'use client'

import { createContext, useState, useCallback, ReactNode, useContext } from 'react'
import { Message, ChatbotContextType } from '@/types/chatbot.types'
import { getAIResponse } from '@/utils/chatbot-ai'

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hello! I'm Dukan's AI assistant. I can help you with:\n\n**Machine specifications** • **Pricing information** • **Custom orders** • **Technical support**\n\nWhat would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [isProcessing, setIsProcessing] = useState(false)

  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setIsProcessing(true)

    // Simulate AI thinking
    setTimeout(() => {
      const response = getAIResponse(content)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botMessage])
      setIsProcessing(false)
    }, 500)
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: "✨ Chat cleared! How can I help you today?",
        timestamp: new Date(),
      },
    ])
  }, [])

  return (
    <ChatbotContext.Provider value={{ messages, sendMessage, clearMessages, isProcessing }}>
      {children}
    </ChatbotContext.Provider>
  )
}

export function useChatbot() {
  const context = useContext(ChatbotContext)
  if (!context) {
    throw new Error('useChatbot must be used within a ChatProvider')
  }
  return context
}

export { ChatbotContext }