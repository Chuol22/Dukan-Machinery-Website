"use client";

import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import InquiryForm from "./InquiryForm";

type Props = {
  machineId: string | number;
  machineName: string;
  className?: string;
};

export default function AskQuestionButton({ machineId, machineName, className = "" }: Props) {
  const [showForm, setShowForm] = useState(false);

  const handleSuccess = () => {
    setTimeout(() => {
      setShowForm(false);
    }, 3000); // Auto-close after 3 seconds on success
  };

  if (showForm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Ask a Question
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Get expert advice about this machine
              </p>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <InquiryForm
            machineId={String(machineId)}
            machineName={machineName}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className={`flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors ${className}`}
    >
      <MessageSquare className="w-5 h-5" />
      <span>Ask a Question</span>
    </button>
  );
}