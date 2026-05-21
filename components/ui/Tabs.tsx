'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export interface TabItem {
  id: string
  label: string
  content: React.ReactNode
  icon?: React.ReactNode
}

export interface TabsProps {
  tabs: TabItem[]
  defaultTab?: string
  variant?: 'default' | 'pills' | 'underline' | 'buttons'
  onChange?: (tabId: string) => void
}

export default function Tabs({ 
  tabs, 
  defaultTab, 
  variant = 'default',
  onChange 
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  const variants = {
    default: {
      container: 'border-b border-gray-200 dark:border-gray-700',
      tab: (isActive: boolean) => `px-4 py-2 text-sm font-medium transition-all ${
        isActive 
          ? 'text-primary border-b-2 border-primary -mb-px' 
          : 'text-gray-600 dark:text-gray-400 hover:text-primary hover:border-b-2 hover:border-primary/50'
      }`,
    },
    pills: {
      container: 'flex gap-2',
      tab: (isActive: boolean) => `px-4 py-2 text-sm font-medium rounded-lg transition-all ${
        isActive 
          ? 'bg-primary text-white' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`,
    },
    underline: {
      container: 'flex gap-6 border-b border-gray-200 dark:border-gray-700',
      tab: (isActive: boolean) => `pb-2 text-sm font-medium transition-all relative ${
        isActive 
          ? 'text-primary' 
          : 'text-gray-600 dark:text-gray-400 hover:text-primary'
      }`,
    },
    buttons: {
      container: 'flex gap-2',
      tab: (isActive: boolean) => `px-4 py-2 text-sm font-medium rounded-lg transition-all border ${
        isActive 
          ? 'bg-primary text-white border-primary' 
          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`,
    },
  }

  const currentVariant = variants[variant]
  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content

  return (
    <div>
      {/* Tab Headers */}
      <div className={currentVariant.container}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={currentVariant.tab(activeTab === tab.id)}
          >
            <div className="flex items-center gap-2">
              {tab.icon}
              {tab.label}
              {variant === 'underline' && activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </div>
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-6"
      >
        {activeTabContent}
      </motion.div>
    </div>
  )
}