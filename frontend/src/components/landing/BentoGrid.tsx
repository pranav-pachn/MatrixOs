"use client";

import React from "react";
import { motion } from "framer-motion";
import { Graph, Lightning, ChartLineUp } from "@phosphor-icons/react/dist/ssr";

export function BentoGrid() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center md:text-left"
      >
        <h2 className="text-3xl md:text-5xl font-bold font-sans tracking-tight text-foreground">
          Built for physical scale.
        </h2>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl">
          MatrixOS replaces fragmented dashboards with a single, unified operational graph powered by autonomous constraint engines.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Bento Box 1: Large */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="md:col-span-2 bg-[#0A0A0C] border border-white/[0.05] rounded-3xl p-8 relative overflow-hidden group shadow-neu-inset hover:border-primary/30 transition-colors"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10 flex flex-col h-full justify-between min-h-[300px]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6 text-foreground">
                <Graph size={24} weight="duotone" />
              </div>
              <h3 className="text-2xl font-bold font-sans text-foreground mb-2">Live Operational Graph</h3>
              <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
                Track every flight, patient, or autonomous bot as a node on a massive, perfectly-synchronized directed graph. Millisecond latency, absolute truth.
              </p>
            </div>
            
            {/* Mock Graph Visual */}
            <div className="mt-8 flex gap-4 opacity-50 group-hover:opacity-100 transition-opacity">
               <div className="h-2 w-16 bg-primary rounded-full" />
               <div className="h-2 w-32 bg-white/20 rounded-full" />
               <div className="h-2 w-24 bg-white/20 rounded-full" />
            </div>
          </div>
        </motion.div>

        {/* Bento Box 2: Small */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#0A0A0C] border border-white/[0.05] rounded-3xl p-8 relative overflow-hidden group shadow-neu-inset hover:border-chart-4/30 transition-colors"
        >
          <div className="absolute inset-0 bg-gradient-to-bl from-chart-4/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10 flex flex-col h-full justify-between min-h-[300px]">
             <div>
                <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6 text-foreground">
                  <Lightning size={24} weight="duotone" />
                </div>
                <h3 className="text-xl font-bold font-sans text-foreground mb-2">Constraint Engine</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Every action is mathematically verified against physical invariants. No more double-booked gates or depleted resources.
                </p>
             </div>
          </div>
        </motion.div>

        {/* Bento Box 3: Small */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="md:col-span-3 bg-[#0A0A0C] border border-white/[0.05] rounded-3xl p-8 md:p-12 relative overflow-hidden group shadow-neu-inset hover:border-chart-2/30 transition-colors"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-chart-2/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-50 transition-opacity duration-1000 -z-0 translate-x-1/3 -translate-y-1/3" />
          <div className="relative z-10 md:w-1/2 flex flex-col justify-center h-full">
            <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6 text-foreground">
              <ChartLineUp size={24} weight="duotone" />
            </div>
            <h3 className="text-3xl font-bold font-sans text-foreground mb-4">Semantic Recovery</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              When a resource fails, the AI doesn't just alert you. It queries episodic memory, calculates semantic rerouting paths, mutates the operational graph, and dispatches the fix autonomously.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
