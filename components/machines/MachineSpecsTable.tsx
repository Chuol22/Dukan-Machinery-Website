'use client';

import React from 'react';

interface Machine {
  name: string;
  capacity: string;
  power: string;
  type?: string;
  weight?: string;
  dimensions?: string;
  voltage?: string;
  rpm?: string;
  material?: string;
  warranty?: string;
  extractionRate?: string;
  waterConsumption?: string;
  fiberThickness?: string;
  operation?: string;
  noiseLevel?: string;
  operators?: string;
  input: string;
  output: string;
}

interface MachineSpecsTableProps {
  machine: Machine;
}

const SpecCard = ({ icon, label, value, color }: any) => (
  <div className={`bg-gradient-to-br ${color} p-3 rounded-lg text-white shadow-lg hover:scale-105 transition-transform duration-300`}>
    <div className="text-lg sm:text-xl mb-1">{icon}</div>
    <p className="text-[10px] sm:text-xs opacity-90">{label}</p>
    <p className="font-black text-xs sm:text-sm">{value}</p>
  </div>
);

const InfoRow = ({ label, value }: any) => (
  <div className="flex justify-between items-center py-2 px-3 bg-white dark:bg-gray-800 rounded-lg text-xs sm:text-sm">
    <span className="font-bold text-neutral-600 dark:text-gray-400">{label}:</span>
    <span className="font-black text-green-700 dark:text-white">{value}</span>
  </div>
);

export default function MachineSpecsTable({ machine }: MachineSpecsTableProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg sm:text-xl font-black text-green-700 dark:text-white mb-4 flex items-center gap-2">
        <span className="text-xl">📊</span>
        Technical Specifications
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
        <SpecCard 
          icon="⚙️"
          label="Capacity"
          value={machine.capacity}
          color="from-blue-500 to-blue-600"
        />
        <SpecCard 
          icon="⚡"
          label="Power"
          value={machine.power}
          color="from-yellow-500 to-yellow-600"
        />
        <SpecCard 
          icon="🏋️"
          label="Weight"
          value={machine.weight || 'N/A'}
          color="from-purple-500 to-purple-600"
        />
        <SpecCard 
          icon="📏"
          label="Dimensions"
          value={machine.dimensions || 'N/A'}
          color="from-indigo-500 to-indigo-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neutral-50 dark:bg-neutral-700/50 rounded-xl p-4">
          <h4 className="font-black text-green-700 dark:text-white text-sm sm:text-base mb-3 flex items-center gap-2">
            <span className="text-lg">📦</span>
            General
          </h4>
          <div className="space-y-2">
            <InfoRow label="Model" value={machine.name.split(' ').slice(0, 2).join(' ')} />
            <InfoRow label="Machine Type" value={machine.type || 'Industrial'} />
            <InfoRow label="Material" value={machine.material || 'Industrial Grade'} />
            <InfoRow label="Warranty" value={machine.warranty || '18 months'} />
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-700/50 rounded-xl p-4">
          <h4 className="font-black text-green-700 dark:text-white text-sm sm:text-base mb-3 flex items-center gap-2">
            <span className="text-lg">🎯</span>
            Performance
          </h4>
          <div className="space-y-2">
            <InfoRow label="Extraction Rate" value={machine.extractionRate || 'N/A'} />
            <InfoRow label="Water Consumption" value={machine.waterConsumption || 'N/A'} />
            <InfoRow label="Output Size" value={machine.fiberThickness || 'Varies'} />
            <InfoRow label="Operation" value={machine.operation || 'Continuous'} />
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-700/50 rounded-xl p-4">
          <h4 className="font-black text-green-700 dark:text-white text-sm sm:text-base mb-3 flex items-center gap-2">
            <span className="text-lg">🔧</span>
            Operational
          </h4>
          <div className="space-y-2">
            <InfoRow label="RPM" value={machine.rpm || '1440 RPM'} />
            <InfoRow label="Voltage" value={machine.voltage || '380V, 3 Phase'} />
            <InfoRow label="Operators Required" value={machine.operators || '1-2 persons'} />
            <InfoRow label="Noise Level" value={machine.noiseLevel || '< 85 dB'} />
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-700/50 rounded-xl p-4">
          <h4 className="font-black text-green-700 dark:text-white text-sm sm:text-base mb-3 flex items-center gap-2">
            <span className="text-lg">💧</span>
            Material Processing
          </h4>
          <div className="space-y-2">
            <InfoRow label="Input Material" value={machine.input} />
            <InfoRow label="Output Product" value={machine.output} />
          </div>
        </div>
      </div>
    </div>
  );
}