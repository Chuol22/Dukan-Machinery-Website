'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
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

interface MachinesCatalogProps {
  machines: Machine[];
  onViewDetails: (machineId: number) => void;
}

export default function MachinesCatalog({ machines, onViewDetails }: MachinesCatalogProps) {
  return (
    <section id="machines-section" className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-green-700 dark:text-white uppercase tracking-tight">
            Our <span className="text-orange-500">Machines</span>
          </h2>
          <div className="w-20 h-1.5 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          <p className="mt-6 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our premium range of industrial machinery designed for maximum efficiency and durability
          </p>
        </div>

        <p className="mb-8 text-gray-500 dark:text-gray-400 text-sm font-black uppercase tracking-wider">
          Showing {machines.length} machines
        </p>

        <div className="space-y-16">
          {machines.map((machine, index) => (
            <motion.div
              key={machine.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-b border-gray-200 dark:border-gray-700 pb-12 last:border-0"
            >
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Image/Video Section */}
                <div>
                  <div className="relative h-60 bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden mb-4 group cursor-pointer">
                    {machine.image.endsWith('.mp4') ? (
                      <video 
                        src={machine.image}
                        className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                        muted
                        loop
                        playsInline
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => e.currentTarget.pause()}
                      />
                    ) : (
                      <img 
                        src={machine.image} 
                        alt={machine.name}
                        className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <button 
                      onClick={() => onViewDetails(machine.id)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <div className="bg-orange-500 text-white p-4 rounded-full shadow-xl transform hover:scale-110 transition">
                        <Play size={40} fill="white" />
                      </div>
                    </button>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 border-transparent hover:border-orange-500 transition cursor-pointer">
                      {machine.image.endsWith('.mp4') ? (
                        <video 
                          src={machine.image}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <img src={machine.image} alt={machine.name} className="w-full h-full object-cover" />
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
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Capacity</p>
                      <p className="font-black text-xs text-green-700 dark:text-white">{machine.capacity}</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Power</p>
                      <p className="font-black text-xs text-green-700 dark:text-white">{machine.power}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs font-black text-green-700 dark:text-white uppercase mb-1">Input</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{machine.input}</p>
                    </div>
                    <div>
                      <p className="text-xs font-black text-green-700 dark:text-white uppercase mb-1">Output</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{machine.output}</p>
                    </div>
                  </div>

                  <div className="mb-6 p-4 bg-green-700/5 dark:bg-gray-700/50 rounded-xl">
                    <p className="text-xs font-black text-green-700 dark:text-white uppercase mb-2">Process</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{machine.process}</p>
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
                          Order Now
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
                View All Features →
              </button>
            </motion.div>
          ))}
        </div>

        {machines.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No machines found</p>
          </div>
        )}
      </div>
    </section>
  );
}