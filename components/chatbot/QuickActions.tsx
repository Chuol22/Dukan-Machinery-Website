'use client'

// QuickActions — preset question buttons for new chats
import { motion } from 'framer-motion'
import { 
  Package, 
  CreditCard, 
  Settings, 
  Headphones, 
  Truck,
  FileText,
  HelpCircle,
  TrendingUp
} from 'lucide-react'

interface QuickActionsProps {
  onActionClick: (action: string) => void
}

// Pre-filled queries sent on click
const quickActions = [
  {
    id: 'machines',
    label: 'Products',
    icon: Package,
    query: 'What machines do you offer?',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'pricing',
    label: 'Pricing',
    icon: CreditCard,
    query: 'What are your price ranges?',
    color: 'from-orange-400 to-orange-500'
  },
  {
    id: 'support',
    label: 'Support',
    icon: Headphones,
    query: 'How can I contact support?',
    color: 'from-green-500 to-green-600'
  },
]

export default function QuickActions({ onActionClick }: QuickActionsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
  }

  return (
    <div className="space-y-2">
      {/* Section label */}
      <div className="flex items-center gap-2">
        <HelpCircle className="w-4 h-4 text-orange-500" />
        <span className="text-xs font-black text-gray-500 dark:text-gray-400">
          Quick Questions
        </span>
      </div>
      
      {/* Action buttons */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex gap-2 justify-center"
      >
        {quickActions.map((action) => (
          <motion.button
            key={action.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onActionClick(action.query)}
            className="group relative overflow-hidden"
          >
            <div className="relative px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl hover:shadow-md transition-all duration-300">
              <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative flex items-center gap-2">
                <div className={`p-1.5 rounded-lg bg-gradient-to-r ${action.color} bg-opacity-10`}>
                  <action.icon className="w-3.5 h-3.5 text-orange-500" />
                </div>
                <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
                  {action.label}
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}
