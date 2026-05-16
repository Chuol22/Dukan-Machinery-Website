'use client';

import Image from 'next/image';
import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Play } from 'lucide-react';

interface Machine {
  id: number;
  slug: string;
  name: string;
  image: string;
  capacity: string;
  power: string;
  input: string;
  output: string;
  process: string;
  category: string;
  type: string;
  price: string;
}

interface MachineCardProps {
  machine: Machine;
  onViewDetails: (machineId: number) => void;
}

const MachineCard = React.memo(({ machine, onViewDetails }: MachineCardProps) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  const handleVideoLoad = useCallback(() => {
    setIsVideoLoaded(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: machine.id * 0.05 }}
      className="border-b border-neutral-200 dark:border-neutral-700 pb-12 last:border-0"
    >
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image/Video Section */}
        <div>
          <div
            className="relative h-60 bg-neutral-200 dark:bg-neutral-700 rounded-2xl overflow-hidden mb-4 group cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {machine.image.endsWith('.mp4') ? (
              <>
                {!isVideoLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-200 dark:bg-neutral-700">
                    <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <video
                  src={machine.image}
                  className={`w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105 ${
                    isVideoLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  muted
                  loop
                  playsInline
                  preload="none"
                  onLoadedData={handleVideoLoad}
                  onMouseEnter={(e) => isHovering && e.currentTarget.play()}
                  onMouseLeave={(e) => e.currentTarget.pause()}
                />
              </>
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={machine.image}
                  alt={machine.name}
                  fill
                  className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                />
              </div>
            )}
            <button
              onClick={() => onViewDetails(machine.id)}
              aria-label="View machine details"
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <div className="bg-orange-500 text-white p-4 rounded-full shadow-xl transform hover:scale-110 transition">
                <Play size={40} fill="white" />
              </div>
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 border-transparent hover:border-orange-500 transition cursor-pointer">
              {machine.image.endsWith('.mp4') ? (
                <video
                  src={machine.image}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  preload="none"
                />
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={machine.image}
                    alt={machine.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div>
          <h3 className="text-2xl font-black text-green-700 dark:text-white mb-3">
            {machine.name}
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-neutral-100 dark:bg-neutral-700 p-3 rounded-lg">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">capacity</p>
              <p className="font-black text-xs text-green-700 dark:text-white">{machine.capacity}</p>
            </div>
            <div className="bg-neutral-100 dark:bg-neutral-700 p-3 rounded-lg">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">power</p>
              <p className="font-black text-xs text-green-700 dark:text-white">{machine.power}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-xs font-black text-green-700 dark:text-white uppercase mb-1">Input</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{machine.input}</p>
            </div>
            <div>
              <p className="text-xs font-black text-green-700 dark:text-white uppercase mb-1">Output</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{machine.output}</p>
            </div>
          </div>

          <div className="mb-6 p-4 bg-green-700/5 dark:bg-neutral-700/50 rounded-xl">
            <p className="text-xs font-black text-green-700 dark:text-white uppercase mb-2">Process</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{machine.process}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-orange-500/10 text-orange-600 text-xs font-black px-3 py-1 rounded-full">
              {machine.category}
            </span>
            <span className="bg-green-700/10 text-green-700 dark:text-white text-xs font-black px-3 py-1 rounded-full">
              {machine.type}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-black text-green-700 dark:text-white">{machine.price}</span>
            <div className="flex gap-3">
              <Link href={`/order?machine=${machine.id}`}>
                <button className="bg-orange-500 text-white font-black px-5 py-3 rounded-full text-sm uppercase tracking-widest hover:bg-orange-600 transition flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 576 512" fill="currentColor">
                    <path d="M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.208l-9.166-44.81C147.758 8.021 137.93 0 126.529 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24h69.883l70.248 343.435C147.325 417.1 136 435.222 136 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-15.674-6.447-29.835-16.824-40h209.647C430.447 426.165 424 440.326 424 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-22.172-12.888-41.332-31.579-50.405l5.517-24.276c3.413-15.018-8.002-29.319-23.403-29.319H218.117l-6.545-32h293.145c11.206 0 20.92-7.754 23.403-18.681z"/>
                  </svg>
                  Order
                </button>
              </Link>
              <button
                onClick={() => onViewDetails(machine.id)}
                className="border-2 border-green-700 text-green-700 dark:border-white dark:text-white font-black px-5 py-3 rounded-full text-xs uppercase tracking-widest hover:bg-green-700 hover:text-white transition flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M109.46 244.04l134.58-134.56-44.12-44.12-61.68 61.68a7.919 7.919 0 0 1-11.21 0l-11.21-11.21c-3.1-3.1-3.1-8.12 0-11.21l61.68-61.68-33.64-33.65C131.47-3.1 111.39-3.1 99 9.29L9.29 99c-12.38 12.39-12.39 32.47 0 44.86l100.17 100.18zm388.47-116.8c18.76-18.76 18.75-49.17 0-67.93l-45.25-45.25c-18.76-18.76-49.18-18.76-67.95 0l-46.02 46.01 113.2 113.2 46.02-46.03zM316.08 82.71l-297 296.96L.32 487.11c-2.53 14.49 10.09 27.11 24.59 24.56l107.45-18.84L429.28 195.9 316.08 82.71zm186.63 285.43l-33.64-33.64-61.68 61.68c-3.1 3.1-8.12 3.1-11.21 0l-11.21-11.21c-3.09-3.1-3.09-8.12 0-11.21l61.68-61.68-44.14-44.14L267.93 402.5l100.21 100.2c12.39 12.39 32.47 12.39 44.86 0l89.71-89.7c12.39-12.39 12.39-32.47 0-44.86z"/>
                </svg>
                Customize
              </button>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => onViewDetails(machine.id)}
        className="mt-4 text-orange-500 font-black text-sm uppercase tracking-wider hover:underline"
      >
        View All Features
      </button>
    </motion.div>
  );
});

MachineCard.displayName = 'MachineCard';

export default MachineCard;