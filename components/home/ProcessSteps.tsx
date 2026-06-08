'use client'

// Ordering process — 4 steps with hover-to-reveal detail lists
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'

import { 
  PenTool, 
  Settings, 
  Truck, 
  Headphones,
  CheckCircle
} from 'lucide-react'

const icons = [PenTool, Settings, Truck, Headphones]

export default function ProcessSteps() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Step content — expands on hover to show bullet details
  const steps = [
    {
      step: '01',
      title: 'Consultation',
      description: 'Discuss your requirements with our experts',
      details: ['Needs assessment', 'Technical consultation', 'Solution proposal']
    },
    {
      step: '02',
      title: 'Design',
      description: 'Custom machinery design and engineering',
      details: ['3D modeling', 'Engineering specs', 'Material selection']
    },
    {
      step: '03',
      title: 'Manufacturing',
      description: 'Precision manufacturing and quality testing',
      details: ['Quality control', 'Assembly', 'Performance testing']
    },
    {
      step: '04',
      title: 'Delivery',
      description: 'Installation and ongoing support',
      details: ['On-site installation', 'Training provided', '24/7 support']
    }
  ]

  // Attach Lucide icon to each step
  const processSteps = steps.map((step, index) => ({
    ...step,
    icon: icons[index]
  }))

  return (
    <section 
      ref={ref} 
      id="process"
      className="py-16 sm:py-20 md:py-24 bg-green-50 dark:bg-green-900/50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-green-900 dark:text-white tracking-tight uppercase">
            Our Process <span className='text-orange-600'>How We Work</span>
          </h2>
          <div className="w-16 sm:w-20 h-2 bg-orange-400 mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 sm:mt-6 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            From consultation to delivery, we ensure a seamless experience
          </p>
        </motion.div>

        {/* Process Steps Grid */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Icon Circle */}
                  <div className="relative mb-4 sm:mb-6">
                    <motion.div
                      animate={{
                        y: hoveredIndex === index ? -8 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="w-16 h-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-xl sm:rounded-2xl bg-white dark:bg-gray-800 shadow-xl flex items-center justify-center border-b-4 border-green-700 group-hover:bg-green-700 transition-all duration-300 animate-float"
                    >
                      <step.icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-green-700 group-hover:text-white transition-colors duration-300" />
                    </motion.div>
                    
                    {/* Step Number Badge */}
                    <div className="absolute -top-2 sm:-top-3 md:-top-4 -right-2 sm:-right-3 md:-right-4 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-xs sm:text-sm border-3 sm:border-4 border-gray-50 dark:border-gray-900 shadow-lg animate-pulse-slow">
                      {step.step}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg md:text-xl font-black text-orange-600 dark:text-orange-400 mb-2 sm:mb-3 uppercase">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Details - Appear on Hover */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: hoveredIndex === index ? 1 : 0,
                      height: hoveredIndex === index ? 'auto' : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-3 sm:mt-4"
                  >
                    <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="space-y-1.5 sm:space-y-2">
                        {step.details.map((detail, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 sm:gap-2 text-left">
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                              {detail}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Mobile Connector */}
                  {index < processSteps.length - 1 && (
                    <div className="lg:hidden mt-4 sm:mt-6 text-gray-300 dark:text-gray-700">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 mx-auto rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}