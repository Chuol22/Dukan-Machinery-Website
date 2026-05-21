'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, Music2, Camera, Share2 } from 'lucide-react'


import { socialLinks, type SocialPlatform } from '@/config/socialLinks'

type FloatingSocialProps = {
  position?: 'bottom-right' | 'bottom-left'
}

const PLATFORM_ORDER: SocialPlatform[] = ['whatsapp', 'telegram', 'tiktok', 'instagram']

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
      case 'instagram':
        return {
          ring: 'focus-visible:ring-[#E1306C]',
          border: 'border-[#E1306C]/40',
          icon: 'text-[#E1306C]',
        }
    }
  }

  const platformIcon = (id: SocialPlatform) => {
    // NOTE: lucide-react may not include brand-specific instagram icon in your version.
    // For now we keep a camera-like icon; if you want a perfect Instagram glyph,
    // we can swap to an SVG later.
    switch (id) {
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4" aria-hidden="true" />
      case 'telegram':
        return <Send className="w-4 h-4" aria-hidden="true" />
      case 'tiktok':
        return <Music2 className="w-4 h-4" aria-hidden="true" />
      case 'instagram':
        return <Camera className="w-4 h-4" aria-hidden="true" />
    }
  }

  return (
    <div className={`fixed z-9998 bottom-6 ${isRight ? 'right-6' : 'left-6'} `}>
      <AnimatePresence initial={false}>
        {/*
          Chatbot-like expanded panel.
          Default state is collapsed to keep the UI clean.
          (We avoid state to keep logic minimal and focus on accessibility.)
        */}
      </AnimatePresence>

      <div className="flex flex-col items-center gap-2">
        {/* Accessible label for screen readers */}
        <span className="sr-only">Social media links</span>

        {/* Always-visible compact group (better accessibility than hover-only) */}
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
                    platformStyle(p.id).border + ' ' +
                    'focus:outline-none focus-visible:ring-2 ' +
                    platformStyle(p.id).ring + ' focus-visible:ring-offset-2 focus-visible:ring-offset-transparent animate-pulse-slow animate-float animate-fade-in-up'
                  }
                >
                  {/* colored backplate */}
                  <span className="absolute opacity-0" aria-hidden="true" />
                  <span className={platformStyle(p.id).icon}>
                    {platformIcon(p.id)}
                  </span>
                </Link>
              </motion.div>
            )
          })}

          {/* Main floating hint button (optional but keeps chatbot-icon feel) */}
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
                // No-op: icons are already visible.
                // Keep button for consistent “chatbot icon” placement/affordance.
              }}
            >
              <Share2 className="w-5 h-5 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Respect reduced motion */}
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

