"use client";

// Machine detail page — gallery, specs tabs, and related machines
import React, { useState, use } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight } from "lucide-react";
import MachineGallery from "@/components/machines/MachineGallery";
import MachineSpecsTable from "@/components/machines/MachineSpecsTable";
import ProcessDiagram from "@/components/machines/ProcessDiagram";
import RelatedMachines from "@/components/machines/RelatedMachines";
import AskQuestionButton from "@/components/AskQuestionButton";
import { getMachineBySlug, getAllMachineSlugs } from "@/data/machinesData";
import EnhancedVideo from "@/components/EnhancedVideo";

// Tab components
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon: React.ReactNode;
}

const TabButton = ({ active, onClick, children, icon }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 pb-3 px-2 font-black text-xs sm:text-sm uppercase tracking-wider transition border-b-2 ${
      active
        ? "border-orange-500 text-orange-500"
        : "border-transparent text-neutral-500 hover:text-green-700 dark:hover:text-white"
    }`}
  >
    <span className="text-sm">{icon}</span>
    <span className="hidden sm:inline">{children}</span>
  </button>
);

export default function MachineDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const { slug } = use(params);
  const machine = getMachineBySlug(slug);
  const [activeTab, setActiveTab] = useState("specifications"); // specs | process | features

  if (!machine) {
    notFound();
  }

  // Tab labels for specs, process flow, and features
  const tabs = [
    {
      id: "specifications",
      label: "Specifications",
      icon: <span className="text-sm">📊</span>,
    },
    {
      id: "process",
      label: "Process Diagram",
      icon: <span className="text-sm">⚙️</span>,
    },
    {
      id: "features",
      label: "Features",
      icon: <span className="text-sm">⭐</span>,
    },
    {
      id: "maintenance",
      label: "Maintenance",
      icon: <span className="text-sm">🔧</span>,
    },
    {
      id: "warranty",
      label: "Warranty",
      icon: <span className="text-sm">🛡️</span>,
    },
  ];

  // Build list of distinct gallery items
  const galleryImages = Array.from(new Set([machine.image, ...(machine.gallery || [])].filter(Boolean)));

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-800">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-green-700 dark:text-white hover:text-orange-500 transition font-black text-sm"
        >
          <ArrowLeft size={18} />
          Back to Machines
        </button>
      </div>

      {/* Machine Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-gradient-to-br from-green-950 via-green-900 to-green-950 rounded-2xl p-6 sm:p-8 border-b-4 border-orange-500 shadow-xl">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 drop-shadow-lg uppercase tracking-tight">
              {machine.name}
            </h1>
            <div className="inline-block bg-orange-500 px-4 py-1.5 rounded-full shadow-md">
              <p className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                {machine.type} Equipment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Details Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Media Gallery */}
          <div className="lg:col-span-5">
            <MachineGallery images={galleryImages} productName={machine.name} />
          </div>

          {/* Right Column: specifications & tabs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tabs Navigation */}
            <div className="border-b border-neutral-200 dark:border-neutral-700 overflow-x-auto">
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
            <AnimatePresence mode="wait">
              {activeTab === "specifications" && (
                <motion.div
                  key="specs"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <MachineSpecsTable machine={machine} />
                </motion.div>
              )}

              {activeTab === "process" && (
                <motion.div
                  key="process"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ProcessDiagram process={machine.process} />
                </motion.div>
              )}

              {activeTab === "features" && (
                <motion.div
                  key="features"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-neutral-50 dark:bg-neutral-750 p-6 rounded-xl border border-neutral-200/40 dark:border-neutral-700/40">
                    <h3 className="text-lg sm:text-xl font-black text-green-700 dark:text-white mb-4 flex items-center gap-2">
                      <span className="text-xl">⭐</span>
                      Key Features
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(
                        machine.features || [
                          "Heavy-duty construction",
                          "Energy efficient motor",
                          "Easy maintenance",
                          "Safety guards included",
                          "CE Certified",
                          "24/7 technical support",
                        ]
                      ).map((feature: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-2">
                          <svg
                            className="w-5 h-5 text-orange-500 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm text-neutral-600 dark:text-neutral-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-neutral-50 dark:bg-neutral-750 p-6 rounded-xl border border-neutral-200/40 dark:border-neutral-700/40">
                    <h3 className="text-lg sm:text-xl font-black text-green-700 dark:text-white mb-4 flex items-center gap-2">
                      <span className="text-xl">📦</span>
                      Applications
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(
                        machine.applications || [
                          "Agricultural processing",
                          "Commercial production",
                          "Industrial manufacturing",
                          "Small to medium enterprises",
                        ]
                      ).map((app: string, index: number) => (
                        <span
                          key={index}
                          className="bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-black px-3 py-1 rounded-full"
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "maintenance" && (
                <motion.div
                  key="maintenance"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-neutral-50 dark:bg-neutral-750 p-6 rounded-xl border border-neutral-200/40 dark:border-neutral-700/40"
                >
                  <h3 className="text-lg sm:text-xl font-black text-green-700 dark:text-white mb-4 flex items-center gap-2">
                    <span className="text-xl">🔧</span>
                    Maintenance Schedule
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700">
                      <h4 className="font-black text-green-700 dark:text-white mb-2">
                        Daily Checks
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-neutral-600 dark:text-neutral-300">
                        <li>Check oil levels and lubricate moving parts</li>
                        <li>Inspect belts and chains for tension and wear</li>
                        <li>Clean machine surfaces and remove debris</li>
                        <li>Verify safety guards are in place</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700">
                      <h4 className="font-black text-green-700 dark:text-white mb-2">
                        Weekly Maintenance
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-neutral-600 dark:text-neutral-300">
                        <li>Inspect all bolts and tighten if necessary</li>
                        <li>Check electrical connections</li>
                        <li>Clean or replace air filters</li>
                        <li>Test emergency stop systems</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700">
                      <h4 className="font-black text-green-700 dark:text-white mb-2">
                        Monthly Service
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-neutral-600 dark:text-neutral-300">
                        <li>Complete machine inspection by technician</li>
                        <li>Replace worn parts</li>
                        <li>Calibrate control systems</li>
                        <li>Update service records</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "warranty" && (
                <motion.div
                  key="warranty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-neutral-50 dark:bg-neutral-750 p-6 rounded-xl border border-neutral-200/40 dark:border-neutral-700/40"
                >
                  <h3 className="text-lg sm:text-xl font-black text-green-700 dark:text-white mb-4 flex items-center gap-2">
                    <span className="text-xl">🛡️</span>
                    Warranty & Support
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700">
                      <h4 className="font-black text-green-700 dark:text-white mb-2 flex items-center gap-2">
                        <span>🏆</span>
                        Standard Warranty
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300">
                        {machine.warranty || "18 months"} comprehensive warranty
                        covering manufacturing defects and material quality.
                      </p>
                    </div>
                    <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700">
                      <h4 className="font-black text-green-700 dark:text-white mb-2 flex items-center gap-2">
                        <span>🎧</span>
                        Technical Support
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300">
                        24/7 phone and email support. On-site service available
                        within 48 hours.
                      </p>
                    </div>
                    <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700">
                      <h4 className="font-black text-green-700 dark:text-white mb-2 flex items-center gap-2">
                        <span>🚚</span>
                        Spare Parts
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300">
                        Genuine spare parts available with express shipping
                        worldwide.
                      </p>
                    </div>
                    <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700">
                      <h4 className="font-black text-green-700 dark:text-white mb-2 flex items-center gap-2">
                        <span>⏰</span>
                        Lifetime Support
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300">
                        Free technical consultation and training for the lifetime of
                        the machine.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-neutral-100 dark:bg-neutral-700 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-black text-green-700 dark:text-white">
                Ready to get started?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                Order or request a custom configuration
              </p>
            </div>
            <div className="flex gap-3">
              <AskQuestionButton 
                machineId={machine.id}
                machineName={machine.name}
                className="w-auto"
              />
              <Link href={`/order?machine=${machine.id}`}>
                <button className="bg-orange-500 text-white font-black px-5 py-2.5 rounded-full text-xs uppercase tracking-widest hover:bg-orange-600 transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2">
                  Order Now
                  <ChevronRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
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
      </section>

      {/* Related Machines */}
      <RelatedMachines
        currentMachineId={machine.id}
        category={machine.category}
      />
    </div>
  );
}
