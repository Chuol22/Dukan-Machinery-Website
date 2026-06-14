"use client";

// MachineFilters — sticky filter bar with search and category selects
import React from "react";

import { Filter, Search, X } from "lucide-react";

interface MachineFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedStage: string;
  setSelectedStage: (value: string) => void;
  selectedCapacity: string;
  setSelectedCapacity: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  totalMachines: number;
  availableCategories?: string[];
}

export default function MachineFilters({
  selectedCategory,
  setSelectedCategory,
  selectedStage,
  setSelectedStage,
  selectedCapacity,
  setSelectedCapacity,
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
  totalMachines,
  availableCategories = [],
}: MachineFiltersProps) {
  // Filter dropdown options
  const categories = [
    "All",
    ...availableCategories.filter((value) => value && value !== "All"),
  ];
  const stages = ["All", "Preparation", "Processing", "Packaging"];
  const capacities = ["All", "Small", "Medium", "Large"];

  return (
    <section className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-md py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex justify-between items-center mb-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-black text-sm"
          >
            <Filter size={18} />
            Filters
          </button>
          <div className="relative flex-1 max-w-xs ml-4">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder={"searchPlaceholder"}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Filters */}
        <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <div className="flex flex-wrap gap-4 p-5 bg-gray-100 dark:bg-gray-700 rounded-2xl">
              {/* Category Filter */}
              <div className="flex items-center gap-3">
                <svg
                  className="text-orange-500"
                  width="20"
                  height="20"
                  viewBox="0 0 512 512"
                  fill="currentColor"
                >
                  <path d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z" />
                </svg>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent text-sm font-black uppercase outline-none dark:text-white cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>

              {/* Stage Filter */}
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="bg-transparent text-sm font-black uppercase outline-none dark:text-white cursor-pointer"
              >
                {stages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>

              <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>

              {/* Capacity Filter */}
              <select
                value={selectedCapacity}
                onChange={(e) => setSelectedCapacity(e.target.value)}
                className="bg-transparent text-sm font-black uppercase outline-none dark:text-white cursor-pointer"
              >
                {capacities.map((cap) => (
                  <option key={cap} value={cap}>
                    {cap}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Search */}
        <div className="hidden lg:flex justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-black uppercase tracking-wider">
            Showing {totalMachines} machines
          </p>
          <div className="relative w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder={"searchPlaceholder"}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
