// ChatbotContext.tsx — chat message state and AI reply flow
"use client";

import {
  createContext,
  useState,
  useCallback,
  ReactNode,
  useContext,
} from "react";
import { Message, ChatbotContextType } from "@/types/chatbot.types";
import { getAIResponse } from "@/utils/chatbot-ai";
import { normalizeMessagesForModel } from "@/utils/chat-message-validation";

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "👋 Hello! I'm Dukan's AI assistant. I can help you with:\n\n**Machine specifications** • **Pricing information** • **Custom orders** • **Technical support**\n\nWhat would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    let updatedMessages: Message[] = [];
    setMessages((prev) => {
      updatedMessages = [...prev, userMessage];
      const nextMessages = normalizeMessagesForModel(updatedMessages);
      return nextMessages as Message[];
    });
    
    setIsProcessing(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch (e) {
        // Ignore parsing error, we will fallback to generic error below
      }

      if (!response.ok) {
        if (data && data.reply) {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: data.reply,
            timestamp: new Date(),
          };
          setMessages((prev) => {
            const nextMessages = normalizeMessagesForModel([...prev, botMessage]);
            return nextMessages as Message[];
          });
          return;
        }
        throw new Error("Chatbot API response was not OK");
      }

      const reply = data?.reply || "Sorry, I couldn't process your request.";

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply,
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const nextMessages = normalizeMessagesForModel([...prev, botMessage]);
        return nextMessages as Message[];
      });
    } catch (error) {
      console.error("[ChatbotContext] API error:", error);
      
      // Create a helpful error message based on the error type
      let errorContent = "⚠️ **Connection Error**\n\n";
      
      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorContent += "Cannot reach the AI service. Please check:\n\n";
        errorContent += "• Your internet connection\n";
        errorContent += "• The development server is running\n";
        errorContent += "• No firewall blocking the request\n\n";
        errorContent += "**Try:** Refresh the page or contact support.";
      } else {
        errorContent += "I'm having trouble connecting to the AI service.\n\n";
        errorContent += "**What you can do:**\n";
        errorContent += "• Wait a moment and try again\n";
        errorContent += "• Browse our [Machines Catalog](/machines)\n";
        errorContent += "• [Contact our team](/contact) directly\n\n";
        errorContent += "We apologize for the inconvenience!";
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: errorContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: Date.now().toString(),
        role: "assistant",
        content: "✨ Chat cleared! How can I help you today?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  return (
    <ChatbotContext.Provider
      value={{ messages, sendMessage, clearMessages, isProcessing }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

// Hook for chat UI components
export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within a ChatProvider");
  }
  return context;
}

export { ChatbotContext };
