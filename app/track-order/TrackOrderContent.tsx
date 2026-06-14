// TrackOrderContent — Customer order tracking form and results
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Search, CheckCircle, Clock, Truck, MapPin, AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrderData {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: string;
  paymentStatus: string;
  total: number;
  items: Array<{
    id: string;
    productName: string;
    productSku: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  trackingNumber?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
}

type FormState = "idle" | "loading" | "success" | "error";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function TrackOrderContent() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderNumber.trim()) {
      setErrorMessage("Please enter your order number");
      return;
    }

    if (!email.trim() && !phone.trim()) {
      setErrorMessage("Please enter your email or phone number");
      return;
    }

    setFormState("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/track-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderNumber: orderNumber.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to track order");
      }

      setOrderData(data);
      setFormState("success");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "An error occurred");
      setFormState("error");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "processing":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "cancelled":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "unpaid":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "partial":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          {...fadeInUp}
          className="text-center mb-12"
        >
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Track Your Order
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Enter your order number and contact information to track your shipment
          </p>
        </motion.div>

        {/* Form */}
        <AnimatePresence mode="wait">
          {formState !== "success" && (
            <motion.div
              key="form"
              {...fadeInUp}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Order Number */}
                <div>
                  <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Order Number *
                  </label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="orderNumber"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      placeholder="e.g., ORD-12345"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                      disabled={formState === "loading"}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    disabled={formState === "loading"}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 234 567 8900"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    disabled={formState === "loading"}
                  />
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800 dark:text-red-200">{errorMessage}</p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formState === "loading"}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {formState === "loading" ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Track Order
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* Order Details */}
          {formState === "success" && orderData && (
            <motion.div
              key="order-details"
              {...fadeInUp}
              className="space-y-6"
            >
              {/* Order Summary Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Order #{orderData.orderNumber}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Placed on {new Date(orderData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderData.status)}`}>
                      {orderData.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(orderData.paymentStatus)}`}>
                      {orderData.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Tracking Info */}
                {orderData.trackingNumber && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="w-5 h-5 text-orange-500" />
                      <span className="font-semibold text-gray-900 dark:text-white">Tracking Number</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-mono">{orderData.trackingNumber}</p>
                  </div>
                )}

                {/* Order Items */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {orderData.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{item.productName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {item.productSku}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.quantity} × ${item.price.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ${item.total.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-orange-500">
                      ${orderData.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Order Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Order Placed</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(orderData.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {orderData.status !== "pending" && (
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Processing</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Your order is being prepared</p>
                      </div>
                    </div>
                  )}

                  {orderData.shippedAt && (
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <Truck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Shipped</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(orderData.shippedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {orderData.deliveredAt && (
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Delivered</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(orderData.deliveredAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Track Another Order Button */}
              <button
                onClick={() => {
                  setFormState("idle");
                  setOrderData(null);
                  setOrderNumber("");
                  setEmail("");
                  setPhone("");
                  setErrorMessage("");
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Track Another Order
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
