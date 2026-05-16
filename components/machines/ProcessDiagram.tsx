import React from 'react';

interface ProcessDiagramProps {
  process: string;
}

export default function ProcessDiagram({ process }: ProcessDiagramProps) {
  const steps = process.split('→').map(step => step.trim());

  return (
    <div className="bg-neutral-50 dark:bg-neutral-700/50 rounded-xl p-6">
      <h3 className="text-lg sm:text-xl font-black text-green-700 dark:text-white mb-4 flex items-center gap-2">
        <span className="text-xl">⚙️</span>
        Production Process Flow
      </h3>
      
      <div className="mb-6 p-4 bg-green-700/5 dark:bg-neutral-700 rounded-xl">
        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
          {process}
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-800 rounded-lg hover:shadow-md transition-shadow">
            <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-sm">
              {index + 1}
            </div>
            <span className="text-sm font-medium text-green-700 dark:text-white flex-1">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}