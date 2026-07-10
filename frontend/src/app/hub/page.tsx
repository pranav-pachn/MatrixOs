"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { EnvironmentGrid } from "@/components/hub/EnvironmentGrid";

export default function HubPage() {
  return (
    <div className="relative min-h-screen bg-[#000000] text-foreground font-sans selection:bg-primary/30 flex flex-col overflow-hidden">

      {/* Subtle dark radial gradient background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-primary/8 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-900/10 blur-[150px] rounded-full" />
      </div>

      {/* Minimal top bar — back link + branding only */}
      <div className="relative z-10 flex items-center justify-between px-8 py-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-white/30 hover:text-white/70 transition-colors text-sm font-sans"
        >
          <ArrowLeft
            size={16}
            weight="bold"
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          Back to site
        </Link>

        {/* Minimal logo */}
        <div className="flex items-center space-x-2 opacity-40">
          <div className="w-5 h-5 rounded bg-foreground flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-sm bg-background" />
          </div>
          <span className="text-sm font-bold tracking-tight">MatrixOS</span>
        </div>
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
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-sans mb-3">
            Active Environments
          </h1>
          <p className="text-white/35 text-base max-w-md mx-auto font-sans leading-relaxed">
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
