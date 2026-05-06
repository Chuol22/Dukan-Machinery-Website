export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatbotContextType {
  messages: Message[]
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  isProcessing: boolean
}

export interface KnowledgeBase {
  keywords: string[]
  response: string
}