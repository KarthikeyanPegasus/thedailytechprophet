"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2 border-2 border-[var(--border-color)] bg-parchment-dark/50 hover:bg-gold/20 transition-colors"
      aria-label="Toggle candlelight mode"
      title="Toggle candlelight mode (T)"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-gold" />
        ) : (
          <Sun className="w-4 h-4 text-gold" />
        )}
      </motion.div>
    </button>
  );
}
