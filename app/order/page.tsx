// app/order/page.tsx
import { Suspense } from 'react';
import OrderContent from './OrderContent';

export default function OrderPage() {
  return (
    <Suspense fallback={
      <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading order details...</p>
        </div>
      </div>
    }>
      <OrderContent />
    </Suspense>
  );
}