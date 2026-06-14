// chatbot.types.ts — chat message and context types
export interface Message {
  id: string;
  role: "user" | "assistant" | "tool";
  content: string;
  timestamp: Date;
  tool_call_id?: string;
  tool_calls?: Array<{
    id?: string;
    type?: string;
    function?: {
      name?: string;
      arguments?: string;
    };
  }>;
}

export interface ChatbotContextType {
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  isProcessing: boolean;
}

export interface KnowledgeBase {
  keywords: string[];
  response: string;
}
