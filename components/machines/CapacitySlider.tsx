'use client';

import React from 'react';

interface CapacitySliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
}

export default function CapacitySlider({ min, max, value, onChange, unit = 'kg/hr' }: CapacitySliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-black text-green-700 dark:text-white uppercase tracking-wider">
          Capacity: {value.toLocaleString()} {unit}
        </label>
        <span className="text-xs text-gray-500">
          {min.toLocaleString()} - {max.toLocaleString()} {unit}
        </span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #f97316 0%, #f97316 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
          }}
        />
        <style jsx>{`
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            background: #f97316;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          }
          input[type="range"]::-webkit-slider-thumb:hover {
            transform: scale(1.2);
          }
        `}</style>
      </div>
    </div>
  );
}