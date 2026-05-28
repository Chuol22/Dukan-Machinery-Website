'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'

import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

export default function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const testimonialsTranslations = [
    {
      name: 'Henok',
      initials: 'H',
      role: 'Factory Owner',
      content: 'The Poultry Feed Machine we installed has exceeded our expectations. The pellet quality is consistent, and the energy efficiency is remarkable.',
      rating: 5,
      location: 'Adam, Oromia, Ethiopia'
    },
    {
      name: 'Hayu Samuel',
      initials: 'S',
      role: 'Operations Manager',
      content: 'Dukan Machinery provided exceptional support during the setup of our cattle feed line. Their technical team is truly professional and knowledgeable.',
      rating: 5,
      location: 'Addis Ababa, Ethiopia'
    },
    {
      name: 'Meti solomon',
      initials: 'M',
      role: 'Agri-Industrial Consultant',
      content: "Finding reliable custom industrial machines is tough, but Dukan's engineering standards are top-tier. They understand the nuances of feed processing.",
      rating: 5,
      location: 'Harar, Ethiopia'
    },
    {
      name: 'Chala Berhan',
      initials: 'T',
      role: 'Production Director',
      content: 'The hammer mill we purchased has been running continuously for 18 months with zero downtime. Outstanding build quality.',
      rating: 5,
      location: 'Jimma, Ethiopia'
    }
  ]

  const testimonials = testimonialsTranslations

  return (
    <section ref={ref} className="py-16 sm:py-20 md:py-24 bg-green-200 dark:bg-gray-900">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <h2 className="text-green-900 dark:text-green-400 font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-wider">
            Client Testimonials
          </h2>
          <div className="w-16 sm:w-20 h-2 bg-orange-600 mx-auto mt-4 rounded-full"></div>
          <h2 className="text-sm sm:text-base md:text-xl lg:text-2xl font-black text-green-800 dark:text-gray-100 mt-4 mb-4 sm:mb-6">
            What Our{' '}
            <span className="text-orange-600 dark:text-orange-400">Clients Say</span>
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="group relative bg-green-200 dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-200"
            >
              {/* Quote Icon Background */}
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-orange-600" />
              </div>

              {/* Rating Stars */}
              <div className="flex gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 sm:w-5 sm:h-5 fill-orange-500 text-orange-500"
                  />
                ))}
              </div>

              {/* Testimonial Content */}
              <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 relative z-10">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-md">
                  {testimonial.initials}
                </div>
                <div>
                  <h4 className="font-black text-gray-900 dark:text-white text-sm sm:text-base">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500">{testimonial.role}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] sm:text-xs text-gray-400">
                      {testimonial.location}
                    </span>
                  </div>
                </div>
              </div>

             
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-orange-600"
        >
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 dark:bg-gray-800 shadow-sm rounded-full">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300">4.7/5 Average Rating</span>
            </div>
            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 dark:bg-gray-800 shadow-sm rounded-full">
              <span className="text-orange-600 font-black text-sm sm:text-base md:text-lg">100+</span>
              <span className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300">Happy Clients</span>
            </div>
            
          </div>
        </motion.div>
      </div>
    </section>
  )
}