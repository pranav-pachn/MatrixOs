"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface AppMockupProps {
  children: React.ReactNode;
}

export function AppMockup({ children }: AppMockupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      id="hub-section" 
      className="relative w-full max-w-6xl mx-auto mt-12 px-6 perspective-[2000px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={ref}
    >
      <motion.div
        initial={{ rotateX: 20, y: 100, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        style={{ rotateX, rotateY }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="relative w-full rounded-2xl border border-white/10 bg-[#0A0A0C]/80 backdrop-blur-2xl shadow-[0_0_100px_rgba(108,99,255,0.1)] overflow-hidden"
      >
        {/* Mockup Header (Mac window style) */}
        <div className="h-12 border-b border-white/5 flex items-center px-4 bg-white/[0.02]">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/10" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/10" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/10" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="px-3 py-1 rounded-md bg-white/5 text-[10px] text-muted-foreground font-mono tracking-widest uppercase border border-white/5">
              kernel-active / workspace
            </div>
          </div>
        </div>
        
        {/* Inner Content Container */}
        <div className="p-8">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-xl font-bold font-sans tracking-tight text-foreground">Active Environments</h2>
              <p className="text-sm text-muted-foreground font-sans mt-1">Select an adapter to enter the operational graph.</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-mono text-primary uppercase tracking-widest">Live</span>
            </div>
          </div>
          {children}
        </div>
        
        {/* Bottom subtle glow */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </motion.div>
    </div>
  );
}
