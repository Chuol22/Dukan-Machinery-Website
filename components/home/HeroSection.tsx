"use client";

// Hero Section — 2-column premium layout with Framer Motion slide-in animations
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Settings, ChevronRight } from "lucide-react";

export default function HeroSection() {
  // Typing animation state — cycles through headline suffixes
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopIndex, setLoopIndex] = useState(0);

  const words = [
    "for great Solutions",
    "Equipment",
    "of Modern Technology",
    "for great Innovation",
  ];
  const typingSpeed = 150;
  const deletingSpeed = 50;
  const pauseTime = 2000;

  // Typewriter effect: type word → pause → delete → next word
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentWord = words[loopIndex % words.length];

    if (isDeleting) {
      timer = setTimeout(() => {
        setTypedText((prev) => prev.slice(0, -1));
        if (typedText === "") {
          setIsDeleting(false);
          setLoopIndex((prev) => prev + 1);
        }
      }, deletingSpeed);
    } else {
      timer = setTimeout(() => {
        setTypedText(currentWord.slice(0, typedText.length + 1));
        if (typedText === currentWord) {
          timer = setTimeout(() => setIsDeleting(true), pauseTime);
        }
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, loopIndex]);

  return (
    <section
      className="relative overflow-hidden bg-neutral-950 pt-20 pb-12 lg:py-0 lg:h-[calc(100vh-80px)] lg:min-h-[550px] lg:flex lg:items-center"
      style={{
        backgroundImage: "url('/images/hero/home1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay to ensure white text readability */}
      <div className="absolute inset-0 bg-neutral-950/75 z-0 pointer-events-none" />

      {/* Background decorative blobs - cleaner and more subtle */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-green-500/8 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/8 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center w-full">
          
          {/* Left side: Headline, description, and CTA buttons */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 space-y-4 text-left"
          >

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow-md">
              Industrial Machinery <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">Solutions</span>{" "}
              <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-orange-500 font-bold mt-1 min-h-[2rem] tracking-wide">
                <span>Machinery {typedText}</span>
                <span
                  className="typed-cursor inline-block w-0.5 h-5 bg-orange-500 ml-1 animate-pulse"
                  aria-hidden="true"
                >
                  |
                </span>
              </div>
            </h1>

            <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl">
              Precision Engineering for Agricultural and Industrial applications. We design, manufacture, and deliver robust machinery built to last and optimize your yields.
            </p>

            {/* Accent Highlight box */}
            <div className="border-l-4 border-orange-500 bg-white/5 dark:bg-black/10 p-3 rounded-r-xl max-w-xl backdrop-blur-xs">
              <p className="text-gray-300 text-[11px] sm:text-xs md:text-sm">
                <span className="font-black text-white">High Durability & Yields:</span> Built with premium Stainless Steel 304 and heavy-duty components for long-term operations.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/machines"
                className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-full transition-all duration-300 uppercase text-xs sm:text-sm tracking-wider shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5"
              >
                <span>View Machines</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/order"
                className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 bg-transparent border-2 border-white/80 hover:border-orange-500 hover:text-orange-500 text-white font-black rounded-full transition-all duration-300 uppercase text-xs sm:text-sm tracking-wider hover:-translate-y-0.5"
              >
                <span>Order Custom</span>
                <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Right side: Large, high-quality agriculture image - BIGGER AND CLEANER */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="relative group">
              {/* Cleaner outer glow effect */}
              <div className="absolute -inset-3 bg-gradient-to-r from-orange-400 to-green-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition duration-700" />
              
              {/* Larger image container with improved aspect ratio */}
              <div className="relative aspect-[16/10] lg:max-h-[340px] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-neutral-900">
                <img
                  src="/images/hero/homeimage.jpg"
                  alt="Agriculture Industrial Machinery Solutions"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay card with cleaner design */}
                <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-black/85 to-black/75 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center justify-between shadow-xl">
                  <div>
                    <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest mb-0.5">Premium Quality</p>
                    <p className="text-xs sm:text-sm md:text-base text-white font-black">Agricultural Equipment</p>
                  </div>
                  <span className="bg-gradient-to-r from-green-600 to-green-500 text-white text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                    Made in Ethiopia
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
