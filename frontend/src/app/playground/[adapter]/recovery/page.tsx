"use client";

import React from "react";
import { RecoveryConsole } from "@/components/runtime/RecoveryConsole";
import { DivergenceAlert } from "@/components/runtime/DivergenceAlert";
import { useRuntimeStore } from "@/lib/store/runtime";

export default function RecoveryPage() {
  const recovery = useRuntimeStore((state) => state.recovery);

  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-sans tracking-tight text-foreground">AI Resolution Matrix</h1>
        <p className="text-sm text-muted-foreground font-sans">Deep dive into the AI's step-by-step reasoning pipeline for resolving operational divergences.</p>
      </div>

      {/* Grid Layout: 1/3 Active Divergence, 2/3 Recovery Pipeline */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        {/* Left Column: The Problem */}
        <div className="lg:col-span-1 h-full flex flex-col space-y-6">
          <div className="bg-card/20 backdrop-blur-2xl rounded-2xl border border-border/50 shadow-2xl p-6">
            <h2 className="text-lg font-bold font-sans tracking-tight text-foreground mb-4">Triggering Event</h2>
            <DivergenceAlert 
              eventType={recovery.eventType}
              affectedMissions={recovery.affectedMissions}
              severity="critical"
            />
          </div>
          
          <div className="bg-card/20 backdrop-blur-2xl rounded-2xl border border-border/50 shadow-2xl p-6 flex-1">
             <h2 className="text-lg font-bold font-sans tracking-tight text-foreground mb-2">Confidence Score</h2>
             <div className="flex items-end gap-2 mt-6">
               <span className="text-5xl font-mono font-bold text-chart-4 tracking-tighter">{recovery.confidence}</span>
               <span className="text-lg text-muted-foreground mb-1">%</span>
             </div>
             <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
               The AI is highly confident in this recovery path based on semantic routing calculations and 142 similar historical occurrences.
             </p>
          </div>
        </div>

        {/* Right Column: The Solution (Pipeline) */}
        <div className="lg:col-span-2 h-full min-h-0">
          <RecoveryConsole />
        </div>

      </div>
    </div>
  );
}
