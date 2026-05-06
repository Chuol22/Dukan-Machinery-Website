'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation, Easing } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Icons as components
const CapacityIcon = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 496 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M248 8C111.03 8 0 119.03 0 256s111.03 248 248 248 248-111.03 248-248S384.97 8 248 8zm0 432c-101.69 0-184-82.29-184-184 0-101.69 82.29-184 184-184 101.69 0 184 82.29 184 184 0 101.69-82.29 184-184 184zm0-312c-70.69 0-128 57.31-128 128s57.31 128 128 128 128-57.31 128-128-57.31-128-128-128zm0 192c-35.29 0-64-28.71-64-64s28.71-64 64-64 64 28.71 64 64-28.71 64-64 64z"></path>
  </svg>
);

const DurabilityIcon = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M466.5 83.7l-192-80a48.15 48.15 0 0 0-36.9 0l-192 80C27.7 91.1 16 108.6 16 128c0 198.5 114.5 335.7 221.5 380.3 11.8 4.9 25.1 4.9 36.9 0C360.1 472.6 496 349.3 496 128c0-19.4-11.7-36.9-29.5-44.3zM256.1 446.3l-.1-381 175.9 73.3c-3.3 151.4-82.1 261.1-175.8 307.7z"></path>
  </svg>
);

const StandardsIcon = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 496 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"></path>
  </svg>
);

const SupportIcon = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M192 208c0-17.67-14.33-32-32-32h-16c-35.35 0-64 28.65-64 64v48c0 35.35 28.65 64 64 64h16c17.67 0 32-14.33 32-32V208zm176 144c35.35 0 64-28.65 64-64v-48c0-35.35-28.65-64-64-64h-16c-17.67 0-32 14.33-32 32v112c0 17.67 14.33 32 32 32h16zM256 0C113.18 0 4.58 118.83 0 256v16c0 8.84 7.16 16 16 16h16c8.84 0 16-7.16 16-16v-16c0-114.69 93.31-208 208-208s208 93.31 208 208h-.12c.08 2.43.12 165.72.12 165.72 0 23.35-18.93 42.28-42.28 42.28H320c0-26.51-21.49-48-48-48h-32c-26.51 0-48 21.49-48 48s21.49 48 48 48h181.72c49.86 0 90.28-40.42 90.28-90.28V256C507.42 118.83 398.82 0 256 0z"></path>
  </svg>
);

// Fixed variants with proper easing types
const fadeInUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: "easeOut" as const  // Use 'as const' for literal type
    } 
  }
};

const fadeInLeftVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.6, 
      ease: "easeOut" as const 
    } 
  }
};

const fadeInRightVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.6, 
      ease: "easeOut" as const 
    } 
  }
};

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5,
      ease: "easeOut" as const
    } 
  }
};

export default function WhatWeBuild() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const machines = [
    {
      title: "Poultry Feed Machines",
      description: "High-capacity pellet lines for layers, broilers & chicks.",
      image: "/images/machines/Chicken Feed Machine.jpg",
      animation: "fade-left"
    },
    {
      title: "Animal Feed Processing",
      description: "Complete systems for cattle, fish & livestock nutrition.",
      image: "/images/machines/Animal Feed Processing.jpg",
      animation: "fade-up"
    },
    {
      title: "Custom Industrial Machines",
      description: "Tailored automation for unique agri-industrial needs.",
      image: "/images/machines/Custom Industrial Machines.jpg",
      animation: "fade-down"
    },
    {
      title: "Maintenance & Support",
      description: "24/7 service, spare parts, and performance upgrades.",
      image: "/images/machines/industry machine/maintenance_support.jpg",
      animation: "fade-right"
    }
  ];

  const features = [
    {
      title: "Capacity accuracy",
      description: "Precision-engineered systems that deliver exact output requirements consistently.",
      icon: CapacityIcon,
      animation: "fade-left"
    },
    {
      title: "Durable materials",
      description: "Built with high-grade industrial steel for long-term operational.",
      icon: DurabilityIcon,
      animation: "fade-up"
    },
    {
      title: "Local & international standards",
      description: "Fully compliant with global engineering protocols and local safety regulations.",
      icon: StandardsIcon,
      animation: "fade-down"
    },
    {
      title: "After‑sales support",
      description: "Dedicated technical assistance and parts availability to minimize downtime.",
      icon: SupportIcon,
      animation: "fade-right"
    }
  ];

  return (
    <section 
      id="what-we-build" 
      ref={sectionRef}
      className="py-20 bg-white dark:bg-gray-900/50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUpVariants}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4 text-secondary-dark dark:text-white">
            What we build?
          </h2>
          <div className="w-20 h-2 bg-primary mx-auto mt-4 rounded-full"></div>
        </motion.div>

        {/* Machines Grid */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
        >
          {machines.map((machine, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group bg-white dark:bg-neutral-800 rounded-2xl shadow-lg overflow-hidden border-b-4 border-orange-500 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="overflow-hidden h-48 relative">
                <Image
                  src={machine.image}
                  alt={machine.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <div className="p-6">
                <h3 className="font-black text-xl mb-2 text-primary dark:text-white">
                  {machine.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {machine.description}
                </p>
                 
              </div>
            </motion.div>
          ))}
        </motion.div>

        
      </div>
    </section>
  );
}