"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function LandingHeader() {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 h-16 border-b border-white/[0.05] bg-black/40 backdrop-blur-xl z-50 flex items-center px-6"
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
          <span className="font-bold text-white tracking-tight text-lg">MatrixOS</span>
        </Link>

        {/* Center Nav (Hidden on Mobile) */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Features</Link>
          <Link href="#" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Methodology</Link>
          <Link href="#" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Customers</Link>
          <Link href="#" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Changelog</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Link href="#" className="hidden md:block text-sm font-medium text-white/60 hover:text-white transition-colors">
            Log in
          </Link>
          <button 
            onClick={() => {
              document.getElementById('hub-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            Deploy
          </button>
        </div>

      </div>
    </motion.header>
  );
}
