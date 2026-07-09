"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export function LinearHero() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="relative pt-32 pb-20 md:pt-48 md:pb-32 flex flex-col items-center justify-center text-center overflow-hidden">
      
      {/* Subtle Radial Glow Background */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10" 
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-b from-primary/10 to-transparent opacity-30 pointer-events-none -z-10" />

      {/* Hero Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl px-6 flex flex-col items-center z-10"
      >
        <motion.h1 
          variants={item}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter font-sans leading-[1.1] mb-6 drop-shadow-sm text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60"
        >
          The operational runtime for physical reality
        </motion.h1>
        
        <motion.p 
          variants={item}
          className="text-lg md:text-2xl text-muted-foreground font-sans max-w-2xl mb-10 leading-relaxed font-medium"
        >
          Purpose-built for planning, executing, and recovering dynamic environments. Designed for the AI era.
        </motion.p>
        
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={() => document.getElementById('hub-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="group flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full text-base font-bold hover:bg-foreground/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(250,250,250,0.2)]"
          >
            Deploy Autonomous Agents
            <ArrowRight weight="bold" className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="flex items-center gap-2 px-6 py-3 rounded-full text-base font-semibold text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
            Read the Documentation
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
