'use client'

import { useState, useEffect } from 'react'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function useChatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // ✅ LOAD FROM LOCALSTORAGE
  useEffect(() => {
    const saved = localStorage.getItem('chat_messages')
    if (saved) {
      const parsed = JSON.parse(saved)
      setMessages(parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })))
    }
  }, [])

  // ✅ SAVE TO LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem('chat_messages', JSON.stringify(messages))
  }, [messages])

  // ✅ STREAMING FAKE AI (simulate real AI typing)
  const streamResponse = async (text: string) => {
    let current = ''

    for (let i = 0; i < text.length; i++) {
      current += text[i]

      setMessages(prev => {
        const last = prev[prev.length - 1]

        // update last assistant message
        if (last?.role === 'assistant') {
          const updated = [...prev]
          updated[updated.length - 1] = {
            ...last,
            content: current
          }
          return updated
        }

        return prev
      })

      await new Promise(r => setTimeout(r, 15)) // typing speed
    }
  }

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date()
    }

    const botMessage: Message = {
      id: `bot-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage, botMessage])
    setIsProcessing(true)

    // ⚠️ Replace this with real API later
    const fakeResponse = `Thanks for your message: "${text}". I can help you with machines, pricing, delivery, and more.`

    await streamResponse(fakeResponse)

    setIsProcessing(false)
  }

  const clearMessages = () => {
    setMessages([])
    localStorage.removeItem('chat_messages')
  }

  return {
    messages,
    sendMessage,
    clearMessages,
    isProcessing
  }
}