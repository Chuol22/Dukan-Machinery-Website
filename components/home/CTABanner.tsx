'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  Clock,
  CheckCircle,
} from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'

const benefits = [
  'Free technical consultation',
  'Custom solution design',
  '24/7 expert support',
  'Competitive pricing',
  'On-site installation',
  'Training included'
]

export default function CTABanner() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
  }

  return (
    <section ref={ref} className="relative py-16 sm:py-20 md:py-24 overflow-hidden bg-white dark:bg-neutral-900">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-white dark:bg-neutral-900">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-48 sm:w-64 md:w-72 h-48 sm:h-64 md:h-72 bg-orange rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-56 sm:w-72 md:w-96 h-56 sm:h-72 md:h-96 bg-secondary rounded-full filter blur-3xl animate-pulse delay-1000" />
        </div>
        
        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-5xl mx-auto"
        >
          {/* Main Heading */}
          <motion.h2 
            variants={itemVariants}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-green-800 dark:text-white text-center mb-4 sm:mb-6"
          >
            Ready to Transform Your
            <span className="text-orange-600 block mt-1 sm:mt-2">Feed Production?</span>
          </motion.h2>

           
          {/* Benefits Grid */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-10 md:mb-12"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center justify-center gap-1.5 sm:gap-2 bg-white dark:bg-neutral-800 backdrop-blur-sm border border-gray-200 dark:border-neutral-700 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2"
              >
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 flex-shrink-0" />
                <span className="text-[10px] sm:text-xs md:text-sm text-green-700 dark:text-gray-200 font-black">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-10 md:mb-12"
          >
            <Link href="/order">
              <Button 
                size="lg" 
                className="bg-orange-400 hover:bg-orange-300 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group animate-pulse-slow animate-shake text-xs sm:text-sm md:text-base"
              >
                Request Free Consultation
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-orange-600 text-green-600 hover:bg-orange-300 backdrop-blur-sm text-xs sm:text-sm md:text-base"
              >
                Contact Sales
              </Button>
            </Link>
          </motion.div>

          {/* Response Time Guarantee */}
          <motion.div 
            variants={itemVariants}
            className="text-center mt-6 sm:mt-8"
          >
            <div className="inline-flex items-center gap-1.5 sm:gap-2 text-orange-600 text-xs sm:text-sm">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Response within 2 hours • 24/7 Support Available</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </section>
  )
}