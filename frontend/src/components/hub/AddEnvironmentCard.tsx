"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "@phosphor-icons/react/dist/ssr";

interface AddEnvironmentCardProps {
  onClick: () => void;
}

export function AddEnvironmentCard({ onClick }: AddEnvironmentCardProps) {
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    // Show guide after 1.5 seconds if it hasn't been dismissed in this session
    const hasSeenGuide = sessionStorage.getItem("matrixos_env_guide_seen");
    if (!hasSeenGuide) {
      const timer = setTimeout(() => setShowGuide(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissGuide = () => {
    setShowGuide(false);
    sessionStorage.setItem("matrixos_env_guide_seen", "true");
  };

  const handleClick = () => {
    dismissGuide();
    onClick();
  };

  return (
    <div className="relative w-full h-full">
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-auto"
          >
            <div className="relative flex items-center gap-3 bg-[#0A0A0C]/95 backdrop-blur-md border border-primary/30 shadow-[0_0_30px_rgba(82,39,255,0.2)] rounded-xl px-4 py-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
              <span className="text-xs text-white/90 font-medium whitespace-nowrap font-sans">
                Click here to configure a new operational adapter.
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); dismissGuide(); }}
                className="ml-2 p-1 rounded-md text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
              >
                <X size={12} weight="bold" />
              </button>
              {/* Pointer Triangle */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-primary/30" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleClick}
        onMouseEnter={dismissGuide}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] hover:border-primary/50 hover:bg-primary/5 transition-colors duration-300 group min-h-[200px] w-full outline-none focus:ring-2 focus:ring-primary cursor-pointer"
    >
      {/* Ambient glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_center,rgba(82,39,255,0.08)_0%,transparent_70%)]" />

      {/* Pulsing ring */}
      <div className="relative z-10 mb-4">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-0 group-hover:opacity-60 scale-150" />
        <div className="relative w-14 h-14 rounded-full border-2 border-dashed border-white/20 group-hover:border-primary/60 flex items-center justify-center transition-colors duration-300 bg-white/[0.03] group-hover:bg-primary/10">
          <Plus
            size={26}
            weight="bold"
            className="text-white/30 group-hover:text-primary transition-colors duration-300"
          />
        </div>
      </div>

      <span className="relative z-10 text-sm font-semibold text-white/30 group-hover:text-white/70 transition-colors duration-300 font-sans">
        Add Environment
      </span>
        <span className="relative z-10 text-xs text-white/15 group-hover:text-white/30 transition-colors duration-300 font-sans mt-1">
          Configure a new operational adapter
        </span>
      </motion.button>
    </div>
  );
}
