"use client";

// MachineSpecsTable — gradient highlight cards and grouped spec rows
import React from "react";

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

// Gradient card for a single key spec (capacity, power, etc.)
const SpecCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) => (
  <div
    className={`bg-gradient-to-br ${color} p-3 rounded-lg text-white shadow-lg hover:scale-105 transition-transform duration-300`}
  >
    <div className="text-lg sm:text-xl mb-1">{icon}</div>
    <p className="text-[10px] sm:text-xs opacity-90">{label}</p>
    <p className="font-black text-xs sm:text-sm">{value}</p>
  </div>
);

// Label/value row inside a spec group
const InfoRow = ({ label, value }: any) => (
  <div className="flex justify-between items-center py-2 px-3 bg-white dark:bg-gray-800 rounded-lg text-xs sm:text-sm">
    <span className="font-bold text-gray-600 dark:text-gray-400">{label}:</span>
    <span className="font-black text-green-700 dark:text-white">{value}</span>
  </div>
);

export default function MachineSpecsTable({ machine }: MachineSpecsTableProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg sm:text-xl font-black text-green-700 dark:text-white mb-4 flex items-center gap-2">
        <span className="text-xl">📊</span>
        {"detailPage.techSpecs"}
      </h3>

      {/* Key spec highlight cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
        <SpecCard
          icon="⚙️"
          label={"detailPage.specifications.capacity"}
          value={machine.capacity}
          color="from-blue-500 to-blue-600"
        />
        <SpecCard
          icon="⚡"
          label={"detailPage.specifications.power"}
          value={machine.power}
          color="from-yellow-500 to-yellow-600"
        />
        <SpecCard
          icon="🏋️"
          label={"detailPage.specifications.weight"}
          value={machine.weight || "N/A"}
          color="from-purple-500 to-purple-600"
        />
        <SpecCard
          icon="📏"
          label={"detailPage.specifications.dimensions"}
          value={machine.dimensions || "N/A"}
          color="from-indigo-500 to-indigo-600"
        />
      </div>

      {/* Grouped spec tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General info */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <h4 className="font-black text-green-700 dark:text-white text-sm sm:text-base mb-3 flex items-center gap-2">
            <span className="text-lg">📦</span>
            {"detailPage.specifications.general"}
          </h4>
          <div className="space-y-2">
            <InfoRow
              label={"detailPage.specifications.model"}
              value={machine.name}
            />
            <InfoRow
              label={"detailPage.specifications.machineType"}
              value={machine.type || "Industrial"}
            />
            <InfoRow
              label={"detailPage.specifications.material"}
              value={machine.material || "Industrial Grade"}
            />
            <InfoRow
              label={"detailPage.specifications.warranty"}
              value={machine.warranty || "18 months"}
            />
          </div>
        </div>

        {/* Performance metrics */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <h4 className="font-black text-green-700 dark:text-white text-sm sm:text-base mb-3 flex items-center gap-2">
            <span className="text-lg">🎯</span>
            {"detailPage.specifications.performance"}
          </h4>
          <div className="space-y-2">
            <InfoRow
              label={"detailPage.specifications.extractionRate"}
              value={machine.extractionRate || "N/A"}
            />
            <InfoRow
              label={"detailPage.specifications.waterConsumption"}
              value={machine.waterConsumption || "N/A"}
            />
            <InfoRow
              label={"detailPage.specifications.outputSize"}
              value={machine.fiberThickness || "Varies"}
            />
            <InfoRow
              label={"detailPage.specifications.operation"}
              value={machine.operation || "Continuous"}
            />
          </div>
        </div>

        {/* Operational specs */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <h4 className="font-black text-green-700 dark:text-white text-sm sm:text-base mb-3 flex items-center gap-2">
            <span className="text-lg">🔧</span>
            {"detailPage.specifications.operational"}
          </h4>
          <div className="space-y-2">
            <InfoRow
              label={"detailPage.specifications.rpm"}
              value={machine.rpm || "1440 RPM"}
            />
            <InfoRow
              label={"detailPage.specifications.voltage"}
              value={machine.voltage || "380V, 3 Phase"}
            />
            <InfoRow
              label={"detailPage.specifications.operators"}
              value={machine.operators || "1-2 persons"}
            />
            <InfoRow
              label={"detailPage.specifications.noiseLevel"}
              value={machine.noiseLevel || "< 85 dB"}
            />
          </div>
        </div>

        {/* Input/output material flow */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <h4 className="font-black text-green-700 dark:text-white text-sm sm:text-base mb-3 flex items-center gap-2">
            <span className="text-lg">💧</span>
            {"detailPage.specifications.materialProcessing"}
          </h4>
          <div className="space-y-2">
            <InfoRow
              label={"detailPage.specifications.inputMaterial"}
              value={machine.input}
            />
            <InfoRow
              label={"detailPage.specifications.outputProduct"}
              value={machine.output}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
