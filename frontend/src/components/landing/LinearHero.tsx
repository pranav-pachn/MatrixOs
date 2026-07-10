"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";

export function LinearHero() {
  return (
    <div className="relative pt-32 pb-20 md:pt-48 md:pb-32 flex flex-col items-center justify-center text-center overflow-hidden min-h-[600px]">
      
      {/* Abstract Glowing Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none z-0" />

      {/* Hero Content */}
      <div className="max-w-4xl px-6 flex flex-col items-center z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center space-x-2 bg-white/[0.03] border border-white/10 rounded-full px-3 py-1 mb-8 backdrop-blur-md"
        >
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium tracking-wide text-white/70">MatrixOS v1.0 Preview</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter font-sans mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 relative z-10"
        >
          The{" "}
          <span className="relative inline-block text-white">
            operational
            <div className="absolute top-full left-[5%] w-[90%] h-4 -mt-2 md:-mt-1 pointer-events-none z-[-1] text-[#cc5a37]">
              <svg 
                className="w-full h-full" 
                viewBox="0 0 100 20" 
                preserveAspectRatio="none"
                fill="none" 
              >
                <motion.path
                  d="M 2 12 Q 30 16 60 10 T 98 11"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.85 }}
                  transition={{ duration: 0.7, delay: 0.8, ease: "easeInOut" }}
                />
              </svg>
            </div>
          </span>{" "}
          <br className="hidden md:block" />
          <span className="relative inline-block text-white">
            runtime
            <div className="absolute top-full left-[7.5%] w-[85%] h-4 -mt-2 md:-mt-1 pointer-events-none z-[-1] text-[#cc5a37]">
              <svg 
                className="w-full h-full" 
                viewBox="0 0 100 20" 
                preserveAspectRatio="none"
                fill="none" 
              >
                <motion.path
                  d="M 3 10 Q 40 14 70 9 T 97 10"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.85 }}
                  // 0.8 (initial delay) + 0.7 (first anim) + 1.5 (wait) = 3.0s delay
                  transition={{ duration: 0.7, delay: 3.0, ease: "easeInOut" }}
                />
              </svg>
            </div>
          </span>{" "}
          for reality
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-white/50 font-sans max-w-2xl mb-10 leading-relaxed"
        >
          Purpose-built for planning, executing, and recovering dynamic environments. MatrixOS replaces fragmented logic with a verifiable semantic engine.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4 pointer-events-auto"
        >
          <Link
            href="/hub"
            className="group relative flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-white/90 transition-all overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Deploy Autonomous Agents
              <ArrowRight weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          
          <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/10 backdrop-blur-sm">
            Read the Documentation
          </button>
        </motion.div>
      </div>
    </div>
  );
}
