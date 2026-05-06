'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  ArrowRight, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock,
  CheckCircle,
  Sparkles
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

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-green-800">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full filter blur-3xl animate-pulse delay-1000" />
        </div>
        
        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-5xl mx-auto"
        >
          {/* Main Heading */}
          <motion.h2 
            variants={itemVariants}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white text-center mb-6"
          >
            Ready to Transform Your
            <span className="text-primary block mt-2">Feed Production?</span>
          </motion.h2>

           
          {/* Benefits Grid */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center justify-center gap-2 bg-white/50 backdrop-blur-sm rounded-lg px-3 py-2"
              >
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-700 font-black">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link href="/order">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary-dark text-white shadow-xl hover:shadow-2xl transition-all duration-300 group animate-pulse-slow animate-shake"
              >
                Request Free Consultation
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 backdrop-blur-sm"
              >
                Contact Sales
              </Button>
            </Link>
          </motion.div>

          {/* Response Time Guarantee */}
          <motion.div 
            variants={itemVariants}
            className="text-center mt-8"
          >
            <div className="inline-flex items-center gap-2 text-white text-sm">
              <Clock className="w-4 h-4" />
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