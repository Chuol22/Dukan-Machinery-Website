// Order page — SEO metadata and Suspense wrapper for order form
import { Suspense } from 'react';
import { Metadata } from 'next';
import OrderContent from './OrderContent';

// Add metadata for better SEO
export const metadata: Metadata = {
  title: 'Order Equipment | Dukan Machinery',
  description: 'Order agricultural machinery and equipment from Dukan Machinery. Standard orders and custom requests available.',
  robots: 'index, follow',
};

// Loading component for better reusability
function OrderPageLoading() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Animated spinner */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-t-green-500 border-r-transparent border-b-transparent border-l-transparent animate-spin animation-delay-150"></div>
        </div>
        
        {/* Loading text with fade animation */}
        <div className="mt-6 space-y-2 animate-pulse">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Loading order form...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please wait while we prepare your ordering experience
          </p>
        </div>
        
        {/* Subtle loading indicators */}
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={<OrderPageLoading />}>
      <OrderContent />
    </Suspense>
  );
}