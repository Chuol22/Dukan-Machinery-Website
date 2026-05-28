'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Settings, ChevronRight } from 'lucide-react';

export default function HeroSection() {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopIndex, setLoopIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const words = ['for great Solutions', 'Equipment', 'of Modern Technology', 'for great Innovation'];
  const typingSpeed = 200;
  const deletingSpeed = 50;
  const pauseTime = 2000;

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
  }, [typedText, isDeleting, loopIndex]);

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
    <div className="min-h-screen bg-green-800 dark:bg-gray-900 -mt-16 lg:-mt-20">
      {/* Hero Section with Video Background */}
      <div className="relative overflow-hidden">
        {/* Video Background Container */}
        <div className="absolute inset-0">
          {!videoLoaded && (
            <div className="absolute inset-0 bg-linear-to-r from-green-800 via-green-800 to-orange-100 animate-pulse" />
          )}

          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            poster="/images/hero/dkmlogo.png"
          >
            <source src="/videos/machines/Chicken Feed Mill Machine.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-linear-to-r from-green-900/50 via-green-800/20 to-black-100" />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black-100" />
        </div>

        {/* Content */}
        <div
          className="relative"
          style={{
            paddingTop: `${headerHeight + 40}px`,
            paddingBottom: '60px',
          }}
        >
          <div className="container-custom mx-auto">
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
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white dark:text-shadow-white mb-4 leading-tight"
              >
                Industrial Machinery Solutions

                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-orange-500 dark:text-shadow-white xl:text-4xl font-black mt-4 h-16 sm:h-20 md:h-24 drop-shadow-md">
                  <span>Machinery {typedText}</span>
                  <span
                    className="typed-cursor inline-block w-0.5 sm:w-1 h-6 sm:h-8 md:h-10 bg-orange-500 ml-1 animate-pulse"
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
                className="max-w-4xl mx-auto mt-6 sm:mt-8 md:mt-10 mb-8 sm:mb-10 md:mb-12 px-4"
              >
                <div className="bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 border-b-4 border-orange-500 hover:shadow-xl transition-all duration-300">
                  <p className="text-gray-700 dark:text-gray-200 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
                    <span className="font-black text-gray-900 dark:text-white">Precision engineering</span> for agricultural and industrial applications.{' '}
                    <span className="inline-block mx-0.5 sm:mx-1 px-1.5 sm:px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 font-bold rounded-md">
                      Built to Last
                    </span>
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8 md:mt-10 justify-center px-4"
              >
                <Link
                  href="/machines"
                  className="group relative px-5 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-3.5 md:py-4 bg-linear-to-r from-orange-600 to-orange-500 text-white font-black rounded-xl sm:rounded-2xl transition-all duration-300 uppercase text-xs sm:text-sm md:text-base tracking-wider shadow-2xl shadow-orange-600/30 hover:shadow-2xl hover:shadow-orange-600/50 hover:-translate-y-1 active:translate-y-0 hover:from-orange-500 hover:to-orange-400 min-w-35 sm:min-w-40 md:min-w-50 flex items-center justify-center gap-2"
                >
                  <span>View Machines</span>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>

                <Link
                  href="/order"
                  className="group relative px-5 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-3.5 md:py-4 bg-white/10 backdrop-blur-md border-2 border-white/60 text-white font-black rounded-xl sm:rounded-2xl transition-all duration-300 uppercase text-xs sm:text-sm md:text-base tracking-wider hover:bg-white hover:text-gray-900 hover:border-white hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 min-w-35 sm:min-w-40 md:min-w-55 flex items-center justify-center gap-2"
                >
                  <span>Order Custom</span>
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-90 transition-transform duration-300" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}