'use client'

// ChatbotButton — floating toggle with pulse and unread badge
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Minimize2, ChevronUp } from 'lucide-react'

interface ChatbotButtonProps {
  onClick: () => void
  isOpen: boolean
  hasUnread?: boolean
  onMinimizedRestore?: () => void
}

export default function ChatbotButton({ 
  onClick, 
  isOpen, 
  hasUnread, 
  onMinimizedRestore 
}: ChatbotButtonProps) {
  // Button scale and spring animation
  const buttonVariants = {
    initial: { scale: 0 },
    animate: { scale: 1, transition: { type: 'spring' as const, stiffness: 260, damping: 20 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  }

  // Attention-grabbing pulse ring when closed
  const pulseVariants = {
    initial: { scale: 1, opacity: 0.7 },
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 0, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  }

  const unreadVariants = {
    initial: { scale: 0 },
    animate: { scale: 1 },
    exit: { scale: 0 },
  }

  return (
    <div className="relative">
      {/* Pulse ring */}
      {!isOpen && (
        <motion.div
          variants={pulseVariants}
          initial="initial"
          animate="animate"
          className="absolute inset-0 rounded-full bg-green-500"
          style={{ width: '100%', height: '100%' }}
        />
      )}

      {/* Unread badge */}
      <AnimatePresence>
        {hasUnread && !isOpen && (
          <motion.div
            variants={unreadVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center z-10"
          >
            <span className="text-white text-xs font-black">!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.button
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        onClick={onClick}
        className={`relative w-12 h-12 rounded-full shadow-md flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-gray-600 dark:bg-gray-400 hover:bg-gray-600 dark:hover:bg-gray-400'
            : 'bg-linear-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
        }`}
        aria-label="Chat with AI assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1"
            >
              {onMinimizedRestore ? (
                <ChevronUp className="w-5 h-5 text-white" />
              ) : (
                <X className="w-5 h-5 text-white" />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Hover tooltip */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 whitespace-nowrap bg-gray-800 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Ask me anything!
          </span>
        </motion.div>
      )}
    </div>
  )
}
