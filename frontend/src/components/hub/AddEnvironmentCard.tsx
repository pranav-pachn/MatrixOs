"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus } from "@phosphor-icons/react/dist/ssr";

interface AddEnvironmentCardProps {
  onClick: () => void;
}

export function AddEnvironmentCard({ onClick }: AddEnvironmentCardProps) {
  return (
    <motion.button
      onClick={onClick}
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
  );
}
