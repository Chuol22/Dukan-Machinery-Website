// Track Order page — Customer order tracking with order number + email/phone
import { Suspense } from "react";
import { Metadata } from "next";
import TrackOrderContent from "./TrackOrderContent";

export const metadata: Metadata = {
  title: "Track Your Order | Dukan Machinery",
  description: "Track your machinery order status by entering your order number and contact information.",
  robots: "index, follow",
};

function TrackOrderLoading() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
        <div className="mt-6 space-y-2 animate-pulse">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Loading order tracking...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please wait while we prepare the tracking form
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<TrackOrderLoading />}>
      <TrackOrderContent />
    </Suspense>
  );
}
