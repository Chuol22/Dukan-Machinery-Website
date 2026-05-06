'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CEO, Agrifeed Industries',
    content: 'The precision engineering and durability of Dukan\'s equipment has transformed our production line. We\'ve seen a 30% increase in efficiency and remarkable reduction in downtime.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    location: 'Nairobi, Kenya',
  },
  {
    name: 'Michael Brown',
    role: 'Operations Director',
    content: 'Outstanding after-sales support and technical expertise. The team helped us customize a complete feed mill solution that perfectly fits our needs. Highly recommended!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    location: 'Kampala, Uganda',
  },
  {
    name: 'Elena Rodriguez',
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
    <section ref={ref} className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-green-900 font-black text-5xl uppercase tracking-wider">
            Testimonials
          </h2>
          <div className="w-20 h-2 bg-primary mx-auto mt-4 rounded-full"></div>
          <h2 className="text-sm sm:text-xl md:text-2xl font-black text-gray-900 mt-4 mb-6">
            What Our{' '}
            <span className="text-orange-600">Clients Say</span>
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="group relative bg-green-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-700 hover:border-orange-400"
            >
              {/* Quote Icon Background */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-12 h-12 text-orange-600" />
              </div>

              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-orange-500 text-orange-500"
                  />
                ))}
              </div>

              {/* Testimonial Content */}
              <p className="text-gray-700 leading-relaxed mb-6 relative z-10">
                "{testimonial.content}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-orange-200 transition-all animate-float"
                />
                <div>
                  <h4 className="font-black text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-xs text-gray-400">
                      {testimonial.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Green Accent */}
              <div className="absolute bottom-0 left-6 right-6 h-2 bg-gradient-to-r from-transparent via-orange-600 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 pt-8 border-t border-orange-600"
        >
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 items-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 shadow-sm rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xl text-gray-600">4.7/5 Average Rating</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 shadow-sm rounded-full">
              <span className="text-orange-600 font-black">600+</span>
              <span className="text-xl text-gray-600">Happy Clients</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 shadow-sm rounded-full">
              <span className="text-green-600 font-black">4+</span>
              <span className="text-xl text-gray-600">Countries Worldwide</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}