// OrderContent — standard vs custom order flow with API submission
"use client";

import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Settings,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import StandardOrderForm from "@/components/order/StandardOrderForm";
import CustomRequestForm, {
  CustomRequestData,
} from "@/components/order/CustomRequestForm";
import OrderSummary from "@/components/order/OrderSummary";

// ============================================
// TYPES
// ============================================
type StandardOrderSubmitData = {
  machineId: string;
  machineName?: string;
  unitPrice?: number;
  totalPrice?: number;
  quantity: number;
  customerInfo: {
    fullName: string;
    companyName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  deliveryInfo: {
    preferredDate: string;
    deliveryAddress: string;
    specialInstructions: string;
  };
  paymentMethod: "bank_transfer" | "letter_of_credit" | "credit_card";
  termsAccepted: boolean;
};

type RequiredCapacity = {
  value?: string;
  unit?: string;
};

// Convert CustomRequestData -> the value shape expected by OrderSummary (string)



type OrderSummaryData =
  | (
      | (StandardOrderSubmitData & {
          type: "standard";
          orderId?: string;
          status?: string;
          submittedAt?: Date;
        })
      | (CustomRequestData & {
          type: "custom";
          orderId?: string;
          status?: string;
          submittedAt?: Date;
          requiredCapacity?: {
            // match OrderSummary's display type
            value?: string;
            unit?: "kg/day" | "tons/day" | "quintals/day" | string;
          };
        })
    );





type SubmissionState = "idle" | "submitting" | "success" | "error";

// ============================================
// ANIMATION VARIANTS
// ============================================
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function OrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get preselected machine from URL query param
  const preselectedMachineId = useMemo(() => {
    const machine = searchParams?.get("machine");
    return machine ? String(machine) : undefined;
  }, [searchParams]);

  // State management
  const [orderType, setOrderType] = useState<"standard" | "custom">("standard");
  const [orderData, setOrderData] = useState<OrderSummaryData | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handler for standard order submission
  const handleStandardOrderSubmit = useCallback(
    async (data: StandardOrderSubmitData) => {
      setSubmissionState("submitting");
      setErrorMessage(null);

      try {
        const orderId = `DKM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const orderWithMeta: OrderSummaryData = {
          ...data,
          type: "standard",
          orderId,
          submittedAt: new Date(),
          status: "pending",
        };

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setOrderData(orderWithMeta);
        setShowSummary(true);
        setSubmissionState("success");
        setTimeout(() => setSubmissionState("idle"), 2000);
      } catch (error) {
        console.error("Order submission error:", error);
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to submit order"
        );
        setSubmissionState("error");
        setTimeout(() => setSubmissionState("idle"), 3000);
      }
    },
    []
  );

  // Handler for custom order submission
  const handleCustomOrderSubmit = useCallback(
    async (data: CustomRequestData) => {



      setSubmissionState("submitting");
      setErrorMessage(null);

      try {
        const orderId = `CST-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const orderWithMeta: OrderSummaryData = {
          ...data,
          type: "custom",
          // normalize capacity.value to string for OrderSummary
          requiredCapacity: {
            // CustomRequestData carries number|string union depending on form; normalize to string
            value:
              data.requiredCapacity && "value" in data.requiredCapacity
                ? String((data.requiredCapacity as { value: unknown }).value)
                : "",
            unit:
              data.requiredCapacity && "unit" in data.requiredCapacity
                ? String((data.requiredCapacity as { unit: unknown }).unit)
                : "",
          },

          orderId,
          submittedAt: new Date(),
          status: "pending",
        };

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setOrderData(orderWithMeta);
        setShowSummary(true);
        setSubmissionState("success");
        setTimeout(() => setSubmissionState("idle"), 2000);
      } catch (error) {
        console.error("Custom request submission error:", error);
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to submit request"
        );
        setSubmissionState("error");
        setTimeout(() => setSubmissionState("idle"), 3000);
      }
    },
    []
  );

  const handleNewOrder = useCallback(() => {
    setOrderData(null);
    setShowSummary(false);
    setErrorMessage(null);
    setSubmissionState("idle");
  }, []);

  const handleBackToForms = useCallback(() => {
    router.back();
  }, [router]);

  // Helper to convert orderData for OrderSummary compatibility
  const getOrderDataForSummary = (data: OrderSummaryData) => {
    // OrderSummary expects requiredCapacity?.value to be a STRING (not undefined)
    if (data.type === "custom") {
      return {
        ...data,
        requiredCapacity: {
          value:
            data.requiredCapacity?.value !== undefined
              ? String(data.requiredCapacity.value)
              : "",
          unit: data.requiredCapacity?.unit ?? "",
        },
      };
    }
    return data;
  };

  // Show loading state
  if (submissionState === "submitting") {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Processing Your Order...
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Please do not close this window
          </p>
        </motion.div>
      </div>
    );
  }

  // Show error state
  if (submissionState === "error" && errorMessage) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Submission Failed
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{errorMessage}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleNewOrder}
              className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all"
            >
              Try Again
            </button>
            <button
              onClick={handleBackToForms}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show success summary
  if (showSummary && orderData) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col">
        <main className="flex-grow">
          <section className="py-16 md:py-20 bg-gradient-to-b from-green-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="max-w-5xl mx-auto px-4 md:px-6">
              <motion.div
                key="summary"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={scaleIn}
                transition={{ duration: 0.5 }}
              >
                {submissionState === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 flex justify-center"
                  >
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">
                        Order Submitted Successfully!
                      </span>
                    </div>
                  </motion.div>
                )}

                <OrderSummary
                  orderData={getOrderDataForSummary(orderData)}
                  type={orderData.type}
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <button
                    onClick={handleNewOrder}
                    className="px-8 py-4 bg-orange-500 text-white font-bold text-sm uppercase tracking-widest hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl rounded-full hover:scale-105"
                  >
                    Place Another Order
                  </button>
                  <button
                    onClick={handleBackToForms}
                    className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold text-sm uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 rounded-full hover:scale-105"
                  >
                    Back to Shop
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // Main form view
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col">
      <main className="flex-grow">
        <section className="py-16 md:py-20 bg-gradient-to-b from-green-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            {/* Header */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                Order &{" "}
                <span className="text-orange-500 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Custom Request
                </span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mt-6 rounded-full" />
              <p className="text-gray-600 dark:text-gray-400 mt-6 max-w-2xl mx-auto">
                Choose between our standard machinery catalog or submit a custom
                equipment request
              </p>
            </motion.div>

            {/* Order Type Toggle */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.1 }}
              className="flex justify-center mb-10"
            >
              <div className="inline-flex bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setOrderType("standard")}
                  className={`flex items-center gap-2 px-6 md:px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                    orderType === "standard"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                      : "text-gray-700 dark:text-gray-300 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Standard Order
                </button>
                <button
                  onClick={() => setOrderType("custom")}
                  className={`flex items-center gap-2 px-6 md:px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                    orderType === "custom"
                      ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md"
                      : "text-gray-700 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Custom Request
                </button>
              </div>
            </motion.div>

            {/* Forms */}
            <AnimatePresence mode="wait">
              {orderType === "standard" ? (
                <motion.div
                  key="standard-form"
                  variants={scaleIn}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <StandardOrderForm
                    preselectedMachineId={preselectedMachineId}
                    onSubmit={handleStandardOrderSubmit}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="custom-form"
                  variants={scaleIn}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <CustomRequestForm onSubmit={handleCustomOrderSubmit} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trust Badges */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.4 }}
              className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                  { icon: "🔒", text: "Secure Payment" },
                  { icon: "🚚", text: "Global Shipping" },
                  { icon: "✅", text: "24/7 Support" },
                  { icon: "📦", text: "Quality Guarantee" },
                ].map((badge) => (
                  <motion.div
                    key={badge.text}
                    variants={fadeInUp}
                    className="text-center"
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {badge.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}