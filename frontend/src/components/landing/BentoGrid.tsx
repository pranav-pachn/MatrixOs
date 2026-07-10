"use client";

import React from "react";
import { motion } from "framer-motion";
import { Graph, Lightning, ChartLineUp } from "@phosphor-icons/react/dist/ssr";
import CardSwap, { Card } from "./CardSwap";

export function BentoGrid() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-24">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Column: Headline & Description */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="max-w-xl"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-sans text-white mb-6 leading-tight">
            Built for physical scale
          </h2>
          <p className="text-xl text-white/50 leading-relaxed font-sans">
            MatrixOS replaces fragmented dashboards with a single, unified operational graph powered by autonomous constraint engines.
          </p>
        </motion.div>

        {/* Right Column: CardSwap Animation Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative h-[550px] w-full flex items-center justify-center"
        >
          <CardSwap
            width={410}
            height={290}
            cardDistance={45}
            verticalDistance={45}
            delay={3000}
            pauseOnHover={true}
          >
            {/* Card 1: Live Operational Graph */}
            <Card className="group cursor-pointer">
              <div className="w-full h-full p-10 flex flex-col justify-center rounded-2xl border border-white/10 shadow-[0_15px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl bg-[#0A0A0C]/90 transition-all duration-500 group-hover:-translate-y-4 group-hover:scale-[1.03] group-hover:shadow-[0_20px_80px_rgba(82,39,255,0.15)] group-hover:border-primary/30">
                <div className="flex items-center space-x-4 mb-5">
                  <div className="p-3.5 bg-primary/10 rounded-xl transition-colors duration-500 group-hover:bg-primary/20">
                    <Graph size={32} className="text-primary" />
                  </div>
                  <span className="text-white font-sans text-2xl font-bold tracking-tight">Live Operational Graph</span>
                </div>
                <p className="text-white/70 font-medium text-lg leading-relaxed group-hover:text-white/90 transition-colors duration-500">
                  Track every flight, patient, or bot as a node on a massive, perfectly-synchronized directed graph. Millisecond latency.
                </p>
              </div>
            </Card>

            {/* Card 2: Constraint Engine */}
            <Card className="group cursor-pointer">
              <div className="w-full h-full p-10 flex flex-col justify-center rounded-2xl border border-white/10 shadow-[0_15px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl bg-[#0A0A0C]/90 transition-all duration-500 group-hover:-translate-y-4 group-hover:scale-[1.03] group-hover:shadow-[0_20px_80px_rgba(34,197,94,0.15)] group-hover:border-chart-4/30">
                <div className="flex items-center space-x-4 mb-5">
                  <div className="p-3.5 bg-chart-4/10 rounded-xl transition-colors duration-500 group-hover:bg-chart-4/20">
                    <Lightning size={32} className="text-chart-4" />
                  </div>
                  <span className="text-white font-sans text-2xl font-bold tracking-tight">Constraint Engine</span>
                </div>
                <p className="text-white/70 font-medium text-lg leading-relaxed group-hover:text-white/90 transition-colors duration-500">
                  Every action is mathematically verified against physical invariants. No more double-booked gates or depleted resources.
                </p>
              </div>
            </Card>

            {/* Card 3: Semantic Recovery */}
            <Card className="group cursor-pointer">
              <div className="w-full h-full p-10 flex flex-col justify-center rounded-2xl border border-white/10 shadow-[0_15px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl bg-[#0A0A0C]/90 transition-all duration-500 group-hover:-translate-y-4 group-hover:scale-[1.03] group-hover:shadow-[0_20px_80px_rgba(234,179,8,0.15)] group-hover:border-chart-2/30">
                <div className="flex items-center space-x-4 mb-5">
                  <div className="p-3.5 bg-chart-2/10 rounded-xl transition-colors duration-500 group-hover:bg-chart-2/20">
                    <ChartLineUp size={32} className="text-chart-2" />
                  </div>
                  <span className="text-white font-sans text-2xl font-bold tracking-tight">Semantic Recovery</span>
                </div>
                <p className="text-white/70 font-medium text-lg leading-relaxed group-hover:text-white/90 transition-colors duration-500">
                  When a resource fails, the AI queries episodic memory, calculates semantic rerouting paths, and dispatches the fix autonomously.
                </p>
              </div>
            </Card>
          </CardSwap>
        </motion.div>

      </div>
    </div>
  );
}
