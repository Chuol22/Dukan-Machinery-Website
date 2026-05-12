// app/order/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Settings } from 'lucide-react';
import StandardOrderForm from '@/components/order/StandardOrderForm';
import CustomRequestForm from '@/components/order/CustomRequestForm';
import OrderSummary from '@/components/order/OrderSummary';

export default function OrderPage() {
  const [orderType, setOrderType] = useState<'standard' | 'custom'>('standard');
  const [orderData, setOrderData] = useState<any>(null);
  const [showSummary, setShowSummary] = useState(false);

  const handleStandardOrderSubmit = (data: any) => {
    setOrderData({ ...data, type: 'standard' });
    setShowSummary(true);
  };

  const handleCustomOrderSubmit = (data: any) => {
    setOrderData({ ...data, type: 'custom' });
    setShowSummary(true);
  };

  const handleNewOrder = () => {
    setOrderData(null);
    setShowSummary(false);
  };

  if (showSummary && orderData) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col">
        <main className="flex-grow">
          <section className="py-20 bg-white dark:bg-gray-800">
            <div className="max-w-4xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <OrderSummary orderData={orderData} type={orderData.type} />
                <div className="mt-6 text-center">
                  <button
                    onClick={handleNewOrder}
                    className="px-8 py-4 bg-secondary-dark text-white font-black text-sm uppercase tracking-widest hover:bg-primary transition-all duration-300 shadow-lg hover:scale-105 hover:shadow-xl rounded-full"
                    aria-label="Place another order"
                  >
                    Place Another Order
                  </button>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col">
      <main className="flex-grow">
        <section className="py-20 bg-green-50 dark:bg-gray-800">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-black text-green-800 dark:text-white uppercase tracking-tight">
                Order & <span className="text-orange-600">Custom Request</span>
              </h2>
              <div className="w-20 h-2 bg-orange-400 mx-auto mt-4 rounded-full"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center mb-8"
            >
              <div className="inline-flex bg-gray-200 dark:bg-gray-800 p-1 rounded-full">
                <button
                  onClick={() => setOrderType('standard')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105 ${
                    orderType === 'standard'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-green-700 dark:text-gray-300 hover:text-orange-500'
                  }`}
                  aria-label="Switch to Standard Order Form"
                >
                  <ShoppingCart className="w-4 h-4" aria-hidden="true" />
                  Standard Order
                </button>
                <button
                  onClick={() => setOrderType('custom')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105 ${
                    orderType === 'custom'
                      ? 'bg-green-800 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary'
                  }`}
                  aria-label="Switch to Custom Request Form"
                >
                  <Settings className="w-4 h-4" aria-hidden="true" />
                  Custom Request
                </button>
              </div>
            </motion.div>

            {orderType === 'standard' && (
              <motion.div
                key="standard-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <StandardOrderForm onSubmit={handleStandardOrderSubmit} />
              </motion.div>
            )}

            {orderType === 'custom' && (
              <motion.div
                key="custom-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CustomRequestForm onSubmit={handleCustomOrderSubmit} />
              </motion.div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
