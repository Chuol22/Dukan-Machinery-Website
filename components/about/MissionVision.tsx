'use client'

import { motion } from 'framer-motion'
import { Eye, Target } from 'lucide-react'

export default function MissionVision() {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-10 shadow-sm">
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Mission Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="bg-gray-50 dark:bg-gray-900/20 rounded-2xl p-8 hover:shadow-lg transition-shadow group"
        >
          {/* Animated Icon Container */}
          <motion.div 
            className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-6 animate-slide-up-fade"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, -5, 5, -5, 0],
              }}
              transition={{ 
                duration: 0.5,
                delay: 0.2,
                ease: "easeInOut"
              }}
            >
              <Target className="text-orange-600 dark:text-orange-400" size={28} />
            </motion.div>
          </motion.div>
          
          <h3 className="text-2xl font-black text-green-900 dark:text-white mb-4">Our Mission</h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            To empower farmers and agro-processors with reliable, high-performance machinery that increases efficiency,
            reduces post-harvest losses, and supports sustainable agricultural growth across Africa.
          </p>
        </motion.div>

        {/* Vision Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gray-50 dark:bg-gray-900/20 rounded-2xl p-8 hover:shadow-lg transition-shadow group"
        >
          {/* Animated Icon Container */}
          <motion.div 
            className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-6"
            whileHover={{ scale: 1.1, rotate: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 1,
                delay: 0.3,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut"
              }}
            >
              <Eye className="text-orange-600 dark:text-orange-400" size={28} />
            </motion.div>
          </motion.div>
          
          <h3 className="text-2xl font-black text-orange-900 dark:text-white mb-4">Our Vision</h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            To become the leading manufacturer of agricultural processing equipment in East Africa, recognized for
            innovation, quality, and exceptional customer support.
          </p>
        </motion.div>
      </div>
    </section>
  )
}