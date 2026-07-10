"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";

export function LinearHero() {
  const [showFirstStroke, setShowFirstStroke] = useState(false);
  const [showSecondStroke, setShowSecondStroke] = useState(false);

  useEffect(() => {
    // 0.8s initial delay for the first word
    const t1 = setTimeout(() => setShowFirstStroke(true), 800);
    // Wait exactly 1.5s after the first animation starts
    const t2 = setTimeout(() => setShowSecondStroke(true), 2300); 

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
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
            <div className="absolute top-[100%] left-0 w-full -translate-y-1/2 pointer-events-none opacity-90 z-[-1]">
              {showFirstStroke && (
                <DotLottieReact
                  src="https://lottie.host/460d4f58-ebfd-4857-ac30-1063957b195c/VhrfWC6MQv.json"
                  loop
                  autoplay
                />
              )}
            </div>
          </span>{" "}
          <br className="hidden md:block" />
          <span className="relative inline-block text-white">
            runtime
            <div className="absolute top-[100%] left-0 w-full -translate-y-1/2 pointer-events-none opacity-90 z-[-1]">
              {showSecondStroke && (
                <DotLottieReact
                  src="https://lottie.host/460d4f58-ebfd-4857-ac30-1063957b195c/VhrfWC6MQv.json"
                  loop
                  autoplay
                />
              )}
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
