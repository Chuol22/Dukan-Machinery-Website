'use client';

// MachineDetailsPreview — tabbed detail panel with thumbnail machine picker
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface Machine {
  id: number;
  slug: string;
  name: string;
  image: string;
  gallery?: string[];
  category: string;
  type: string;
  capacity: string;
  power: string;
  input: string;
  output: string;
  process: string;
  price: string;
}

interface MachineDetailsPreviewProps {
  machineId: number;
  allMachines: Machine[];
}

// Tab nav button with active underline state
const TabButton = ({ active, onClick, children, icon }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 pb-3 px-2 font-black text-xs sm:text-sm uppercase tracking-wider transition border-b-2 ${
      active 
        ? 'border-orange-500 text-orange-500' 
        : 'border-transparent text-gray-500 hover:text-green-700 dark:hover:text-white'
    }`}
  >
    <span className="text-sm">{icon}</span>
    <span className="hidden sm:inline">{children}</span>
  </button>
);

// Single maintenance task row with priority badge
const MaintenanceItem = ({ title, priority, frequency }: any) => {
  const priorityColors: Record<string, string> = {
    High: 'bg-red-100 text-red-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Low: 'bg-green-100 text-green-700'
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start gap-3">
        <div className="text-orange-500 text-lg mt-1">🔧</div>
        <div className="flex-1">
          <h4 className="font-black text-green-700 dark:text-white text-xs sm:text-sm">{title}</h4>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${priorityColors[priority]}`}>
              {priority}
            </span>
            <span className="text-[10px] text-gray-500 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 512 512" fill="currentColor">
                <path d="M256,8C119,8,8,119,8,256S119,504,256,504,504,393,504,256,393,8,256,8Zm92.49,313h0l-20,25a16,16,0,0,1-22.49,2.5h0l-67-49.72a40,40,0,0,1-15-31.23V112a16,16,0,0,1,16-16h32a16,16,0,0,1,16,16V256l58,42.5A16,16,0,0,1,348.49,321Z"/>
              </svg>
              {frequency}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MachineDetailsPreview({ machineId, allMachines }: MachineDetailsPreviewProps) {
  // Active tab and selected thumbnail index
  const [activeTab, setActiveTab] = useState('maintenance');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Lookup machine from catalog by ID
  const machine = allMachines.find(m => m.id === machineId);
  if (!machine) return null;

  // Detail panel tab definitions
  const tabs = [
    { id: 'specifications', label: 'Specifications', icon: '📊' },
    { id: 'process', label: 'Process Diagram', icon: '⚙️' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { id: 'warranty', label: 'Warranty', icon: '🛡️' },
  ];

  // Scheduled maintenance checklist
  const maintenanceTasks = [
    { title: 'Clean blades and rollers', priority: 'High', frequency: 'Daily' },
    { title: 'Lubricate bearings', priority: 'Medium', frequency: 'Weekly' },
    { title: 'Check drive belts tension', priority: 'Medium', frequency: 'Weekly' },
    { title: 'Inspect blades for wear', priority: 'High', frequency: 'Monthly' },
    { title: 'Clean motor ventilation', priority: 'Medium', frequency: 'Monthly' },
    { title: 'Professional service', priority: 'Low', frequency: 'Quarterly' },
  ];

  // Get first 17 machines for thumbnail grid
  const thumbnailMachines = allMachines.slice(0, 17);

  return (
    <section id="machine-details-preview" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-green-700 dark:text-white uppercase tracking-tight">
            Machine <span className="text-orange-500">Details</span>
          </h2>
          <div className="w-16 h-1 bg-orange-500 mx-auto mt-3 rounded-full"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Detailed technical specifications and features of our industrial machines.
          </p>
        </div>

        {/* Thumbnail Grid */}
        <div className="mb-8">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9 gap-2">
            {thumbnailMachines.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => setSelectedImageIndex(idx)}
                className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 hover:z-10 ${
                  selectedImageIndex === idx 
                    ? 'border-orange-500 shadow-lg scale-105 ring-4 ring-orange-500/20' 
                    : 'border-transparent hover:border-orange-500/50 hover:scale-105 hover:shadow-md'
                }`}
              >
                {m.image.endsWith('.mp4') ? (
                  <video 
                    src={m.image}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img 
                    src={m.image} 
                    alt={m.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
                <div className={`absolute inset-0 ${selectedImageIndex === idx ? 'bg-orange-500/10' : ''}`}></div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-[8px] text-white font-black truncate text-center">
                    {m.name.split(' ').slice(0, 2).join(' ')}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-green-900 to-green-800 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-2xl bg-white p-3 shadow-2xl transform hover:scale-105 transition-all duration-500 hover:rotate-2">
                <div className="w-full h-full rounded-xl overflow-hidden">
                  {(thumbnailMachines[selectedImageIndex]?.image || machine.image).endsWith('.mp4') ? (
                    <video 
                      src={thumbnailMachines[selectedImageIndex]?.image || machine.image}
                      className="w-full h-full object-contain"
                      muted
                      loop
                      playsInline
                      controls
                    />
                  ) : (
                    <img 
                      src={thumbnailMachines[selectedImageIndex]?.image || machine.image} 
                      alt={machine.name}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 drop-shadow-lg">
                  {thumbnailMachines[selectedImageIndex]?.name || machine.name}
                </h1>
                <div className="inline-block bg-orange-500 px-4 py-2 rounded-full">
                  <p className="text-sm font-black text-white">
                    {thumbnailMachines[selectedImageIndex]?.type || machine.type} Equipment
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-4 pt-4 overflow-x-auto">
            <div className="flex gap-2 sm:gap-4 min-w-max">
              {tabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  active={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  icon={tab.icon}
                >
                  {tab.label}
                </TabButton>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            <AnimatePresence mode="wait">
              {/* Specifications Tab */}
              {activeTab === 'specifications' && (
                <motion.div
                  key="specs"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h3 className="text-lg sm:text-xl font-black text-green-700 dark:text-white mb-4 flex items-center gap-2">
                    📊 Technical Specifications
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg text-white shadow-sm hover:scale-105 transition">
                      <div className="text-xl mb-1">⚙️</div>
                      <p className="text-[10px] opacity-90">Capacity</p>
                      <p className="font-black text-xs">{machine.capacity}</p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 rounded-lg text-white shadow-sm hover:scale-105 transition">
                      <div className="text-xl mb-1">⚡</div>
                      <p className="text-[10px] opacity-90">Power</p>
                      <p className="font-black text-xs">{machine.power}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-lg text-white shadow-sm hover:scale-105 transition">
                      <div className="text-xl mb-1">🏋️</div>
                      <p className="text-[10px] opacity-90">Weight</p>
                      <p className="font-black text-xs">850 kg</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 rounded-lg text-white shadow-sm hover:scale-105 transition">
                      <div className="text-xl mb-1">📏</div>
                      <p className="text-[10px] opacity-90">Dimensions</p>
                      <p className="font-black text-xs">2.5×1.2×1.8m</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <h4 className="font-black text-green-700 dark:text-white mb-3 flex items-center gap-2">
                        📦 General
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between py-2 px-3 bg-white dark:bg-gray-800 rounded-lg text-sm">
                          <span className="font-bold">Model:</span>
                          <span className="font-black">{machine.name.split(' ').slice(0, 2).join(' ')}</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 bg-white dark:bg-gray-800 rounded-lg text-sm">
                          <span className="font-bold">Type:</span>
                          <span className="font-black">{machine.type}</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 bg-white dark:bg-gray-800 rounded-lg text-sm">
                          <span className="font-bold">Material:</span>
                          <span className="font-black">Stainless Steel 304</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 bg-white dark:bg-gray-800 rounded-lg text-sm">
                          <span className="font-bold">Warranty:</span>
                          <span className="font-black">18 months</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <h4 className="font-black text-green-700 dark:text-white mb-3 flex items-center gap-2">
                        🎯 Performance
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between py-2 px-3 bg-white dark:bg-gray-800 rounded-lg text-sm">
                          <span className="font-bold">Extraction Rate:</span>
                          <span className="font-black">95%</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 bg-white dark:bg-gray-800 rounded-lg text-sm">
                          <span className="font-bold">Water Consumption:</span>
                          <span className="font-black">500 L/ton</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 bg-white dark:bg-gray-800 rounded-lg text-sm">
                          <span className="font-bold">RPM:</span>
                          <span className="font-black">1440 RPM</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 bg-white dark:bg-gray-800 rounded-lg text-sm">
                          <span className="font-bold">Voltage:</span>
                          <span className="font-black">380V, 3 Phase</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Process Diagram Tab */}
              {activeTab === 'process' && (
                <motion.div
                  key="process"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h3 className="text-lg sm:text-xl font-black text-green-700 dark:text-white mb-4 flex items-center gap-2">
                    ⚙️ Production Process Flow
                  </h3>
                  <div className="mb-6 p-4 bg-green-700/5 dark:bg-gray-700/50 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {machine.process}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {machine.process.split('→').map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition">
                        <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-sm">
                          {idx + 1}
                        </div>
                        <span className="text-sm font-medium text-green-700 dark:text-white">{step.trim()}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Maintenance Tab */}
              {activeTab === 'maintenance' && (
                <motion.div
                  key="maintenance"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h3 className="text-lg sm:text-xl font-black text-green-700 dark:text-white mb-4 flex items-center gap-2">
                    🔧 Maintenance Requirements
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {maintenanceTasks.map((task, idx) => (
                      <MaintenanceItem key={idx} {...task} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Warranty Tab */}
              {activeTab === 'warranty' && (
                <motion.div
                  key="warranty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h3 className="text-lg sm:text-xl font-black text-green-700 dark:text-white mb-4 flex items-center gap-2">
                    🛡️ Warranty & Support
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition">
                      <h4 className="font-black text-green-700 dark:text-white mb-2 flex items-center gap-2">
                        🏆 Standard Warranty
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        18 months comprehensive warranty covering manufacturing defects and material quality.
                      </p>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition">
                      <h4 className="font-black text-green-700 dark:text-white mb-2 flex items-center gap-2">
                        🎧 Technical Support
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        24/7 phone and email support. On-site service available within 48 hours.
                      </p>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition">
                      <h4 className="font-black text-green-700 dark:text-white mb-2 flex items-center gap-2">
                        🚚 Spare Parts
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Genuine spare parts available with express shipping worldwide.
                      </p>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition">
                      <h4 className="font-black text-green-700 dark:text-white mb-2 flex items-center gap-2">
                        ⏰ Lifetime Support
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Free technical consultation and training for the lifetime of the machine.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CTA Section */}
          <div className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
              <div className="text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-black text-green-700 dark:text-white">Ready to get started?</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Order or request a custom configuration</p>
              </div>
              <div className="flex gap-3">
                <Link href={`/order?machine=${machine.id}`}>
                  <button className="bg-orange-500 text-white font-black px-5 py-2.5 rounded-full text-xs uppercase tracking-widest hover:bg-orange-600 transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2">
                    Order Now
                    <ChevronRight size={16} className="animate-bounce" />
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="border-2 border-green-700 text-green-700 dark:border-white dark:text-white font-black px-5 py-2.5 rounded-full text-xs uppercase tracking-widest hover:bg-green-700 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    Contact Engineer
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}