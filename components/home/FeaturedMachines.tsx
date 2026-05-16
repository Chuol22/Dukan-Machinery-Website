'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useLocale } from 'next-intl'
import {
  ArrowRight,
  Gauge,
  Zap,
  Settings,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Play,
  Info,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'

const CapacityIcon = () =>
<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="text-secondary" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M510.28 445.86l-73.03-292.13c-3.8-15.19-16.44-25.72-30.87-25.72h-60.25c3.57-10.05 5.88-20.72 5.88-32 0-53.02-42.98-96-96-96s-96 42.98-96 96c0 11.28 2.3 21.95 5.88 32h-60.25c-14.43 0-27.08 10.54-30.87 25.72L1.72 445.86C-6.61 479.17 16.38 512 48.03 512h415.95c31.64 0 54.63-32.83 46.3-66.14zM256 128c-17.64 0-32-14.36-32-32s14.36-32 32-32 32 14.36 32 32-14.36 32-32 32z"></path>
  </svg>;


const PowerIcon = () =>
<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" className="text-secondary" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M296 160H180.6l42.6-129.8C227.2 15 215.7 0 200 0H56C44 0 33.8 8.9 32.2 20.8l-32 240C-1.7 275.2 9.5 288 24 288h118.7L96.6 482.5c-3.6 15.2 8 29.5 23.3 29.5 8.4 0 16.4-4.4 20.8-12l176-304c9.3-15.9-2.2-36-20.7-36z"></path>
  </svg>;

// Mock machine data (would come from your machines.json)
const featuredMachines = [
  {
    id: 1,
    name: 'Cattle Feed Pellet Machine',
    slug: 'cattle-feed-pellet-machine',  
    shortDescription: 'High-capacity automatic feeding system for large-scale poultry operations',
    capacity: '1.5 - 2 Tons/hr',
    power: '15kW - 22kW',
    image: '/images/machines/industry machine/Cattle Feed Pellet.jpg',
   
  },
  {
    id: 2,
    name: 'Straw Cutting Machine',
    slug: 'straw-cutting-machine',
    shortDescription: 'Industrial hammer mill for fine grinding of various grains', 
    capacity: '500 - 800 kg/hr',
    power: '3kW - 5.5kW',
    image: '/images/machines/industry machine/Straw cutting.jpg',  
  },
  {
    id: 3,
    name: 'Cow Dung Drying Machine',
    slug: 'cow-dung-drying-machine',
    shortDescription: 'High-capacity pellet mill for quality feed pellets',  
    capacity: '1000 kg/hr',
    power: '7.5kW Industrial Motor',  
    image: '/images/machines/industry machine/Cow dung.jpg', 
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

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
}

export default function FeaturedMachines() {
  const locale = useLocale()
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredMachines.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredMachines.length) % featuredMachines.length)
  }

  return (
    <section ref={ref} className="py-16 sm:py-20 md:py-24 bg-gray-50 dark:bg-neutral-900 overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <h2 className="text-green-800 dark:text-white font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-wider">
            Featured<span className='text-orange-600'>build</span>
          </h2>
          <div className='w-16 sm:w-20 h-2 bg-orange-600 mt-4 rounded-full mx-auto'></div>
          <h5 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-neutral-900 dark:text-white mt-4 mb-4 sm:mb-6">
            Our Most Popular{' '}
            <span className="text-primary">Industrial Machines</span>
          </h5>
          <p className="text-sm sm:text-base md:text-lg text-neutral-600 font-black dark:text-neutral-400">
            Discover our best-selling machinery trusted by feed manufacturers worldwide
          </p>
        </motion.div>

        {/* Desktop Grid View (Hidden on mobile) */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4">
          {featuredMachines.map((machine, index) => (
            <motion.div
              key={machine.id}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredCard(machine.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="group relative"
            >
              <div className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                {/* Image Container */}
                <div className="relative h-48 sm:h-56 overflow-hidden bg-neutral-200 dark:bg-neutral-700">
                  <Image
                    src={machine.image}
                    alt={machine.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-black text-green-900 dark:text-white mb-2">
                    {machine.name}
                  </h3>
                  <p className="text-gray-600 dark:text-neutral-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                    {machine.shortDescription}
                  </p>
                  
                  {/* Machine Specs */}
                  <div className="flex items-center justify-between gap-2 pt-2 sm:pt-3 border-t border-neutral-200 dark:border-neutral-700">
                    <div className="flex flex-col items-center flex-1">
                      <span className="flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-[10px] text-neutral-400 uppercase font-black mb-1">
                        <CapacityIcon /> Capacity
                      </span>
                      <span className="text-[10px] sm:text-xs font-black text-primary dark:text-white">{machine.capacity}</span>
                    </div>
                    <div className="w-px h-5 sm:h-6 bg-neutral-200 dark:border-neutral-700"></div>
                    <div className="flex flex-col items-center flex-1">
                      <span className="flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-[10px] text-neutral-400 uppercase font-black mb-1">
                        <PowerIcon /> Power
                      </span>
                      <span className="text-[10px] sm:text-xs font-black text-primary dark:text-white">{machine.power}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Carousel View */}
        <div className="lg:hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden">
                <Image
                  src={featuredMachines[currentSlide].image}
                  alt={featuredMachines[currentSlide].name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                />
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                  <span className="px-2 sm:px-3 py-1 bg-secondary text-white text-xs sm:text-sm font-black rounded-full">
                    {featuredMachines[currentSlide].category}
                  </span>
                </div>
              </div>

              <div className="p-3 sm:p-4">
                <h3 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white mb-2">
                  {featuredMachines[currentSlide].name}
                </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm mb-3 sm:mb-4">
                    {featuredMachines[currentSlide].shortDescription}
                  </p>
                
                {/* Info */}
              <div className="p-4 sm:p-6 md:p-8">
                <h3 className="text-base sm:text-lg md:text-xl font-black text-primary dark:text-white mb-4 sm:mb-6 uppercase text-center border-b border-neutral-200 dark:border-neutral-700 pb-3 sm:pb-4">
                  {featuredMachines[currentSlide].name}
                </h3>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col items-center flex-1">
                    <span className="flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-[10px] text-neutral-400 uppercase font-black mb-1">
                      <CapacityIcon /> Capacity
                    </span>
                    <span className="text-[10px] sm:text-xs font-black text-primary dark:text-white">{featuredMachines[currentSlide].capacity}</span>
                  </div>
                  <div className="w-px h-6 sm:h-8 bg-neutral-200 dark:bg-neutral-700"></div>
                  <div className="flex flex-col items-center flex-1">
                    <span className="flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-[10px] text-neutral-400 uppercase font-black mb-1">
                      <PowerIcon /> Power
                    </span>
                    <span className="text-[10px] sm:text-xs font-black text-primary dark:text-white">{featuredMachines[currentSlide].power}</span>
                  </div>
                </div>
              </div>

                <div className="flex gap-2 sm:gap-3"> 
                  <Link href={`/${locale}/order`} className="flex-1">
                    <Button className="w-full bg-primary hover:bg-primary-dark text-xs sm:text-sm">
                      Order
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-neutral-800/90 p-2 rounded-full shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-neutral-800/90 p-2 rounded-full shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {featuredMachines.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-neutral-300 dark:bg-neutral-600'
                }`}
              />
            ))}
          </div>
        </div>
         
      </div>
    </section>
  )
}