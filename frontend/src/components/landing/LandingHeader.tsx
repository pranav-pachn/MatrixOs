"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function LandingHeader() {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/50 backdrop-blur-md border-b border-white/[0.08]"
    >
      <div className="flex items-center space-x-2">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-6 h-6 rounded-md bg-foreground flex items-center justify-center group-hover:scale-105 transition-transform">
            <div className="w-3 h-3 rounded-full bg-background" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground font-sans">
            Matrix
          </span>
        </Link>
      </div>

      <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-muted-foreground">
        <Link href="#" className="hover:text-foreground transition-colors">Features</Link>
        <Link href="#" className="hover:text-foreground transition-colors">Methodology</Link>
        <Link href="#" className="hover:text-foreground transition-colors">Customers</Link>
        <Link href="#" className="hover:text-foreground transition-colors">Pricing</Link>
      </nav>

      <div className="flex items-center space-x-6">
        <Link href="#" className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Log in
        </Link>
        <button 
          onClick={() => {
            document.getElementById('hub-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-foreground text-background px-4 py-2 rounded-full text-sm font-bold hover:bg-foreground/90 transition-all hover:scale-105 active:scale-95"
        >
          Initialize
        </button>
      </div>
    </motion.header>
  );
}
