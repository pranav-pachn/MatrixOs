"use client";

import React from "react";
import { DivergenceAlert } from "./DivergenceAlert";
import { ValidationResult } from "./ValidationResult";
import { useRuntimeStore } from "@/lib/store/runtime";

export function ReasoningPanel() {
  const divergences = useRuntimeStore((state) => state.divergences);
  return (
    <div className="flex flex-col h-full bg-card/20 backdrop-blur-2xl rounded-2xl border border-border/50 shadow-2xl p-6 relative overflow-hidden">
      
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-chart-4/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mb-6 relative z-10">
        <h2 className="text-xl font-bold font-sans tracking-tight text-foreground">Runtime Reasoning</h2>
        <p className="text-xs text-muted-foreground font-sans mt-1">Live constraint validation & repair</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-8 custom-scrollbar relative z-10">
        
        {/* Active Divergence Section */}
        <section>
          <div className="flex items-center mb-4 space-x-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/50" />
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-destructive">Active Divergences</h3>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/50" />
          </div>
          
          <div className="space-y-4">
            {divergences.map((div) => (
              <DivergenceAlert 
                key={div.id}
                eventType={`Resource Failure: ${div.actualState}`}
                affectedMissions={["MSN-101 (Flight AA102)"]} // In real backend, we'd map this from div
                severity={div.severity}
              />
            ))}
            {divergences.length === 0 && (
              <p className="text-xs font-mono text-muted-foreground">No active divergences.</p>
            )}
          </div>
        </section>

        <div className="h-px w-full bg-border/50" />

        {/* Live Constraint Validation Section */}
        <section>
          <div className="flex items-center mb-4 space-x-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/50" />
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-chart-4">Invariant Checks</h3>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/50" />
          </div>
          
          <div className="space-y-1 relative">
            <ValidationResult 
              status="REJECTED"
              constraint="Aircraft fueled before boarding"
              reason="Fuel truck FT-402 failed. Task 'Fueling' pending."
            />
            <ValidationResult 
              status="PASS"
              constraint="Gate assignment valid"
            />
            <ValidationResult 
              status="PASS"
              constraint="Baggage cart available at gate"
            />
          </div>
        </section>

        {/* Agentic Repair Logic Section */}
        <section className="mt-6 border border-border/50 bg-background rounded-lg p-3">
           <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary mb-2">Repair Engine (AI)</h3>
           <p className="text-xs font-mono text-muted-foreground">
             {">"} Evaluating fallback resources...
             <br/>
             {">"} FT-409 available in Sector B.
             <br/>
             <span className="text-foreground">{">"} Re-routing FT-409 to Gate B12 (ETA +4m).</span>
           </p>
        </section>

      </div>
    </div>
  );
}
