"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";

interface AppMockupProps {
  children: React.ReactNode;
}

export function AppMockup({ children }: AppMockupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth scroll animations
  const rotateX = useTransform(scrollYProgress, [0, 0.4], [15, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });

  // Mouse tracking for 3D tilt effect on hover
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    
    // Calculate tilt (adjust multipliers to strengthen/weaken the effect)
    mouseX.set(x / 30);
    mouseY.set(y / -30);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  // Combine scroll rotation with mouse rotation
  const combinedRotateX = useTransform(
    [springRotateX, mouseY],
    ([scrollRotation, mouseRotation]) => Number(scrollRotation) + Number(mouseRotation)
  );

  return (
    <div 
      id="hub-section" 
      ref={containerRef} 
      className="relative w-full max-w-6xl mx-auto px-6 mt-12 mb-32 perspective-1000"
    >
      <motion.div
        style={{
          rotateX: combinedRotateX,
          rotateY: mouseX,
          scale: springScale,
          opacity: opacity,
          transformStyle: "preserve-3d"
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full rounded-2xl border border-white/10 bg-[#0A0A0C]/80 backdrop-blur-2xl shadow-[0_0_100px_rgba(108,99,255,0.1)] overflow-hidden transition-colors duration-500 hover:shadow-[0_0_120px_rgba(108,99,255,0.2)]"
      >
        
        {/* Fake Mac Window Controls */}
        <div className="h-12 border-b border-white/5 flex items-center px-4 bg-white/[0.02]">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-white/20" />
            <div className="w-3 h-3 rounded-full bg-white/20" />
            <div className="w-3 h-3 rounded-full bg-white/20" />
          </div>
          <div className="mx-auto text-xs text-white/40 font-mono">matrix-os-hub</div>
        </div>
        
        {/* Inner Content Container */}
        <div className="p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white">Active Environments</h2>
            <p className="text-white/50 mt-2">Select an operational adapter to enter the runtime graph.</p>
          </div>
          {children}
        </div>

      </motion.div>
    </div>
  );
}
