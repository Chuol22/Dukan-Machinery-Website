'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star, Quote } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
  {
    name: 'Henok K.',
    role: 'CEO, Agrifeed Industries',
    content: 'The precision engineering and durability of Dukan\'s equipment has transformed our production line. We\'ve seen a 30% increase in efficiency and remarkable reduction in downtime.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    location: 'JIMMA,ETHIOPIA',
  },
  {
    name: 'Michael BEKELE',
    role: 'Operations Director',
    content: 'Outstanding after-sales support and technical expertise. The team helped us customize a complete feed mill solution that perfectly fits our needs. Highly recommended!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    location: 'DIRE DAWA, ETHIOPIA',
  },
  {
    name: 'LUEL M.',
    role: 'Production Manager',
    content: 'Dukan\'s machinery is built to last. Two years of continuous operation with minimal maintenance. The energy efficiency alone paid for the investment.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    
    location: 'Kigali, Rwanda',
  },
  
]

export default function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section ref={ref} className="py-16 sm:py-20 md:py-24 bg-gray-50 dark:bg-neutral-900">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <h2 className="text-green-900 font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-wider">
            Testimonials
          </h2>
          <div className="w-16 sm:w-20 h-2 bg-orange-600 mx-auto mt-4 rounded-full"></div>
          <h2 className="text-sm sm:text-base md:text-xl lg:text-2xl font-black text-green-800 mt-4 mb-4 sm:mb-6">
            What Our{' '}
            <span className="text-orange-600">Clients Say</span>
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
              className="group relative bg-white dark:bg-neutral-900 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-neutral-700 hover:border-orange-400"
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
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-2 ring-gray-100 group-hover:ring-orange-200 transition-all animate-float">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="rounded-full object-cover"
                    sizes="40px"
                  />
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

              {/* Bottom Green Accent */}
              <div className="absolute bottom-0 left-4 sm:left-6 right-4 sm:right-6 h-1.5 sm:h-2 bg-gradient-to-r from-transparent via-orange-600 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
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
            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 dark:bg-neutral-800 shadow-sm rounded-full">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300">4.7/5 Average Rating</span>
            </div>
            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 dark:bg-neutral-800 shadow-sm rounded-full">
              <span className="text-orange-600 font-black text-sm sm:text-base md:text-lg">100+</span>
              <span className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300">Happy Clients</span>
            </div>
            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 dark:bg-neutral-800 shadow-sm rounded-full">
              <span className="text-green-600 font-black text-sm sm:text-base md:text-lg">4+</span>
              <span className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300">Countries Worldwide</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}