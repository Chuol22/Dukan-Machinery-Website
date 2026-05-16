'use client';

import React from 'react';
import MachineCard from './MachineCard';

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

function MachinesCatalog({ machines, onViewDetails }: MachinesCatalogProps) {
  return (
    <section id="machines-section" className="py-20 bg-white dark:bg-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-green-700 dark:text-white uppercase tracking-tight">
            Machinery <span className="text-orange-500">Catalogue</span>
          </h2>
          <div className="w-20 h-1.5 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          <p className="mt-6 text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Explore our range of high-performance agricultural and industrial machines with detailed specifications.
          </p>
        </div>

        <p className="mb-8 text-neutral-500 dark:text-neutral-400 text-sm font-black uppercase tracking-wider">
          Showing {machines.length} machines
        </p>

        <div className="space-y-16">
          {machines.map((machine) => (
            <MachineCard
              key={machine.id}
              machine={machine}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>

        {machines.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No machines found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default React.memo(MachinesCatalog);