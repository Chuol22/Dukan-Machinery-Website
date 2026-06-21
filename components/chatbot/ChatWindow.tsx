"use client";

// ChatWindow — chat panel with messages, quick actions, and input
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Minimize2,
  Send,
  Bot,
  Sparkles,
  MessageCircle,
  Zap,
  RotateCcw,
} from "lucide-react";

import ChatMessage from "./ChatMessage";
import QuickActions from "./QuickActions";
import { useChatbot } from "@/contexts/ChatbotContext";

interface ChatWindowProps {
  onClose: () => void;
  onMinimize: () => void;
}

export default function ChatWindow({ onClose, onMinimize }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, clearMessages, isProcessing } = useChatbot();

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isProcessing]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;
    await sendMessage(inputValue.trim());
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = async (action: string) => {
    await sendMessage(action);
  };

  const handleNewChat = () => {
    clearMessages();
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-green-950 via-green-900 to-green-950 px-4 py-3 border-b-2 border-orange-500 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-500/10 border border-orange-500/35 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="text-white font-black text-sm uppercase tracking-wider">
                DKM AI Assistant
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
                <p className="text-gray-300 text-[10px] font-bold uppercase tracking-widest">Active & Ready</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleNewChat}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              title="Clear chat"
            >
              <RotateCcw className="w-4 h-4 text-white/80 hover:text-white" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-4 h-4 text-white/80 hover:text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/50 dark:bg-gray-950/20 backdrop-blur-[2px]">
        <div
          ref={messagesRef}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <ChatMessage key={msg.id || i} message={msg} />
            ))}

            {/* Typing indicator */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="flex gap-3 items-end"
              >
                <div className="w-9 h-9 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                  <Bot className="w-5 h-5 text-orange-500" />
                </div>

                <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1.5 border border-gray-100 dark:border-gray-700">
                  <span className="w-2 h-2 bg-orange-500/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-orange-500/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-orange-500/60 rounded-full animate-bounce"></span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick actions — shown on new chat */}
        {messages.length <= 1 && (
          <div className="px-3 py-1.5 bg-gradient-to-t from-white via-white to-transparent dark:from-neutral-900 dark:via-neutral-900">
            <QuickActions onActionClick={handleQuickAction} />
          </div>
        )}
      </div>

      {/* Message input */}
      <div className="p-2 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex gap-3 items-center bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isProcessing}
            className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-sm md:text-base text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />

          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            className="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl disabled:opacity-50 disabled:grayscale transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
