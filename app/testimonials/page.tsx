// app/testimonials/page.tsx
'use client'

import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star, Building2, Calendar, Quote, ChevronRight, Eye, Target, Factory, Award } from 'lucide-react'

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
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <main ref={ref} className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gray-50 dark:bg-gray-900 pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 right-10 w-72 h-72 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl opacity-30" />
            <div className="absolute bottom-20 left-10 w-72 h-72 bg-green-100 dark:bg-green-900/20 rounded-full blur-3xl opacity-30" />
          </div>
          
          <div className="container mx-auto px-2 sm:px-4 lg:px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-green-800 dark:text-white mb-4">
                What Our{' '}
                <span className="text-orange-600">Clients Say</span>
              </h1>
              <div className="w-20 h-2 bg-orange-500 mx-auto mt-1 rounded-full"></div>
              
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                Trusted by industry leaders across.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="py-20">
          <div className="container mx-auto px-2 sm:px-2 lg:px-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  onClick={() => setExpandedId(expandedId === testimonial.id ? null : testimonial.id)}
                  className="group relative p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-orange-500/50 transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer"
                >
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-8 text-gray-200 dark:text-gray-700 text-5xl group-hover:text-orange-500/20 transition-colors">
                    <Quote className="w-8 h-8" />
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Content */}
                  <p className="text-gray-600 dark:text-gray-400 italic mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {testimonial.initials}
                    </div>
                    <div>
                      <h6 className="font-black text-orange-600 dark:text-orange-400">
                        {testimonial.name}
                      </h6>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {testimonial.position}
                      </p>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedId === testimonial.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Building2 className="w-4 h-4 text-orange-500" />
                          <span className="font-black">{testimonial.company}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 text-orange-500" />
                          <span>{new Date(testimonial.date).toLocaleDateString()}</span>
                        </div>
                        {testimonial.project && (
                          <div className="mt-2 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              <span className="font-black text-orange-600">Project:</span> {testimonial.project}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Hint that it's clickable */}
                  <div className="absolute bottom-3 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-4 h-4 text-orange-500" />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-16 text-center"
            >
              <p className="text-gray-400 text-sm font-bold uppercase tracking-[0.2em]">
                Trusted by over <span className="text-orange-500">500+</span> Global Enterprises
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="mt-12 text-center"
            >
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-3">Join Our Satisfied Clients</h2>
                <p className="mb-6 opacity-90">
                  Ready to experience the same quality and reliability that our clients trust?
                  Let's discuss how we can transform your production line.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Start Your Project
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* About Dukan Machinery Section */}
        <section className="py-20 bg-neutral-50 dark:bg-gray-800/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-3xl font-black text-gray-900 dark:text-white mb-4">
                About <span className="text-orange-600">Dukan Machinery</span>
              </h2>
              <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full"></div>
            </motion.div>

            {/* Company Story Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 mb-16"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-3xl font-black text-primary dark:text-white mb-4">Company <span className="text-secondary-dark"> Story</span></h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    Dukan Machinery PLC was founded with a vision to transform Ethiopia's agricultural processing sector. 
                    What began as a small workshop has grown into a trusted name in industrial machinery, serving clients across East Africa.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Today, we design and manufacture a wide range of machines – from feed pellet lines to custom industrial solutions – 
                    helping farmers and businesses increase productivity and reduce waste.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="overflow-hidden rounded-2xl shadow-lg group">
                    <img 
                      src="/images/testimonials/Factory photo.jpg" 
                      alt="Company Story" 
                      className="h-40 w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                    />
                  </div>
                  <div className="overflow-hidden rounded-2xl shadow-lg group">
                    <img 
                      src="/images/testimonials/Factory photos 1.jpg" 
                      alt="Company Story" 
                      className="h-40 w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                    />
                  </div>
                   
                </div>
              </div>
            </motion.div>

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
              >
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mb-6">
                  <Target className="text-3xl text-orange-700" size={28} />
                </div>
                <h3 className="text-2xl font-black text-green-900 dark:text-white mb-4">Our Mission</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  To empower farmers and agro‑processors with reliable, high‑performance machinery that increases efficiency, 
                  reduces post‑harvest losses, and supports sustainable agricultural growth across Africa.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
              >
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mb-6">
                  <Eye className="text-3xl text-orange-700" size={28} />
                </div>
                <h3 className="text-2xl font-black text-primary dark:text-white mb-4">Our Vision</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  To become the leading manufacturer of agricultural processing equipment in East Africa, 
                  recognised for innovation, quality, and exceptional customer support.
                </p>
              </motion.div>
            </div>

            {/* Manufacturing Philosophy */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gradient-to-r from-green-900 to-green-800 text-white rounded-3xl p-8 md:p-12 mb-16 text-center animate-fade-out"
            >
              <Factory className="text-5xl text-orange-400 mx-auto mb-4 animate-float" size={56} />
              <h3 className="text-3xl text-primary font-black mb-4">Manufacturing Philosophy</h3>
              <p className="max-w-3xl mx-auto text-gray-300 leading-relaxed">
                We believe in building machines that last. Every component is sourced for durability, 
                every weld is inspected, and every machine is tested before leaving our factory.
              </p>
            </motion.div>

            {/* Factory Photos */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-16"
            >
              <h3 className="text-3xl font-black text-green-700 dark:text-white mb-8 text-center">Inside Our <span className='text-primary'>Factory </span> </h3>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="overflow-hidden rounded-2xl shadow-lg group">
                  <img 
                    src="/images/testimonials/Company Story.jpg" 
                    alt="Inside Our Factory" 
                    className="h-56 w-full object-cover transition-all duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl shadow-lg group">
                  <img 
                    src="/images/testimonials/factory-photos-1.jpg" 
                    alt="Inside Our Factory" 
                    className="h-56 w-full object-cover transition-all duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl shadow-lg group md:col-span-2 max-w-md mx-auto">
                  <img 
                    src="/images/testimonials/Factory photos 1.jpg" 
                    alt="Inside Our Factory" 
                    className="h-56 w-full object-cover transition-all duration-500 group-hover:scale-110"
                  />
                </div>
              </div>
            </motion.div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
                <Award className="text-orange-700" size={32} />
                Our Certifications
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <span className="text-3xl font-bold text-orange-600">NATC</span>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white">National Agricultural Training Center</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Certified Partner</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <span className="text-3xl font-bold text-orange-600">ISO</span>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Certified Agro-Processing</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Quality Assured</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <span className="text-3xl font-bold text-orange-600">O&M</span>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Operations & Maintenance Certificate</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Industry Standard</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}