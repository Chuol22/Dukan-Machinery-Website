'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { 
  Factory, 
  Settings, 
  Shield, 
  Truck, 
  Star, 
  ChevronRight,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Clock
} from 'lucide-react';

export default function HomePage() {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopIndex, setLoopIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });

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

  const stats = [
    { number: 500, label: 'Machines Delivered', suffix: '+' },
    { number: 4, label: 'Countries Served', suffix: '+' },
    { number: 98, label: 'Customer Satisfaction', suffix: '%' },
    { number: 6, label: 'Years of Excellence', suffix: '' },
  ];

  const features = [
    {
      icon: Settings,
      title: 'Precision Engineering',
      description: 'State-of-the-art manufacturing with ISO-certified quality control processes.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Shield,
      title: 'Durable Build',
      description: 'Heavy-duty construction designed for continuous operation in harsh environments.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Truck,
      title: 'Global Delivery',
      description: 'Fast and reliable shipping to any location with professional installation support.',
      color: 'from-green-500 to-teal-500'
    },
  ];

  const testimonials = [
    {
      name: 'Thomas Anderson',
      role: 'Farm Owner, Kenya',
      content: 'The poultry feed machine has transformed our production. Efficiency increased by 40%!',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      name: 'Dr. Sarah Chen',
      role: 'Agri-Business Consultant',
      content: 'Most reliable machinery I have worked with. Technical support is exceptional.',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    {
      name: 'Mohammed Ali',
      role: 'Factory Owner, Ethiopia',
      content: 'Best investment we made. The machines run 24/7 with minimal maintenance.',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/men/qw.jpg',
      alt: 'Mohammed Ali'
    },
  ];

  return (
    <div className="min-h-screen bg-green-800">
      {/* Hero Section with Video Background */}
      <div className="relative overflow-hidden">
        {/* Video Background Container */}
        <div className="absolute inset-0">
          {!videoLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-green-800 via-green-800 to-green-900 animate-pulse" />
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
            paddingTop: `${headerHeight + 80}px`,
            paddingBottom: '100px',
          }}
        >
          <div className="container mx-auto px-2 sm:px-4 lg:px-6">
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
                className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-4 leading-tight"
              >
                Agri-Industrial Feed Processing
                
                <div className="text-orange-600 text-2xl md:text-3xl lg:text-4xl font-black mt-4 h-20 md:h-24 drop-shadow-md">
                  <span>Machinery {typedText}</span>
                  <span
                    className="typed-cursor inline-block w-[3px] h-8 md:h-10 bg-orange-500 ml-1 animate-pulse"
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
                className="max-w-4xl mx-auto mt-10 mb-12 px-6 md:px-10"
              >
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 lg:p-10 
                                border-b-8 border-orange-500
                                hover:shadow-xl transition-shadow duration-300">
                  <p className="text-gray-700 text-base md:text-xl lg:text-2xl leading-relaxed">
                    <span className="font-black text-gray-900">Precision engineering</span> for poultry feed, 
                    animal feed, and agro-processing. <span className='text-green-700'> Boost productivity with </span> 
                    <span className="inline-block mx-1 px-2 py-0.5 bg-green-100 text-primary font-bold rounded-md">
                      30% higher efficiency
                    </span>
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-wrap gap-6 mt-12 justify-center"
              >
                <Link
                  href="/machines"
                  className="group relative px-8 md:px-12 py-4 md:py-5 bg-gradient-to-r from-orange-600 to-orange-500 
                             text-white font-black rounded-2xl transition-all duration-300 
                             uppercase text-sm md:text-base tracking-wider shadow-2xl shadow-orange-600/30
                             hover:shadow-2xl hover:shadow-orange-600/50 hover:-translate-y-1 
                             active:translate-y-0 hover:from-orange-500 hover:to-orange-400
                             min-w-[200px] md:min-w-[260px]
                             before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r 
                             before:from-white/20 before:to-transparent before:opacity-0 
                             before:transition-opacity before:duration-300 hover:before:opacity-100
                             overflow-hidden"
                >
                  <span className="relative flex items-center justify-center gap-3">
                    View Machines
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>

                <Link
                  href="/order"
                  className="group relative px-8 md:px-12 py-4 md:py-5 bg-white/10 backdrop-blur-md 
                             border-2 border-white/60 text-white font-black rounded-2xl 
                             transition-all duration-300 uppercase text-sm md:text-base tracking-wider
                             hover:bg-white hover:text-gray-900 hover:border-white 
                             hover:shadow-2xl hover:-translate-y-1 active:translate-y-0
                             min-w-[200px] md:min-w-[260px]
                             before:absolute before:inset-0 before:rounded-2xl before:bg-white 
                             before:scale-0 before:transition-transform before:duration-300
                             hover:before:scale-100 overflow-hidden"
                >
                  <span className="relative flex items-center justify-center gap-3 z-10">
                    Order Custom Machine
                    <Settings className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-90 transition-transform duration-300" />
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