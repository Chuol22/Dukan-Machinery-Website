'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, Building2, Calendar, Quote, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

const renderStars = (rating: number) =>
  Array.from({ length: 5 }, (_, i) => (
    <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
  ))

export default function TestimonialsPageClient() {
  const t = useTranslations('testimonials')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const [expandedId, setExpandedId] = useState<number | null>(null)

  // Get testimonials from translations
  const testimonials = [
    {
      id: 1,
      name: t('testimonials.0.name'),
      initials: t('testimonials.0.initials'),
      position: t('testimonials.0.position'),
      location: t('testimonials.0.location'),
      company: t('testimonials.0.company'),
      content: t('testimonials.0.content'),
      rating: 5,
      date: t('testimonials.0.date'),
      project: t('testimonials.0.project')
    },
    {
      id: 2,
      name: t('testimonials.1.name'),
      initials: t('testimonials.1.initials'),
      position: t('testimonials.1.position'),
      location: t('testimonials.1.location'),
      company: t('testimonials.1.company'),
      content: t('testimonials.1.content'),
      rating: 5,
      date: t('testimonials.1.date'),
      project: t('testimonials.1.project')
    },
    {
      id: 3,
      name: t('testimonials.2.name'),
      initials: t('testimonials.2.initials'),
      position: t('testimonials.2.position'),
      location: t('testimonials.2.location'),
      company: t('testimonials.2.company'),
      content: t('testimonials.2.content'),
      rating: 5,
      date: t('testimonials.2.date'),
      project: t('testimonials.2.project')
    },
    {
      id: 4,
      name: t('testimonials.3.name'),
      initials: t('testimonials.3.initials'),
      position: t('testimonials.3.position'),
      location: t('testimonials.3.location'),
      company: t('testimonials.3.company'),
      content: t('testimonials.3.content'),
      rating: 5,
      date: t('testimonials.3.date'),
      project: t('testimonials.3.project')
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <main ref={ref} className="flex-grow">
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
                {t('pageTitle')} <span className="text-orange-600">{t('pageTitleHighlight')}</span>
              </h1>
              <div className="w-20 h-2 bg-orange-500 mx-auto mt-1 rounded-full"></div>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                {t('pageDescription')}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-2 sm:px-2 lg:px-4">
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  whileHover={{ y: -5 }}
                  className="group relative p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-orange-500/50 transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer"
                  onClick={() => setExpandedId(expandedId === testimonial.id ? null : testimonial.id)}
                >
                  <div className="absolute top-6 right-8 text-gray-200 dark:text-gray-700 text-5xl group-hover:text-orange-500/20 transition-colors">
                    <Quote className="w-8 h-8" />
                  </div>
                  <div className="flex gap-1 mb-6">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 italic mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
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
                              <span className="font-black text-orange-600">{t('labels.project')}:</span> {testimonial.project}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                  <div className="absolute bottom-3 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-4 h-4 text-orange-500" />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-16 text-center"
            >
              <p className="text-gray-400 text-sm font-bold uppercase tracking-[0.2em]">
                {t('trustedBy')} <span className="text-orange-500">500+</span> {t('globalEnterprises')}
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}