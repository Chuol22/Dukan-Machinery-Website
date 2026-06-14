"use client";

// NewsletterSignup — email subscription form with compact variant
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Send,
  CheckCircle,
  XCircle,
  Bell,
  Sparkles,
  TrendingUp,
  Zap,
  BookOpen,
  Shield,
} from "lucide-react";

interface NewsletterSignupProps {
  variant?: "default" | "compact";
  className?: string;
}

export default function NewsletterSignup({
  variant = "default",
  className = "",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Subscription perks shown in default layout
  const benefits = [
    { icon: TrendingUp, text: "Weekly industry insights" },
    { icon: Zap, text: "New product launches" },
    { icon: BookOpen, text: "Expert guides & tips" },
    { icon: Shield, text: "Exclusive offers" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email presence and format
    if (!email) {
      setErrorMessage("Please enter your email address");
      setStatus("error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      setStatus("error");
      return;
    }

    setStatus("loading");

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      setName("");

      // Reset success message after 3 seconds
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    }, 1500);
  };

  // Inline compact layout for sidebars
  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 ${className}`}
      >
        {/* Icon and form */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-green-600 font-black mb-1">Stay Updated</h3>
            <p className="text-green-500 text-sm mb-3">
              Get the latest insights and offers
            </p>

            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-3 py-2 pr-10 bg-green-600/10 border border-green-600/20 rounded-lg text-green-600 placeholder-green-600/60 focus:outline-none focus:ring-2 focus:ring-green-600/30 text-sm"
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-600/60" />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full px-3 py-2 bg-green-600 text-orange-600 rounded-lg hover:bg-green-600/90 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        {/* Status feedback */}
        <AnimatePresence>
          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 p-2 bg-green-500/20 rounded-lg text-center"
            >
              <p className="text-green-500 text-xs">
                ✓ Subscribed successfully!
              </p>
            </motion.div>
          )}
          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 p-2 bg-red-500/20 rounded-lg text-center"
            >
              <p className="text-red-500 text-xs">{errorMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 ${className}`}
    >
      {/* Content */}
      <div className="relative z-10 p-8 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Text Content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex bg-orange-100 dark:bg-orange-900/30 items-center gap-2 px-3 py-1 rounded-full mb-4"
            >
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-orange-700 dark:text-orange-400 text-lg font-black">
                Stay Ahead
              </span>
            </motion.div>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-black text-green-800 dark:text-white mb-4">
              Subscribe to Our Newsletter
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Join 1,00+ industry professionals who receive weekly updates on
              feed processing technology, industry trends, and exclusive offers.
            </p>

            {/* Benefits List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                    <benefit.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    {benefit.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-orange-500" />
                <span>No spam</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-orange-500" />
                <span>Unsubscribe anytime</span>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-black mb-2">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-black mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="i@example.com"
                    className="w-full px-4 py-3 pl-11 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-black transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {status === "loading" ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe Now
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-gray-400 dark:text-gray-500 text-xs text-center">
                By subscribing, you agree to our Privacy Policy and consent to
                receive updates.
              </p>
            </form>

            {/* Success/Error Messages */}
            <AnimatePresence>
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-3 bg-green-500/20 rounded-lg flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="text-green-600 dark:text-green-400 text-sm">
                    Thanks for subscribing! Check your inbox.
                  </p>
                </motion.div>
              )}
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-3 bg-red-500/20 rounded-lg flex items-center gap-2"
                >
                  <XCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-500 dark:text-red-400 text-sm">
                    {errorMessage}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
