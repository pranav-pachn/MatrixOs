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
          className="relative h-[450px] w-full flex items-center justify-center"
        >
          <CardSwap
            width={340}
            height={240}
            cardDistance={35}
            verticalDistance={35}
            delay={3000}
            pauseOnHover={true}
          >
            {/* Card 1: Live Operational Graph */}
            <Card className="p-8 flex flex-col justify-center text-sm border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl bg-[#0A0A0C]/90">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Graph size={28} className="text-primary" />
                </div>
                <span className="text-white font-sans text-xl font-bold">Live Operational Graph</span>
              </div>
              <p className="text-white/60 font-medium text-base leading-relaxed">
                Track every flight, patient, or bot as a node on a massive, perfectly-synchronized directed graph. Millisecond latency.
              </p>
            </Card>

            {/* Card 2: Constraint Engine */}
            <Card className="p-8 flex flex-col justify-center text-sm border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl bg-[#0A0A0C]/90">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-chart-4/10 rounded-full">
                  <Lightning size={28} className="text-chart-4" />
                </div>
                <span className="text-white font-sans text-xl font-bold">Constraint Engine</span>
              </div>
              <p className="text-white/60 font-medium text-base leading-relaxed">
                Every action is mathematically verified against physical invariants. No more double-booked gates or depleted resources.
              </p>
            </Card>

            {/* Card 3: Semantic Recovery */}
            <Card className="p-8 flex flex-col justify-center text-sm border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl bg-[#0A0A0C]/90">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-chart-2/10 rounded-full">
                  <ChartLineUp size={28} className="text-chart-2" />
                </div>
                <span className="text-white font-sans text-xl font-bold">Semantic Recovery</span>
              </div>
              <p className="text-white/60 font-medium text-base leading-relaxed">
                When a resource fails, the AI queries episodic memory, calculates semantic rerouting paths, and dispatches the fix autonomously.
              </p>
            </Card>
          </CardSwap>
        </motion.div>

      </div>
    </div>
  );
}
