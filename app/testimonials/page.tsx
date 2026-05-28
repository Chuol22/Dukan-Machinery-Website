// app/testimonials/page.tsx
'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, Building2, Calendar, Quote, ChevronRight, Award } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: "Henok",
    initials: "H",
    position: "Factory Owner",
    location: "Adam, Oromia, Ethiopia",
    content: "The Poultry Feed Machine we installed has exceeded our expectations. The pellet quality is consistent, and the energy efficiency is remarkable.",
    rating: 5,
    company: "Geze Poultry Farms",
    date: "2024-01-15",
    project: "Complete poultry feed production line installation with capacity of 15 tons/day."
  },
  {
    id: 2,
    name: "Hayu Samuel",
    initials: "S",
    position: "Operations Manager",
    location: "Addis Ababa, Ethiopia",
    content: "Dukan Machinery provided exceptional support during the setup of our cattle feed line. Their technical team is truly professional and knowledgeable.",
    rating: 5,
    company: "Kebede Agritech",
    date: "2024-02-20",
    project: "Custom cattle feed processing plant with automated mixing and pelleting systems."
  },
  {
    id: 3,
    name: "Meti solomon",
    initials: "M",
    position: "Agri-Industrial Consultant",
    location: "Harar, Ethiopia",
    content: "Finding reliable custom industrial machines is tough, but Dukan's engineering standards are top-tier. They understand the nuances of feed processing.",
    rating: 5,
    company: "Alemayew Consulting",
    date: "2024-03-10",
    project: "Consultancy project for multiple feed mills across East Africa."
  },
  {
    id: 4,
    name: "Chala Berhan",
    initials: "T",
    position: "Production Director",
    location: "Jimma, Ethiopia",
    content: "The hammer mill we purchased has been running continuously for 18 months with zero downtime. Outstanding build quality.",
    rating: 5,
    company: "Berhan Mills Group",
    date: "2024-01-05",
    project: "Industrial hammer mill installation for fine grain processing."
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function TestimonialsPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <main ref={ref}>
        {/* Hero Section */}
        <section className="relative bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 pt-24 pb-16 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 right-10 w-72 h-72 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl opacity-30" />
            <div className="absolute bottom-20 left-10 w-72 h-72 bg-green-100 dark:bg-green-900/20 rounded-full blur-3xl opacity-30" />
          </div>
          
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-green-800 dark:text-white mb-4">
                What Our{' '}
                <span className="text-orange-600">Clients Say</span>
              </h1>
              <div className="w-20 h-1 bg-orange-500 mx-auto mt-2 rounded-full" />
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mt-6 leading-relaxed">
                Trusted by industry leaders across the country
              </p>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  onClick={() => setExpandedId(expandedId === testimonial.id ? null : testimonial.id)}
                  className="group relative p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-orange-500/50 transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer"
                >
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6 text-gray-200 dark:text-gray-700">
                    <Quote className="w-8 h-8 group-hover:text-orange-500/20 transition-colors" />
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Content */}
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 border-t border-gray-100 dark:border-gray-700 pt-5">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {testimonial.initials}
                    </div>
                    <div className="flex-1">
                      <h6 className="font-bold text-orange-600 dark:text-orange-400">
                        {testimonial.name}
                      </h6>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.position}
                      </p>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${expandedId === testimonial.id ? 'rotate-90' : ''}`} />
                  </div>

                  {/* Expanded Details */}
                  {expandedId === testimonial.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Building2 className="w-4 h-4 text-orange-500" />
                          <span className="font-medium">{testimonial.company}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 text-orange-500" />
                          <span>{new Date(testimonial.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        {testimonial.project && (
                          <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              <span className="font-semibold text-orange-600">Project:</span> {testimonial.project}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-16 text-center"
            >
              <p className="text-gray-400 dark:text-gray-500 text-sm font-semibold uppercase tracking-wider">
                Trusted by <span className="text-orange-500">200+</span> enterprises and farmers nationwide
              </p>
            </motion.div>

            {/* CTA Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-16"
            >
              <div className="bg-linear-to-r from-orange-500 to-orange-600 rounded-2xl p-10 text-white text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Join Our Satisfied Clients?</h2>
                <p className="mb-6 opacity-90 max-w-2xl mx-auto">
                  Experience the same quality and reliability that our clients trust. Let&apos;s discuss how we can transform your production line.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Start Your Project
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Certifications Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 px-4 py-2 rounded-full mb-4">
                <Award className="text-orange-600" size={20} />
                <span className="text-orange-600 dark:text-orange-400 font-semibold">Certifications</span>
              </div>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">
                Our Credentials
              </h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              {[
                { name: "NATC", title: "National Agricultural Training Center", desc: "Certified Partner" },
                { name: "ISO", title: "Certified Agro-Processing", desc: "Quality Assured" },
                { name: "O&M", title: "Operations & Maintenance", desc: "Industry Standard" }
              ].map((cert, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <span className="text-xl font-black text-orange-600">{cert.name}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">{cert.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{cert.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}