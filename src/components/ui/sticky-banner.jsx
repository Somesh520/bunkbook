import React, { useState } from "react";
import { X, Star } from "lucide-react";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "motion/react";

export function StickyBanner({ children, className, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className={cn(
            "relative z-[60] flex w-full items-center justify-center px-4 py-2 sm:px-6 lg:px-8 shadow-sm",
            className
          )}
        >
          {children}
          <button
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all focus:outline-none"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
