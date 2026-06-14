"use client";

// ChatbotWidget — floating chat panel with open/minimize state
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatbotButton from "./ChatbotButton";
import ChatWindow from "./ChatWindow";
import { ChatProvider } from "@/contexts/ChatbotContext";

interface ChatbotWidgetProps {
  position?: "bottom-right" | "bottom-left";
}

export default function ChatbotWidget({
  position = "bottom-right",
}: ChatbotWidgetProps) {
  // Panel visibility and unread indicator state
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Show unread badge after 30s when chat is closed
  useEffect(() => {
    if (!isOpen && !isMinimized) {
      timerRef.current = setTimeout(() => setHasUnread(true), 30000);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isOpen, isMinimized]);

  // Toggle open/closed and clear unread
  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
    setIsMinimized(false);
    setHasUnread(false);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
    setHasUnread(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setIsOpen(false);
    setHasUnread(false);
  };

  const handleRestore = () => {
    setIsMinimized(false);
    setIsOpen(true);
    setHasUnread(false);
  };

  const isRight = position === "bottom-right";

  return (
    <ChatProvider>
      <div
        className={`fixed z-[9999] bottom-6 ${isRight ? "right-6" : "left-6"}`}
      >
        {/* Chat window */}
        <AnimatePresence>
          {isOpen && !isMinimized && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={`
                absolute bottom-16
                ${isRight ? "right-0" : "left-0"}
                w-[90vw] sm:w-95 md:w-100
                h-125 max-h-[70vh]
                bg-white dark:bg-gray-900
                rounded-xl shadow-xl overflow-hidden
                border border-gray-200 dark:border-gray-700
              `}
            >
              <ChatWindow onClose={handleClose} onMinimize={handleMinimize} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle button */}
        <ChatbotButton
          onClick={handleToggle}
          isOpen={isOpen || isMinimized}
          hasUnread={hasUnread}
          onMinimizedRestore={isMinimized ? handleRestore : undefined}
        />
      </div>
    </ChatProvider>
  );
}
