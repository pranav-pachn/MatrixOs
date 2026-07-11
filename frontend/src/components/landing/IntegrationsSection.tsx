"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TerminalWindow } from "@phosphor-icons/react/dist/ssr";

const Badges = ({ items }: { items: string[] }) => (
  <div className="flex flex-wrap justify-center gap-2 mb-6">
    {items.map((item, i) => (
      <span key={i} className="border border-white/10 bg-white/[0.02] px-2.5 py-1 rounded text-[10px] uppercase font-mono text-white/70">
        <span className="text-primary mr-1.5">✓</span>
        {item}
      </span>
    ))}
  </div>
);

export function IntegrationsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const apiItems = ["Hospital Systems", "Airports", "Warehouses", "Factories", "ERP"];
  const mcpItems = ["Claude", "ChatGPT", "Cursor", "Copilot", "Custom Agents"];

  return (
    <section className="relative w-full overflow-hidden bg-black py-32 border-t border-white/[0.02]" ref={containerRef}>
      
      {/* Background Subtle Telemetry */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex items-center justify-center">
        <div className="w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-black to-black" />
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
            <circle cx="0" cy="0" r="1" fill="rgba(255,255,255,0.1)" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#gridPattern)" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center mb-24"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground mb-6">
            Integrations
          </span>
          <h2 className="text-4xl md:text-5xl font-sans tracking-tight text-white mb-6 max-w-3xl">
            Integrate MatrixOS into your existing systems.
          </h2>
        </motion.div>

        {/* Architectural Flow Diagram */}
        <div className="relative w-full max-w-4xl h-[650px] mx-auto hidden md:block">
          
          {/* Animated Connecting SVG Lines */}
          <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ overflow: 'visible' }}>
            {/* Left Line (API to Center) */}
            <motion.path
              d="M 144 320 L 144 420 L 448 420 L 448 460"
              fill="none"
              stroke="rgba(82, 39, 255, 0.4)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
            />
            {/* Right Line (MCP to Center) */}
            <motion.path
              d="M 752 320 L 752 420 L 448 420 L 448 460"
              fill="none"
              stroke="rgba(82, 39, 255, 0.4)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
            />
            
            {/* Moving Pulses on Lines */}
            <motion.circle r="3" fill="#5227FF" 
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={isInView ? { offsetDistance: "100%", opacity: [0, 1, 0] } : {}}
              transition={{ duration: 2, delay: 1.8, repeat: Infinity, ease: "linear" }}
              style={{ offsetPath: "path('M 144 320 L 144 420 L 448 420 L 448 460')" }}
            />
            <motion.circle r="3" fill="#5227FF" 
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={isInView ? { offsetDistance: "100%", opacity: [0, 1, 0] } : {}}
              transition={{ duration: 2, delay: 1.8, repeat: Infinity, ease: "linear" }}
              style={{ offsetPath: "path('M 752 320 L 752 420 L 448 420 L 448 460')" }}
            />
          </svg>

          {/* LEFT: API */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="absolute top-0 left-0 w-72 flex flex-col items-center z-10"
          >
            <span className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-6">REST API</span>
            <Badges items={apiItems} />
            
            <div className="w-px h-6 bg-border/50 mb-6 relative">
               <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 border-b border-r border-border/50 rotate-45" />
            </div>

            {/* Terminal Window */}
            <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg overflow-hidden text-left shadow-2xl">
              <div className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.02] border-b border-white/5">
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <span className="ml-auto text-[9px] font-mono text-white/30 uppercase">Terminal</span>
              </div>
              <div className="p-4">
                <pre className="text-[10px] font-mono text-white/70 leading-relaxed">
                  <span className="text-primary">POST</span> /runtime/events{"\n\n"}
                  {"{\n"}
                  {'  "type": "RESOURCE_FAILURE",\n'}
                  {'  "resource": "Gate A12"\n'}
                  {"}"}
                </pre>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: MCP */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="absolute top-0 right-0 w-72 flex flex-col items-center z-10"
          >
            <span className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-6">AI AGENTS (PLANNED)</span>
            <Badges items={mcpItems} />
            
            <div className="w-px h-6 bg-border/50 mb-6 relative">
               <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 border-b border-r border-border/50 rotate-45" />
            </div>

            {/* Node Pipeline */}
            <div className="w-full flex flex-col items-center space-y-4">
              <div className="w-full border border-white/10 bg-black rounded-lg py-2.5 px-4 text-[11px] font-mono text-white/70 shadow-sm flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white/20" /> Cursor AI
              </div>
              
              <div className="w-px h-4 bg-border/50 relative">
                 <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 border-b border-r border-border/50 rotate-45" />
              </div>
              
              <div className="w-full border border-primary/30 bg-primary/5 rounded-lg py-2.5 px-4 text-[11px] font-mono text-primary shadow-sm flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/50" /> MCP Server
              </div>
            </div>
          </motion.div>

          {/* CENTER: MatrixOS Runtime */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: [0.95, 1.02, 1] } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, delay: 1.6, ease: "easeOut" }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[420px] flex flex-col items-center z-20"
          >
            <div className="w-full bg-black border border-white/20 rounded-xl p-6 shadow-[0_0_40px_rgba(82,39,255,0.1)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex items-center justify-center gap-2 mb-2 relative z-10">
                <span className="text-primary mt-0.5">⬢</span>
                <span className="text-sm font-bold font-sans tracking-tight text-white uppercase">MatrixOS Runtime</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-8 relative z-10">(Shared World Model)</span>
              
              <div className="flex items-center justify-between text-[10px] font-mono text-white/60 relative z-10 px-4">
                <span className="border border-white/10 rounded px-2 py-1 bg-white/[0.02]">Planner</span>
                <span className="text-primary">→</span>
                
                {/* Flashing Validator Node */}
                <motion.span 
                  initial={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}
                  animate={isInView ? { 
                    borderColor: ["rgba(255,255,255,0.1)", "rgba(82,39,255,0.8)", "rgba(255,255,255,0.1)"],
                    color: ["rgba(255,255,255,0.6)", "rgba(255,255,255,1)", "rgba(255,255,255,0.6)"],
                    backgroundColor: ["rgba(255,255,255,0.02)", "rgba(82,39,255,0.1)", "rgba(255,255,255,0.02)"]
                  } : {}}
                  transition={{ duration: 1.5, delay: 2.2, repeat: Infinity, repeatDelay: 3 }}
                  className="border rounded px-2 py-1"
                >
                  Validator
                </motion.span>
                
                <span className="text-primary">→</span>
                <span className="border border-white/10 rounded px-2 py-1 bg-white/[0.02]">Recovery</span>
              </div>
              
              <div className="w-full flex justify-center mt-6 relative z-10">
                 <div className="w-px h-6 bg-primary/30 relative">
                   <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 border-b border-r border-primary/50 rotate-45" />
                 </div>
              </div>
              <div className="text-center mt-4 relative z-10">
                 <span className="text-xs font-medium text-white/90 tracking-tight font-sans">Safe Execution</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile Fallback (Simple Stack) */}
        <div className="md:hidden flex flex-col gap-12 w-full mt-12 text-left">
           <div className="p-6 border border-white/10 rounded-xl bg-[#0A0A0A]">
             <h3 className="text-sm font-bold text-white mb-2 uppercase font-mono">REST API</h3>
             <p className="text-xs text-muted-foreground mb-4">Enterprise Systems → MatrixOS Runtime</p>
             <Badges items={apiItems} />
           </div>
           <div className="p-6 border border-white/10 rounded-xl bg-[#0A0A0A]">
             <h3 className="text-sm font-bold text-white mb-2 uppercase font-mono">MCP SERVER</h3>
             <p className="text-xs text-muted-foreground mb-4">AI Agents → MatrixOS Runtime</p>
             <Badges items={mcpItems} />
           </div>
        </div>

        {/* Explainability Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6, delay: 2.5, ease: "easeOut" }}
          className="w-full flex flex-col items-center pt-16 md:mt-16"
        >
          <h3 className="text-lg font-medium text-white mb-4 tracking-tight font-sans">
            Shared Operational Runtime
          </h3>
          
          <p className="text-sm text-muted-foreground max-w-2xl font-sans">
            Every interface—API, UI, and future MCP clients—executes through the same planner, validator, recovery engine, and operational graph.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
