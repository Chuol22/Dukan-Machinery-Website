"use client";

// RelatedMachines — same-category machine suggestions grid
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { getRelatedMachines } from "@/data/machinesData";

interface RelatedMachinesProps {
  currentMachineId: number;
  category: string;
}

export default function RelatedMachines({
  currentMachineId,
  category,
}: RelatedMachinesProps) {
  // Fetch related machines excluding current
  const relatedMachines = getRelatedMachines(currentMachineId, category);

  if (relatedMachines.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-12">
      <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
        {/* Section title */}
        <h3 className="text-2xl font-black text-green-700 dark:text-white mb-6 text-center">
          Related Machines
        </h3>
        {/* Related machine cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedMachines.map((machine, index) => (
            <motion.div
              key={machine.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Link href={`/machines/${machine.slug}`}>
                <div className="relative h-48 overflow-hidden">
                  {machine.image && (machine.image.endsWith(".mp4") || machine.image.endsWith(".webm")) ? (
                    <video
                      src={machine.image}
                      muted
                      playsInline
                      loop
                      preload="none"
                      onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                      onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : machine.image ? (
                    <img
                      src={machine.image}
                      alt={machine.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-black text-green-700 dark:text-white mb-2 line-clamp-2">
                    {machine.name}
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-orange-500/10 text-orange-600 text-xs font-black px-2 py-1 rounded-full">
                      {machine.category}
                    </span>
                    <span className="bg-green-700/10 text-green-700 dark:text-white text-xs font-black px-2 py-1 rounded-full">
                      {machine.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Click to view
                    </span>
                    <ChevronRight
                      size={16}
                      className="text-orange-500 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
