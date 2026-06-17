"use client";

import { useState } from "react";
import { machinesData } from "@/data/machinesData";

export default function TestVideosPage() {
  const [loadStatus, setLoadStatus] = useState<Record<number, string>>({});

  const handleVideoLoad = (id: number) => {
    setLoadStatus(prev => ({ ...prev, [id]: "loaded" }));
  };

  const handleVideoError = (id: number, error: any) => {
    console.error(`Video ${id} error:`, error);
    setLoadStatus(prev => ({ ...prev, [id]: "error" }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Video Loading Test - All Machines
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machinesData.map((machine) => {
            const isVideo = machine.image.includes(".mp4") || machine.image.includes("cloudinary.com/video");
            return (
              <div key={machine.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                <h3 className="font-bold text-sm mb-2 text-gray-900 dark:text-white truncate">
                  {machine.id}. {machine.name}
                </h3>
                
                <div className="relative bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-2" style={{ height: "200px" }}>
                  {isVideo ? (
                    <video
                      src={machine.image}
                      className="w-full h-full object-contain"
                      controls
                      preload="metadata"
                      crossOrigin="anonymous"
                      poster={machine.gallery?.[0] || "/images/machines/Custom Industrial Machines.jpg"}
                      onLoadedData={() => handleVideoLoad(machine.id)}
                      onError={(e) => handleVideoError(machine.id, e)}
                    />
                  ) : (
                    <img
                      src={machine.image}
                      alt={machine.name}
                      className="w-full h-full object-contain"
                      onLoad={() => handleVideoLoad(machine.id)}
                      onError={(e) => handleVideoError(machine.id, e)}
                    />
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Type:</strong> {isVideo ? "Video" : "Image"}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    <strong>URL:</strong> {machine.image}
                  </p>
                  <p className={`text-xs font-bold ${
                    loadStatus[machine.id] === "loaded" 
                      ? "text-green-600" 
                      : loadStatus[machine.id] === "error"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}>
                    Status: {loadStatus[machine.id] || "loading..."}
                  </p>
                  {machine.gallery?.[0] && (
                    <p className="text-xs text-gray-500 truncate">
                      <strong>Poster:</strong> {machine.gallery[0]}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h2 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Debug Info:</h2>
          <pre className="text-xs text-blue-800 dark:text-blue-200 overflow-auto">
            {JSON.stringify({
              total: machinesData.length,
              loaded: Object.values(loadStatus).filter(s => s === "loaded").length,
              errors: Object.values(loadStatus).filter(s => s === "error").length,
              pending: machinesData.length - Object.keys(loadStatus).length,
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}