"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, Crosshair, Graph, Plugs, CheckCircle, Info } from "@phosphor-icons/react/dist/ssr";

const PillarCard = ({ icon, title, description, delay, positionClass }: { icon: React.ReactNode, title: string, description: string, delay: number, positionClass: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={`absolute w-64 p-5 rounded-xl border border-white/[0.05] bg-black/80 backdrop-blur-sm hover:border-white/10 hover:-translate-y-[1px] transition-all duration-100 ease-out z-10 ${positionClass}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="text-white/60">
          {icon}
        </div>
        <h3 className="text-sm font-medium text-white font-sans tracking-tight">
          {title}
        </h3>
      </div>
      <p className="text-[11px] text-muted-foreground leading-relaxed font-sans m-0">
        {description}
      </p>
    </motion.div>
  );
};

export function ArchitectureTrust() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="relative w-full max-w-5xl mx-auto px-6 py-32 flex flex-col items-center justify-center text-center bg-black overflow-hidden" ref={containerRef}>
      
      {/* Background Subtle Telemetry Graph */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="telemetryGraph" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,1)" strokeWidth="0.5" strokeDasharray="2 4"/>
            <circle cx="0" cy="0" r="1.5" fill="rgba(255,255,255,1)" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#telemetryGraph)" />
        </svg>
      </div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center mb-24 relative z-10"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground mb-6">
          Trust Through Architecture
        </span>
        <h2 className="text-4xl md:text-5xl font-sans tracking-tight text-white mb-6 max-w-3xl">
          Designed for environments where failure is not an option.
        </h2>
        <p className="text-base text-muted-foreground max-w-2xl font-sans">
          MatrixOS doesn't rely on AI guesses. Every recovery is validated against deterministic operational constraints before execution.
        </p>
      </motion.div>

      {/* Cross Architecture Diagram (Desktop) */}
      <div className="relative w-full max-w-4xl h-[700px] mx-auto hidden md:block z-10">
        
        {/* Animated Connecting SVG Lines */}
        <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ overflow: 'visible' }}>
          
          {/* Top to Center */}
          <motion.path d="M 448 100 L 448 270" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"
            initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : { pathLength: 0 }} transition={{ duration: 0.8, delay: 0.6, ease: "easeInOut" }} />
          <motion.circle r="2" fill="#5227FF" initial={{ offsetDistance: "0%", opacity: 0 }} animate={isInView ? { offsetDistance: "100%", opacity: [0, 1, 0] } : {}}
            transition={{ duration: 1.5, delay: 1.5, ease: "linear" }} style={{ offsetPath: "path('M 448 100 L 448 270')" }} />

          {/* Right to Center */}
          <motion.path d="M 640 350 L 528 350" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"
            initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : { pathLength: 0 }} transition={{ duration: 0.8, delay: 0.6, ease: "easeInOut" }} />
          <motion.circle r="2" fill="#5227FF" initial={{ offsetDistance: "0%", opacity: 0 }} animate={isInView ? { offsetDistance: "100%", opacity: [0, 1, 0] } : {}}
            transition={{ duration: 1.5, delay: 1.6, ease: "linear" }} style={{ offsetPath: "path('M 640 350 L 528 350')" }} />

          {/* Bottom to Center */}
          <motion.path d="M 448 600 L 448 430" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"
            initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : { pathLength: 0 }} transition={{ duration: 0.8, delay: 0.6, ease: "easeInOut" }} />
          <motion.circle r="2" fill="#5227FF" initial={{ offsetDistance: "0%", opacity: 0 }} animate={isInView ? { offsetDistance: "100%", opacity: [0, 1, 0] } : {}}
            transition={{ duration: 1.5, delay: 1.7, ease: "linear" }} style={{ offsetPath: "path('M 448 600 L 448 430')" }} />

          {/* Left to Center */}
          <motion.path d="M 256 350 L 368 350" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"
            initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : { pathLength: 0 }} transition={{ duration: 0.8, delay: 0.6, ease: "easeInOut" }} />
          <motion.circle r="2" fill="#5227FF" initial={{ offsetDistance: "0%", opacity: 0 }} animate={isInView ? { offsetDistance: "100%", opacity: [0, 1, 0] } : {}}
            transition={{ duration: 1.5, delay: 1.4, ease: "linear" }} style={{ offsetPath: "path('M 256 350 L 368 350')" }} />
        </svg>

        {/* Outer Trust Pillars */}
        <PillarCard 
          icon={<ShieldCheck size={18} weight="regular" />}
          title="Deterministic Validation"
          description="AI proposes. Runtime validates. Nothing executes without passing rules."
          delay={0.2}
          positionClass="top-0 left-1/2 -translate-x-1/2"
        />
        <PillarCard 
          icon={<Crosshair size={18} weight="regular" />}
          title="Constraint First"
          description="The runtime continuously checks operational constraints before plans."
          delay={0.3}
          positionClass="top-1/2 right-0 -translate-y-1/2"
        />
        <PillarCard 
          icon={<Graph size={18} weight="regular" />}
          title="Shared World Model"
          description="Every mission, resource, dependency exists in one synchronized graph."
          delay={0.4}
          positionClass="bottom-0 left-1/2 -translate-x-1/2"
        />
        <PillarCard 
          icon={<Plugs size={18} weight="regular" />}
          title="Domain Adapters"
          description="Only adapters change. The runtime remains identical across domains."
          delay={0.5}
          positionClass="top-1/2 left-0 -translate-y-1/2"
        />

        {/* Center: MatrixOS Runtime Node */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: [0.8, 1.05, 1] } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, delay: 1.8, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-white/20 bg-black shadow-[0_0_50px_rgba(82,39,255,0.15)] flex flex-col items-center justify-center z-20 group"
        >
          <div className="absolute inset-0 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-2 h-2 rounded-full bg-primary mb-3 shadow-[0_0_10px_rgba(82,39,255,0.8)]" />
          <span className="text-xs font-bold text-white uppercase tracking-tight font-sans text-center px-4">
            MatrixOS Runtime
          </span>
          <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest mt-2 text-center">
            Constraint-Validated
          </span>
        </motion.div>
      </div>

      {/* Mobile Fallback */}
      <div className="md:hidden flex flex-col gap-6 w-full z-10">
        <div className="w-full p-8 border border-primary/20 bg-primary/5 rounded-xl text-center mb-6">
          <div className="w-2 h-2 rounded-full bg-primary mx-auto mb-3 shadow-[0_0_10px_rgba(82,39,255,0.8)]" />
          <span className="text-sm font-bold text-white uppercase tracking-tight font-sans block">MatrixOS Runtime</span>
        </div>
        <PillarCard icon={<ShieldCheck size={18}/>} title="Deterministic Validation" description="AI proposes. Runtime validates." delay={0.1} positionClass="relative w-full" />
        <PillarCard icon={<Crosshair size={18}/>} title="Constraint First" description="Continuously checks operational constraints." delay={0.2} positionClass="relative w-full" />
        <PillarCard icon={<Graph size={18}/>} title="Shared World Model" description="One synchronized operational graph." delay={0.3} positionClass="relative w-full" />
        <PillarCard icon={<Plugs size={18}/>} title="Domain Adapters" description="Runtime remains identical across domains." delay={0.4} positionClass="relative w-full" />
      </div>

      {/* Trust Band */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="w-full border-t border-b border-white/[0.05] py-12 mt-24 z-10 bg-black/50 backdrop-blur-sm"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "Validated", desc: "Every recovery is rigorously tested." },
            { label: "Explainable", desc: "No black box decision making." },
            { label: "Constraint-First", desc: "Rules govern AI, not the other way." },
            { label: "Adapter-Driven", desc: "Zero custom engine rewrites." }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <CheckCircle size={20} className="text-primary mb-3" weight="regular" />
              <span className="text-[11px] font-mono text-white tracking-widest uppercase mb-1">{item.label}</span>
              <span className="text-xs text-muted-foreground font-sans">{item.desc}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Explainability Highlight Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        className="w-full max-w-4xl mx-auto mt-24 z-10"
      >
        <div className="w-full bg-[#050505] border border-white/[0.05] rounded-2xl p-10 md:p-14 flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <Info size={24} className="text-white/40 mb-6" weight="regular" />
          <h3 className="text-2xl md:text-3xl font-medium text-white mb-4 tracking-tight font-sans relative z-10">
            Every Decision is Explainable
          </h3>
          <p className="text-sm text-muted-foreground mb-12 font-sans relative z-10 max-w-lg mx-auto">
            Unlike traditional workflows, every automated recovery inside MatrixOS includes a complete, deterministic audit trail.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 relative z-10 w-full max-w-3xl">
            {[
              "Violated Constraints",
              "Affected Resources",
              "Recovery Reasoning",
              "Validation Results"
            ].map((chip, i) => (
              <span 
                key={i} 
                className="px-4 py-2 bg-black border border-white/10 rounded-lg text-xs font-mono text-white/80 hover:text-white hover:border-primary/50 transition-colors duration-200 cursor-default"
              >
                [ {chip} ]
              </span>
            ))}
          </div>
        </div>
      </motion.div>

    </section>
  );
}
