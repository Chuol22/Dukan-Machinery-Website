"use client";

// Light/dark theme toggle button — cycles through theme modes
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ModeToggle() {
  const { theme, effectiveTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getThemeIcon = () => {
    if (theme === "light") return Sun;
    if (theme === "dark") return Moon;
    return Monitor;
  };

  const getThemeLabel = () => {
    if (theme === "light") return "Light";
    if (theme === "dark") return "Dark";
    return "light"; // Show system theme in tooltip when in system mode
  };

  const Icon = getThemeIcon();

  // Avoid hydration mismatch before client theme loads
  if (!mounted) {
    return (
      <button className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 w-8 h-8 min-h-[44px] min-w-[44px] flex items-center justify-center" />
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`relative group p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center ${
        theme === "light"
          ? "bg-white border-gray-200"
          : theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-gray-100 border-gray-300"
      }`}
      aria-label={`Current theme: ${getThemeLabel()}. Click to change`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === "dark" ? 0 : theme === "light" ? 180 : 90,
        }}
        transition={{ duration: 0.3 }}
      >
        <Icon
          className={`w-3.5 h-3.5 transition-colors ${
            theme === "light"
              ? "text-orange-500"
              : theme === "dark"
                ? "text-green-400"
                : "text-gray-600"
          } group-hover:text-primary`}
        />
      </motion.div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 px-1.5 py-0.5 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {getThemeLabel()}
      </div>
    </motion.button>
  );
}
