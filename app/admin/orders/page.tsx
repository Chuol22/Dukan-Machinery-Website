'use client';

// Admin orders page — hydration guard and Suspense wrapper
import { Suspense, useEffect, useState } from 'react';
import OrdersClient from './OrdersClient';

export default function OrdersPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Orders</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Loading orders...
          </p>
        </div>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Orders</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Accept or reject incoming order requests. Customer will be notified via email.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          </div>
        }
      >
        <OrdersClient />
      </Suspense>
    </div>
  );
}