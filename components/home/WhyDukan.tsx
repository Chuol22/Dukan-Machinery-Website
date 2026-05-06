'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import {
  CheckCircle,
  Award,
  Clock,
  Shield,
  Globe,
  Headphones,
  TrendingUp,
  Zap,
  BarChart3,
  Truck,
  Settings,
  Users,
} from 'lucide-react'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'

const advantages = [
  {
    icon: CheckCircle,
    title: 'Capacity Accuracy',
    description: '±5% guaranteed capacity accuracy with real-world testing',
    stat: '97.5%',
    statLabel: 'Accuracy Rate',
    color: 'from-green-400 to-emerald-500',
  },
  {
    icon: Shield,
    title: 'Durable Materials',
    description: '304/316 stainless steel and HARDOX wear plates',
    stat: '15+',
    statLabel: 'Years Lifespan',
    color: 'from-blue-400 to-cyan-500',
  },
  {
    icon: Globe,
    title: 'International Standards',
    description: 'ISO, CE, GMP+ certified machinery',
    stat: '4+',
    statLabel: 'Countries Served',
    color: 'from-purple-400 to-pink-500',
  },
  {
    icon: Headphones,
    title: 'After-Sales Support',
    description: '24/7 technical support and spare parts availability',
    stat: '2hr',
    statLabel: 'Response Time',
    color: 'from-orange-400 to-red-500',
  },
]

const stats = [
  { value: 50, suffix: '+', label: 'Machines Installed', icon: Settings },
  { value: 96, suffix: '%', label: 'Customer Satisfaction', icon: Users },
  { value: 20, suffix: '%', label: 'Energy Efficiency', icon: Zap },
  { value: 30, suffix: '%', label: 'Less Downtime', icon: BarChart3 },
]

export default function WhyDukan() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} className="py-24 bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-secondary-dark font-black text-4xl md:text-5xl lg:text-6xl  mb-2 tracking-wider">
            Why Choose Us
          </h2>
          <div className="w-24 h-2 bg-primary mx-auto mb-4 rounded-full"></div>
          <span className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white mt-6 mb-12">
            Engineered for{' '}
            <span className="text-primary">Industrial Excellence</span>
          </span>
          <p className="text-lg text-neutral-600 mt-2 dark:text-neutral-400">
            Five years of engineering excellence combined with cutting-edge 
            technology to deliver the most reliable feed processing solutions.
          </p>
        </motion.div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {advantages.map((advantage, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700 transition-all duration-300" />
              <div className="relative p-6 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-primary/30 transition-all duration-300">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-primary text-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-4 animate-float`}>
                  <advantage.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Title */}
                <h3 className="text-xl lg:text-2xl font-black text-secondary-dark dark:text-white leading-tight mb-4">
                  {advantage.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                  {advantage.description}
                </p>

                {/* Stat */}
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="text-2xl font-bold text-primary">
                    {advantage.stat}
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    {advantage.statLabel}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-green-900 rounded-2xl p-8 md:p-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <stat.icon className="w-8 h-8 mx-auto mb-3 opacity-80" />
                <div className="text-3xl md:text-4xl font-bold mb-1">
                  <AnimatedCounter
                    end={stat.value}
                    suffix={stat.suffix}
                    duration={2}
                    startInView={isInView}
                  />
                </div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trust badge */}
        <div className="mt-16 text-center">
          <p className="text-secondary-dark text-sm uppercase font-black tracking-[0.2em]">
            Trusted by over{' '}
            <span className="text-primary">100+</span>{' '}
            Countrywide Enterprises
          </p>
        </div>
      </div>
    </section>
  )
}