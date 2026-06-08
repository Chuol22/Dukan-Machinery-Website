'use client'

// Fixed social icon stack — WhatsApp, Telegram, TikTok, email links
import Link from 'next/link'
import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, Music2, Mail, Share2 } from 'lucide-react'

import { socialLinks, type SocialPlatform } from '@/config/socialLinks'

type FloatingSocialProps = {
  position?: 'bottom-right' | 'bottom-left'
}

const PLATFORM_ORDER: SocialPlatform[] = ['whatsapp', 'telegram', 'tiktok', 'email']

export default function FloatingSocial({ position = 'bottom-right' }: FloatingSocialProps) {
  const isRight = position === 'bottom-right'

  const platforms = useMemo(() => {
    return PLATFORM_ORDER.map((id) => ({
      id,
      label: socialLinks[id].label,
      href: socialLinks[id].href,
    }))
  }, [])

  const platformStyle = (id: SocialPlatform) => {
    switch (id) {
      case 'whatsapp':
        return {
          ring: 'focus-visible:ring-[#25D366]',
          border: 'border-[#25D366]/40',
          icon: 'text-[#25D366]',
        }
      case 'telegram':
        return {
          ring: 'focus-visible:ring-[#0088cc]',
          border: 'border-[#0088cc]/40',
          icon: 'text-[#0088cc]',
        }
      case 'tiktok':
        return {
          ring: 'focus-visible:ring-[#111111]',
          border: 'border-[#111111]/40',
          icon: 'text-[#111111]',
        }
      case 'email':
        return {
          ring: 'focus-visible:ring-[#60A5FA]',
          border: 'border-[#60A5FA]/40',
          icon: 'text-[#fa6077]',
        }
    }
  }

  const platformIcon = (id: SocialPlatform) => {
    switch (id) {
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4" aria-hidden="true" />
      case 'telegram':
        return <Send className="w-4 h-4" aria-hidden="true" />
      case 'tiktok':
        return <Music2 className="w-4 h-4" aria-hidden="true" />
      case 'email':
        return <Mail className="w-4 h-4" aria-hidden="true" />

    }
  }

  return (
    <div className={`fixed z-9998 bottom-6 ${isRight ? 'right-6' : 'left-6'} `}>
      <AnimatePresence initial={false}>
        {/* expanded panel placeholder (intentionally empty) */}
      </AnimatePresence>

      <div className="flex flex-col items-center gap-2">
        <span className="sr-only">Social media links</span>

        <div className={`flex flex-col gap-2 ${isRight ? 'items-end' : 'items-start'}`}>
          {platforms.map((p, index) => {
            const delay = index * 60
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2, delay: delay / 1000 }}
                className="origin-bottom"
                style={{}}
              >
                <Link
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={p.label}
                  className={
                    'inline-flex items-center justify-center w-8 h-8 rounded-full shadow-md transition-all duration-300 ' +
                    'bg-white/10 hover:bg-white/60 border ' +
                    platformStyle(p.id).border +
                    ' ' +
                    'focus:outline-none focus-visible:ring-2 ' +
                    platformStyle(p.id).ring +
                    ' focus-visible:ring-offset-2 focus-visible:ring-offset-transparent animate-pulse-slow animate-float animate-fade-up'
                  }
                >
                  <span className="absolute opacity-0" aria-hidden="true" />
                  <span className={platformStyle(p.id).icon}>{platformIcon(p.id)}</span>
                  <span className="sr-only">{p.label}</span>
                </Link>
              </motion.div>
            )
          })}

          <div className="mt-1">
            <button
              type="button"
              aria-label="More social links"
              className={
                'inline-flex items-center justify-center w-12 h-12 rounded-full shadow-lg ' +
                'bg-linear-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 ' +
                'transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent '
              }
              onClick={() => {
                // icons are already visible; intentionally no-op
              }}
            >
              <Share2 className="w-5 h-5 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>

      </div>

      <style jsx global>{`

        @media (prefers-reduced-motion: reduce) {

          .motion-reduce,
          * {
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </div>
  )
}
