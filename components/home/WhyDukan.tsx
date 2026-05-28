'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  CheckCircle,
  Shield,
  Globe,
  Headphones,
  Zap,
  BarChart3,
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
  },
  {
    icon: Shield,
    title: 'Durable Materials',
    description: '304/316 stainless steel and HARDOX wear plates',
    stat: '15+',
    statLabel: 'Years Lifespan',
  },
  {
    icon: Globe,
    title: 'International Standards',
    description: 'ISO, CE, GMP+ certified machinery',
    stat: '4+',
    statLabel: 'Countries Served',
  },
  {
    icon: Headphones,
    title: 'After-Sales Support',
    description: '24/7 technical support and spare parts availability',
    stat: '2hr',
    statLabel: 'Response Time',
  },
]

export default function WhyDukan() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const advantages = [
    {
      title: 'Capacity Accuracy',
      description: '±5% guaranteed capacity accuracy with real-world testing',
      stat: '97.5%',
      statLabel: 'Accuracy Rate',
    },
    {
      title: 'Durable Materials',
      description: '304/316 stainless steel and HARDOX wear plates',
      stat: '15+',
      statLabel: 'Years Lifespan',
    },
    {
      title: 'International Standards',
      description: 'ISO, CE, GMP+ certified machinery',
      stat: '4+',
      statLabel: 'Countries Served',
    },
    {
      title: 'After-Sales Support',
      description: '24/7 technical support and spare parts availability',
      stat: '2hr',
      statLabel: 'Response Time',
    },
  ]

  const statsTranslations = {
    machinesInstalled: 'Machines Installed',
    customerSatisfaction: 'Customer Satisfaction',
    energyEfficiency: 'Energy Efficiency',
    lessDowntime: 'Less Downtime',
  }

  const stats = [
    { value: 50, suffix: '+', label: statsTranslations.machinesInstalled, icon: Settings },
    { value: 96, suffix: '%', label: statsTranslations.customerSatisfaction, icon: Users },
    { value: 20, suffix: '%', label: statsTranslations.energyEfficiency, icon: Zap },
    { value: 30, suffix: '%', label: statsTranslations.lessDowntime, icon: BarChart3 },
  ]

  return (
    <section ref={ref} className="py-16 sm:py-20 md:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <h2 className="text-green-800 dark:text-green-400 font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-2 tracking-wider">
            Why Choose DUKAN <span className="text-orange-600">Machinery</span>
          </h2>
          <div className="w-16 sm:w-20 md:w-24 h-2 bg-orange-600 mx-auto mb-4 rounded-full" />
          <span className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-8 sm:mb-12">
            Excellence in Industrial Engineering
          </span>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-2 dark:text-gray-400">
            We deliver precision machinery that transforms your operations
          </p>
        </motion.div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16 md:mb-20">
          {advantages.map((advantage, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300" />
              <div className="relative p-4 sm:p-6 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-orange-400/30 transition-all duration-300 cursor-pointer">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-orange-300 dark:bg-gray-700 flex items-center justify-center mb-3 sm:mb-4 animate-float">
                  {index === 0 && <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />}
                  {index === 1 && <Shield className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />}
                  {index === 2 && <Globe className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />}
                  {index === 3 && <Headphones className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />}
                </div>
                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-green-800 dark:text-green-400 leading-tight mb-3 sm:mb-4">
                  {advantage.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-200 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                  {advantage.description}
                </p>
                <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xl sm:text-2xl font-black text-primary">{advantage.stat}</div>
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{advantage.statLabel}</div>
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
          className="bg-green-900 dark:bg-gray-800 dark:border dark:border-green-800/50 rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mx-auto mb-2 sm:mb-3 opacity-80" />
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">
                  <AnimatedCounter
                    end={stat.value}
                    suffix={stat.suffix}
                    duration={2}
                    startInView={isInView}
                  />
                </div>
                <div className="text-xs sm:text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trust badge */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-green-800 dark:text-green-400 text-xs sm:text-sm uppercase font-black tracking-widest sm:tracking-[0.2em]">
            Trusted by{' '}
            <span className="text-orange-600 dark:text-orange-400">100+</span>{' '}
            businesses worldwide
          </p>
        </div>

      </div>
    </section>
  )
}
