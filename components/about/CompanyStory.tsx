'use client'

import { motion } from 'framer-motion'

export default function CompanyStory() {
  return (
    <section className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-6 sm:p-10 shadow-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">
          Company <span className="text-orange-600">Story</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Dukan Machinery PLC was founded with a vision to transform Ethiopia&apos;s agricultural processing sector.
              What began as a small workshop has grown into a trusted name in industrial machinery, serving clients
              across East Africa.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Today, we design and manufacture a wide range of machines — from feed pellet lines to custom industrial
              solutions — helping farmers and businesses increase productivity and reduce waste.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <img
                src="/images/testimonials/Factory photo.jpg"
                alt="Factory"
                className="h-40 w-full object-cover transition-all duration-500 hover:scale-110"
              />
            </div>
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <img
                src="/images/testimonials/Factory photos 1.jpg"
                alt="Factory"
                className="h-40 w-full object-cover transition-all duration-500 hover:scale-110"
              />
            </div>
            <div className="overflow-hidden rounded-2xl shadow-lg md:col-span-2">
              <img
                src="/images/testimonials/Company Story.jpg"
                alt="Inside Our Factory"
                className="h-48 w-full object-cover transition-all duration-500 hover:scale-110" 
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

