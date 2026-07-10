"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export function CtaSection() {
  return (
    <section className="w-full py-32 px-6 relative overflow-hidden">
      {/* Glow blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Pill label */}
          <div className="inline-flex items-center space-x-2 border border-white/10 bg-white/[0.04] rounded-full px-4 py-1.5 text-xs text-white/50 font-mono uppercase tracking-widest mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>System Online</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white font-sans mb-6 leading-tight">
            Ready to run your first <br className="hidden md:block" />
            <span className="text-primary">operational graph?</span>
          </h2>

          <p className="text-lg text-white/40 font-sans mb-10 max-w-xl mx-auto leading-relaxed">
            Pick an environment and watch MatrixOS plan, execute, and recover
            in real time — all from a single unified runtime.
          </p>

          <Link
            href="/hub"
            className="inline-flex items-center gap-2 bg-white text-black font-semibold font-sans px-8 py-4 rounded-full text-base hover:bg-white/90 transition-all duration-200 hover:gap-3"
          >
            Enter the Hub
            <ArrowRight weight="bold" size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
