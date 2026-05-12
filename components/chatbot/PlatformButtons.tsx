'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Send, Users, Phone } from 'lucide-react'

interface PlatformButtonsProps {
  onWhatsAppClick?: () => void
  onTelegramClick?: () => void
  onEmailClick?: () => void
  onPhoneClick?: () => void
}

export default function PlatformButtons({ 
  onWhatsAppClick,
  onTelegramClick,
  onEmailClick,
  onPhoneClick
}: PlatformButtonsProps) {
  // Dukan Machinery contact information
  const handleWhatsApp = () => {
    const phoneNumber = '251960779507' // Dukan Machinery WhatsApp
    const message = encodeURIComponent("Hello! I'm interested in Dukan Machinery products. Can you help me?")
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
    onWhatsAppClick?.()
  }

  const handleTelegram = () => {
    const username = 'DukanmachineryEt' // Dukan Machinery Telegram
    window.open(`https://t.me/${username}`, '_blank')
    onTelegramClick?.()
  }

   

  const platforms = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366]',
      hoverColor: 'hover:bg-[#128C7E]',
      onClick: handleWhatsApp,
      description: 'Chat instantly'
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: Send,
      color: 'bg-[#0088cc]',
      hoverColor: 'hover:bg-[#006699]',
      onClick: handleTelegram,
      description: 'Join our channel'
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      <div className="flex items-center gap-2">
        <div className="w-1 h-2 bg-secondary rounded-full" />
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
          Connect with us on
        </span>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-2"
      >
        {platforms.map((platform) => (
          <motion.button
            key={platform.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={platform.onClick}
            className={`group relative overflow-hidden rounded-xl ${platform.color} ${platform.hoverColor} transition-all duration-300 shadow-md hover:shadow-lg`}
          >
            <div className="relative px-3 py-2 flex items-center gap-2">
              <motion.div
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                initial={false}
                whileHover={{ scale: 1.5, opacity: 0.2 }}
                transition={{ duration: 0.3 }}
              />
              
              <div className="relative">
                <platform.icon className="w-4 h-4 text-white" />
              </div>
              
              <div className="relative text-left">
                <div className="text-xs font-semibold text-white">
                  {platform.name}
                </div>
                <div className="text-[10px] text-white/80">
                  {platform.description}
                </div>
              </div>

              {(platform.id === 'whatsapp' || platform.id === 'telegram') && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"
                >
                  <div className="absolute inset-0 rounded-full bg-green-400 animate-ping" />
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </motion.div>

      <div className="flex items-center justify-center gap-1 pt-1">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
        <span className="text-[10px] text-neutral-400">
          Online • Usually replies in minutes
        </span>
      </div>
    </div>
  )
}