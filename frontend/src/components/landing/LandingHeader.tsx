"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, List } from "@phosphor-icons/react/dist/ssr";
import { MatrixLogo } from "@/components/ui/MatrixLogo";

export function LandingHeader() {
  return (
    <motion.header 
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none"
    >
      <div className="w-full max-w-7xl flex items-center justify-between px-5 py-2.5 bg-[#0A0A0C]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] pointer-events-auto transition-all duration-300 hover:border-white/20">
        
        {/* Logo */}
        <div className="flex-shrink-0">
          <MatrixLogo className="scale-90 origin-left" />
        </div>

        {/* Center Nav (Hidden on Mobile) */}
        <nav className="hidden lg:flex items-center space-x-12 relative">
          <div className="relative">
            <Link href="/" className="text-[14px] font-medium text-white transition-colors duration-[250ms] tracking-wide">Runtime</Link>
            <div className="absolute -bottom-[14px] left-0 right-0 h-[2px] bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(122,60,249,0.5)]" />
          </div>
          <Link href="#" className="text-[14px] font-medium text-[#B8B8C2] hover:text-white transition-colors duration-[250ms] tracking-wide">Methodology</Link>
          <Link href="/documentation" className="text-[14px] font-medium text-[#B8B8C2] hover:text-white transition-colors duration-[250ms] tracking-wide">Documentation</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center flex-shrink-0">
          <button 
            onClick={() => {
              window.location.href = '/hub';
            }}
            className="group relative overflow-hidden bg-white text-black px-6 py-2 rounded-xl text-[13px] font-bold tracking-wide hover:-translate-y-[1px] hover:shadow-[0_4px_15px_rgba(122,60,249,0.35)] transition-all duration-[250ms] ease-out"
          >
            {/* Subtle animated gradient inside the button on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-[250ms]" />
            <span className="relative z-10">Launch MatrixOS</span>
          </button>
        </div>

      </div>
    </motion.header>
  );
}
