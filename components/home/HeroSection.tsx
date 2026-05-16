'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { 
  Settings, 
  ChevronRight,
} from 'lucide-react';

export default function HomePage() {
  const locale = useLocale();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopIndex, setLoopIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const words = ['Built for Performance', 'Engineered for Precision & Efficiency', 'Designed for Reliability'];
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseTime = 1500;

  // Typing animation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentWord = words[loopIndex % words.length];

    if (isDeleting) {
      timer = setTimeout(() => {
        setTypedText((prev) => prev.slice(0, -1));
        if (typedText === '') {
          setIsDeleting(false);
          setLoopIndex((prev) => prev + 1);
        }
      }, deletingSpeed);
    } else {
      timer = setTimeout(() => {
        setTypedText(currentWord.slice(0, typedText.length + 1));
        if (typedText === currentWord) {
          timer = setTimeout(() => setIsDeleting(true), pauseTime);
        }
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, loopIndex, words]);

  // Detect header height dynamically
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);

    const observer = new ResizeObserver(updateHeaderHeight);
    const header = document.querySelector('header');
    if (header) {
      observer.observe(header);
    }

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      observer.disconnect();
    };
  }, []);

  // Handle video loading
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('canplay', () => setVideoLoaded(true));
      videoRef.current.play().catch(e => console.log('Video autoplay failed:', e));
    }
  }, []);



  return (
    <div className="min-h-screen bg-green-800">
      {/* Hero Section with Video Background */}
      <div className="relative overflow-hidden">
        {/* Video Background Container */}
        <div className="absolute inset-0">
          {!videoLoaded && (
            <div className="absolute inset-0 bg-linear-to-r from-green-500 via-green-400 to-green-500 animate-pulse" />
          )}

          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-ful object-cover transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            poster="/images/hero/dkmlogo.jpg"
          >
            <source src="/videos/machines/Chicken Feed Mill Machine.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/50 via-green-800/30 to-green-900/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
        </div>

        {/* Content */}
        <div
          className="relative"
          style={{
            paddingTop: `${headerHeight + 40}px`,
            paddingBottom: '60px',
          }}
        >
          <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="max-w-5xl mx-auto text-center"
            >

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black text-white mb-4 leading-tight"
              >
                Agri-Industrial Feed Processing
                
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black mt-4 h-16 sm:h-20 md:h-24 drop-shadow-md">
                  <span>Machinery {typedText}</span>
                  <span
                    className="typed-cursor inline-block w-[2px] sm:w-[3px] h-6 sm:h-8 md:h-10 bg-orange-500 ml-1 animate-pulse"
                    aria-hidden="true"
                  >
                    |
                  </span>
                </div>
              </motion.h1>

             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="max-w-4xl mx-auto mt-8 sm:mt-10 md:mt-12 mb-8 sm:mb-10 md:mb-12 px-4 sm:px-6 md:px-10"
              >
              <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 
                              border-b-4 sm:border-b-6 md:border-b-8 border-orange-500
                              hover:shadow-xl transition-shadow duration-300">
                  <p className="text-gray-700 dark:text-gray-200 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed">
                    <span className="font-black text-gray-900 dark:text-white">Precision engineering</span> for poultry feed, 
                    animal feed, and agro-processing. <span className='text-green-700 dark:text-green-400'> Boost productivity with </span> 
                    <span className="inline-block mx-0.5 sm:mx-1 px-1.5 sm:px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-primary font-bold rounded-md">
                      30% higher efficiency
                    </span>
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 mt-8 sm:mt-10 md:mt-12 justify-center"
              >
                <Link
                  href={`/${locale}/machines`}
                  className="group relative px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-3 sm:py-3.5 md:py-4 lg:py-4.5 xl:py-5 bg-linear-to-r from-orange-600 to-orange-500 
                             text-white font-black rounded-xl sm:rounded-2xl transition-all duration-300 
                             uppercase text-xs sm:text-sm md:text-base tracking-wider shadow-2xl shadow-orange-600/30
                             hover:shadow-2xl hover:shadow-orange-600/50 hover:-translate-y-1 
                             active:translate-y-0 hover:from-orange-500 hover:to-orange-400
                             min-h-[44px] min-w-[44px] flex items-center justify-center
                             min-w-[140px] sm:min-w-[160px] md:min-w-[200px] lg:min-w-[220px] xl:min-w-[260px]
                             before:absolute before:inset-0 before:rounded-xl sm:before:rounded-2xl before:bg-linear-to-r 
                             before:from-white/20 before:to-transparent before:opacity-0 
                             before:transition-opacity before:duration-300 hover:before:opacity-100
                             overflow-hidden"
                >
                  <span className="relative flex items-center justify-center gap-2 sm:gap-3">
                    View Machines
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>

                <Link
                  href={`/${locale}/order`}
                  className="group relative px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-3 sm:py-3.5 md:py-4 lg:py-4.5 xl:py-5 bg-white/10 backdrop-blur-md 
                             border-2 border-white/60 text-white font-black rounded-xl sm:rounded-2xl 
                             transition-all duration-300 uppercase text-xs sm:text-sm md:text-base tracking-wider
                             hover:bg-white hover:text-gray-900 hover:border-white 
                             hover:shadow-2xl hover:-translate-y-1 active:translate-y-0
                             min-h-[44px] min-w-[44px] flex items-center justify-center
                             min-w-[140px] sm:min-w-[160px] md:min-w-[200px] lg:min-w-[220px] xl:min-w-[260px]
                             before:absolute before:inset-0 before:rounded-xl sm:before:rounded-2xl before:bg-white 
                             before:scale-0 before:transition-transform before:duration-300
                             hover:before:scale-100 overflow-hidden"
                >
                  <span className="relative flex items-center justify-center gap-2 sm:gap-3 z-10">
                    Order Custom Machine
                    <Settings className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:rotate-90 transition-transform duration-300" />
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
 
      
    </div>
  );
}