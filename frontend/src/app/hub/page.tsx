"use client";

import React from "react";
import { motion } from "framer-motion";
import { EnvironmentGrid } from "@/components/hub/EnvironmentGrid";
import { MatrixLogo } from "@/components/ui/MatrixLogo";

export default function HubPage() {
  return (
    <div className="relative min-h-screen bg-[#000000] text-foreground font-sans selection:bg-primary/30 flex flex-col overflow-hidden">

      {/* Subtle dark radial gradient background to anchor the cards */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(82,39,255,0.06)_0%,transparent_60%)]" />
      </div>

      {/* Standalone Brand Logo - Absolute Top Left */}
      <div className="absolute top-8 left-8 z-50">
        <MatrixLogo className="scale-90 opacity-60 hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Main content — vertically centered in remaining space */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">

        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 border border-white/10 bg-white/[0.04] rounded-full px-4 py-1.5 text-xs text-white/40 font-mono uppercase tracking-widest mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>Operational Runtime</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-white font-sans mb-4">
            Active Environments
          </h1>
          <p className="text-white/40 text-lg max-w-md mx-auto font-sans leading-relaxed">
            Select an environment to enter its runtime graph, or create a new one.
          </p>
        </motion.div>

        {/* Environment grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl"
        >
          <EnvironmentGrid />
        </motion.div>

      </main>
    </div>
  );
}
