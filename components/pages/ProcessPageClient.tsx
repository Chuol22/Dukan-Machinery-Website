'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { PenTool, Settings, Truck, Headphones, CheckCircle } from 'lucide-react'

const processSteps = [
  {
    step: '01',
    title: 'Consultation & Design',
    icon: PenTool,
    description: 'We analyze your specific requirements to create a custom blueprint tailored to your facility.',
    details: [
      'Site assessment & requirements analysis',
      'Custom CAD design & 3D modeling',
      'Blueprint approval & sign-off',
      'Material selection & sourcing',
    ],
  },
  {
    step: '02',
    title: 'Precision Manufacturing',
    icon: Settings,
    description: 'Using high-grade industrial materials and precision engineering to build your machinery.',
    details: [
      'CNC precision machining',
      'Robotic welding assembly',
      'Multi-stage quality control',
      'Surface treatment & finishing',
    ],
  },
  {
    step: '03',
    title: 'Delivery & Setup',
    icon: Truck,
    description: 'Safe transport followed by professional on-site installation and calibration.',
    details: [
      'Secure export-grade packaging',
      'Door-to-door global shipping',
      'Professional on-site installation',
      'Performance calibration & testing',
    ],
  },
  {
    step: '04',
    title: 'Training & Support',
    icon: Headphones,
    description: 'Comprehensive staff training and 24/7 technical support to ensure maximum uptime.',
    details: [
      'Comprehensive operator training',
      '24/7 remote technical support',
      'Spare parts availability',
      'Preventive maintenance programs',
    ],
  },
]

export default function ProcessPageClient() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section ref={ref} id="process" className="py-24 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-green-900 dark:text-white tracking-tight uppercase">
            Our Working <span className="text-orange-600">Process</span>
          </h2>
          <div className="w-20 h-2 bg-orange-400 mx-auto mt-4 rounded-full"></div>
          <p className="mt-6 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            From initial concept to final operation, we follow a rigorous workflow to ensure the highest quality standards for your industrial needs.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {processSteps.map((step, index) => (
              <motion.div key={step.step} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: index * 0.1, duration: 0.5 }} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} className="group">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <motion.div animate={{ y: hoveredIndex === index ? -8 : 0 }} transition={{ duration: 0.3 }} className="w-24 h-24 rounded-2xl bg-white dark:bg-gray-800 shadow-xl flex items-center justify-center border-b-4 border-primary group-hover:bg-green-700 transition-all duration-300 animate-float">
                      <step.icon className="w-10 h-10 text-green-700 group-hover:text-white transition-colors duration-300" />
                    </motion.div>
                    <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-green-900 text-white flex items-center justify-center font-black text-sm border-4 border-gray-100 dark:border-gray-900 shadow-lg animate-pulse-slow">
                      {step.step}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-3 uppercase">{step.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.description}</p>

                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: hoveredIndex === index ? 1 : 0, height: hoveredIndex === index ? 'auto' : 0 }} transition={{ duration: 0.3 }} className="overflow-hidden mt-4">
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-left">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {index < processSteps.length - 1 && (
                    <div className="lg:hidden mt-6 text-gray-300 dark:text-gray-700">
                      <svg className="w-5 h-5 mx-auto rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
