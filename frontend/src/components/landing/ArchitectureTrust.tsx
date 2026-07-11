"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Crosshair, Graph, Plugs } from "@phosphor-icons/react/dist/ssr";

const features = [
  {
    icon: <ShieldCheck size={18} weight="regular" />,
    title: "Deterministic Validation",
    description: "AI proposes. Runtime validates. Nothing executes without passing operational rules."
  },
  {
    icon: <Crosshair size={18} weight="regular" />,
    title: "Constraint First",
    description: "The runtime continuously checks operational constraints instead of blindly executing plans."
  },
  {
    icon: <Graph size={18} weight="regular" />,
    title: "Shared World Model",
    description: "Every mission, resource, dependency and event exists in one synchronized operational graph."
  },
  {
    icon: <Plugs size={18} weight="regular" />,
    title: "Domain Adapters",
    description: "Only adapters change. The runtime remains identical across airports, hospitals, warehouses and factories."
  }
];

export function ArchitectureTrust() {
  return (
    <section id="methodology" className="w-full max-w-5xl mx-auto px-6 py-32 flex flex-col items-center justify-center text-center">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center mb-20"
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

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-24">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.05 }}
            className="flex flex-col items-start text-left p-8 rounded-xl border border-white/[0.05] bg-black/50 hover:bg-black hover:border-white/10 hover:-translate-y-[1px] transition-all duration-100 ease-out"
          >
            <div className="text-white/60 mb-6">
              {feature.icon}
            </div>
            <h3 className="text-lg font-medium text-white font-sans mb-3 tracking-tight">
              {feature.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed font-sans">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Explainability Documentation Block */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="w-full flex flex-col items-center border-t border-white/[0.05] pt-16"
      >
        <h3 className="text-lg font-medium text-white mb-8 tracking-tight font-sans">
          Every decision inside MatrixOS is explainable.
        </h3>
        
        <p className="text-sm text-muted-foreground mb-6 font-sans">
          Recovery plans include:
        </p>
        
        <ul className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-sm text-muted-foreground/80 font-mono">
          <li className="flex items-center gap-2">
            <span className="text-white/30">•</span> violated constraints
          </li>
          <li className="flex items-center gap-2">
            <span className="text-white/30">•</span> affected resources
          </li>
          <li className="flex items-center gap-2">
            <span className="text-white/30">•</span> recovery reasoning
          </li>
          <li className="flex items-center gap-2">
            <span className="text-white/30">•</span> validation results
          </li>
        </ul>
        
        <p className="text-sm text-muted-foreground mt-8 font-sans">
          so operators always know WHY something happened.
        </p>
      </motion.div>

    </section>
  );
}
