'use client';

// Machines catalog page — filters, search, grid, and inline detail preview
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MachineFilters from '@/components/machines/MachineFilters';
import MachinesCatalog from '@/components/machines/MachinesCatalog';
import MachineDetailsPreview from '@/components/machines/MachineDetailsPreview';
import { machinesData } from '@/data/machinesData';

type PublicMachine = {
  id: string | number;
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
  available?: boolean;
  availability_status?: string;
  motor_type?: string;
  weight?: string;
  dimensions?: string;
  voltage?: string;
  warranty?: string;
  description?: string;
  features?: string[];
  applications?: string[];
};

export default function MachinesPage() {
  const [machines, setMachines] = useState<PublicMachine[]>(machinesData as PublicMachine[]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedCapacity, setSelectedCapacity] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMachineId, setSelectedMachineId] = useState<string | number | null>(machinesData[0]?.id || null);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const [machinesRes, categoriesRes] = await Promise.all([
          fetch('/api/machines'),
          fetch('/api/categories'),
        ]);

        if (machinesRes.ok) {
          const data = await machinesRes.json();
          if (Array.isArray(data.machines) && data.machines.length > 0) {
            setMachines(data.machines as PublicMachine[]);
          }
        }

        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          const names = Array.isArray(data.categories)
            ? data.categories
                .map((category: { name?: string }) => category.name)
                .filter(Boolean)
            : [];
          setCategories(['All', ...names]);
        }
      } catch {
        setMachines(machinesData as PublicMachine[]);
        setCategories(['All', ...Array.from(new Set(machinesData.map((machine) => machine.category)))]);
      }
    };

    void loadCatalog();
  }, []);

  useEffect(() => {
    if (!machines.length) {
      setSelectedMachineId(null);
      return;
    }

    if (!selectedMachineId || !machines.some((machine) => String(machine.id) === String(selectedMachineId))) {
      setSelectedMachineId(machines[0].id);
    }
  }, [machines, selectedMachineId]);

  // Apply category, type, capacity, and search filters
  const filteredMachines = machines.filter((machine) => {
    const matchesCategory = selectedCategory === 'All' || machine.category === selectedCategory;
    const matchesStage = selectedStage === 'All' || machine.type === selectedStage;
    const matchesSearch = machine.name.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesCapacity = true;
    if (selectedCapacity !== 'All') {
      const capacityValue = parseInt(machine.capacity) || 0;
      if (selectedCapacity === 'Small (<500 kg/hr)') matchesCapacity = capacityValue < 500;
      else if (selectedCapacity === 'Medium (500-2000 kg/hr)') matchesCapacity = capacityValue >= 500 && capacityValue <= 2000;
      else if (selectedCapacity === 'Large (>2000 kg/hr)') matchesCapacity = capacityValue > 2000;
    }

    return matchesCategory && matchesStage && matchesSearch && matchesCapacity;
  });

  // Select machine and scroll to inline preview panel
  const handleViewDetails = (machineId: string | number) => {
    setSelectedMachineId(machineId);
    setTimeout(() => {
      document.getElementById('machine-details-preview')?.scrollIntoView({
        behavior: 'smooth',
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800">
      {/* Hero Section */}
      <section className="relative bg-green-50 dark:bg-gray-900 text-gray-900 dark:text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-white dark:bg-gray-900"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl text-secondary-dark dark:text-white font-black uppercase tracking-tight"
          >
            Machinery <span className="text-orange-500">Catalogue</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '5rem' }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-20 h-2 bg-orange-500 mx-auto mt-4 rounded-full"
          />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Explore our range of high-performance agricultural and industrial machines with detailed specifications.
          </motion.p>
        </div>
      </section>

      {/* Filters Section */}
      <MachineFilters
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStage={selectedStage}
        setSelectedStage={setSelectedStage}
        selectedCapacity={selectedCapacity}
        setSelectedCapacity={setSelectedCapacity}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        totalMachines={filteredMachines.length}
        availableCategories={categories}
      />

      {/* Machines Catalog Section */}
      <MachinesCatalog 
        machines={filteredMachines}
        onViewDetails={handleViewDetails}
      />

      {/* Machine Details Preview Section */}
      {selectedMachineId && (
        <MachineDetailsPreview
          machineId={selectedMachineId}
          allMachines={machines}
        />
      )}
    </div>
  );
}