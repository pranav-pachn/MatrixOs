"use client";

import React from "react";
import { RecoveryConsole } from "@/components/runtime/RecoveryConsole";
import { DivergenceAlert } from "@/components/runtime/DivergenceAlert";
import { useRuntimeStore } from "@/lib/store/runtime";

export default function RecoveryPage() {
  const currentPlan = useRuntimeStore((state) => state.currentPlan);

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
          {currentPlan ? (
            <>
              <div className="bg-card/20 backdrop-blur-2xl rounded-2xl border border-border/50 shadow-2xl p-6">
                <h2 className="text-lg font-bold font-sans tracking-tight text-foreground mb-4">Triggering Event</h2>
                <DivergenceAlert 
                  eventType={currentPlan.eventType}
                  affectedMissions={currentPlan.affectedMissions}
                  severity="critical"
                />
              </div>
              
              <div className="bg-card/20 backdrop-blur-2xl rounded-2xl border border-border/50 shadow-2xl p-6 flex-1">
                 <h2 className="text-lg font-bold font-sans tracking-tight text-foreground mb-2">Confidence Score</h2>
                 <div className="flex items-end gap-2 mt-6">
                   <span className="text-5xl font-mono font-bold text-chart-4 tracking-tighter">{(currentPlan.confidence * 100).toFixed(1)}</span>
                   <span className="text-lg text-muted-foreground mb-1">%</span>
                 </div>
                 <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                   The AI is highly confident in this recovery path based on semantic routing calculations and 142 similar historical occurrences.
                 </p>
              </div>
            </>
          ) : (
            <div className="bg-card/20 backdrop-blur-2xl rounded-2xl border border-border/50 shadow-2xl p-6 flex-1 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-border/50 flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground font-mono">AWAITING DISRUPTION</p>
                <p className="text-xs text-muted-foreground mt-1">Inject a chaos event from the Events &amp; Triggers tab to activate the AI recovery pipeline.</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: The Solution (Pipeline) */}
        <div className="lg:col-span-2 h-full min-h-0">
          <RecoveryConsole />
        </div>

      </div>
    </div>
  );
}

