import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={cn(
        "relative flex items-center w-14 h-7 rounded-full border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isDark
          ? "bg-slate-800 border-white/10"
          : "bg-sky-100 border-sky-200",
        className
      )}
    >
      {/* Track icons */}
      <span className="absolute left-1.5 text-amber-400 pointer-events-none">
        <Sun className="w-3 h-3" />
      </span>
      <span className="absolute right-1.5 text-slate-400 pointer-events-none">
        <Moon className="w-3 h-3" />
      </span>

      {/* Thumb */}
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className={cn(
          "absolute w-5 h-5 rounded-full flex items-center justify-center shadow-md",
          isDark
            ? "left-1 bg-slate-600 shadow-black/40"
            : "left-7 bg-white shadow-sky-200/60"
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span key="moon" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }} transition={{ duration: 0.15 }}>
              <Moon className="w-2.5 h-2.5 text-blue-300" />
            </motion.span>
          ) : (
            <motion.span key="sun" initial={{ scale: 0, rotate: 90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: -90 }} transition={{ duration: 0.15 }}>
              <Sun className="w-2.5 h-2.5 text-amber-500" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </button>
  );
}
