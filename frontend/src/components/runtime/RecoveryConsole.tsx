"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRuntimeStore } from "@/lib/store/runtime";
import { RuntimePhase, RuntimePhaseStatus } from "@/types/runtime";
import { CheckCircle2, CircleDashed, Loader2, XCircle } from "lucide-react";

export function RecoveryConsole() {
  const lifecycle = useRuntimeStore((state) => state.lifecycle);
  const divergences = useRuntimeStore((state) => state.divergences);
  const activeScenarioId = useRuntimeStore((state) => state.activeScenarioId);
  
  // Define the core steps of the MatrixOS Runtime
  const corePhases: { phase: RuntimePhase, label: string }[] = [
    { phase: "OBSERVING", label: "Observe Event" },
    { phase: "ASSESSING", label: "Impact Assessment" },
    { phase: "PLANNING", label: "Recovery Planning" },
    { phase: "POLICY", label: "Policy Evaluation" },
    { phase: "OPTIMIZING", label: "Optimize Schedule" },
    { phase: "VALIDATING", label: "Invariant Validation" },
  ];
  
  const riePhases: { phase: RuntimePhase, label: string }[] = [
    { phase: "RECOVERY_ACTIVATED", label: "Recovery Intelligence Activated" },
    { phase: "MEMORY_RETRIEVED", label: "Memory Retrieval" },
    { phase: "RECOVERY_REPLANNING", label: "Synthesize Alternative" },
  ];

  // Only show RIE phases if they have been activated
  const showRIE = lifecycle["RECOVERY_ACTIVATED"].status !== "pending";
  
  let phases = [...corePhases];
  if (showRIE) {
    phases = [...phases, ...riePhases];
  }
  phases.push({ phase: "EXECUTING", label: "Runtime Execution" });

  // Calculate totals for the footer
  let totalLatency = 0;
  let activePhase = "IDLE";
  let isFailed = false;

  Object.entries(lifecycle).forEach(([key, state]) => {
    if (state.duration) totalLatency += state.duration;
    if (state.status === "running") activePhase = key;
    if (state.status === "failed") isFailed = true;
  });

  if (activePhase === "IDLE" && lifecycle["EXECUTING"].status === "success") {
    activePhase = "COMPLETED";
  } else if (activePhase === "IDLE" && lifecycle["OBSERVING"].status === "success") {
    activePhase = "IDLE (WAITING)";
  }

  // Get current event info
  const currentEvent = divergences.length > 0 ? divergences[0].actualState : "None";

  // Status icon mapping
  const getIcon = (status: RuntimePhaseStatus) => {
    switch(status) {
      case "pending": return <CircleDashed className="w-5 h-5 text-muted-foreground/50" />;
      case "running": return <Loader2 className="w-5 h-5 text-chart-4 animate-spin" />;
      case "success": return <CheckCircle2 className="w-5 h-5 text-chart-2" />;
      case "failed": return <XCircle className="w-5 h-5 text-destructive" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-card/20 backdrop-blur-2xl rounded-2xl border border-border/50 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-chart-4/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="px-6 pt-6 pb-4 relative z-10 border-b border-border/30">
        <h2 className="text-xl font-bold font-sans tracking-tight text-foreground flex items-center gap-3">
          MatrixOS Runtime
        </h2>
        <p className="text-xs text-muted-foreground font-sans mt-1 uppercase tracking-widest">
          Autonomous Lifecycle
        </p>
      </div>

      {/* Pipeline Stages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative z-10 min-h-0">
        <div className="space-y-0 relative">
          {phases.map((p, index) => {
            const state = lifecycle[p.phase];
            const isLast = index === phases.length - 1;
            
            return (
              <div key={p.phase} className="relative flex gap-4">
                {/* Vertical Line */}
                {!isLast && (
                  <div className="absolute left-2.5 top-8 bottom-[-8px] w-px bg-border/50" />
                )}
                
                {/* Icon */}
                <div className="relative z-10 mt-1 flex-shrink-0 bg-card rounded-full">
                  {getIcon(state.status)}
                </div>

                {/* Content */}
                <div className={`pb-6 ${state.status === "pending" ? "opacity-50" : "opacity-100"}`}>
                  <h3 className="text-sm font-bold text-foreground font-mono tracking-tight flex items-center gap-2">
                    {p.label}
                    {state.duration !== undefined && (
                      <span className="text-[10px] font-mono text-muted-foreground font-normal ml-2">
                        {state.duration} ms
                      </span>
                    )}
                  </h3>
                  
                  {state.message && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-muted-foreground mt-1"
                    >
                      {state.status === "success" ? "✓ " : ""}{state.message}
                    </motion.p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Footer */}
      <div className="bg-background/80 backdrop-blur-md border-t border-border/50 p-4 relative z-10">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider mb-1">Runtime State</p>
            <p className={`text-sm font-bold font-mono ${isFailed ? "text-destructive" : activePhase === "COMPLETED" ? "text-chart-2" : activePhase !== "IDLE" ? "text-chart-4" : "text-foreground"}`}>
              {isFailed ? "FAILED" : activePhase}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider mb-1">Current Event</p>
            <p className="text-sm font-bold text-foreground truncate" title={currentEvent}>
              {currentEvent}
            </p>
          </div>
          
          <div>
            <p className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider mb-1">Planner Model</p>
            <p className="text-sm font-bold text-foreground">
              Gemini 2.5 Flash
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider mb-1">Solver Status</p>
            <p className={`text-sm font-bold ${lifecycle["OPTIMIZING"].status === "success" ? "text-chart-2" : "text-foreground"}`}>
              {lifecycle["OPTIMIZING"].status === "success" ? "OPTIMAL" : (lifecycle["OPTIMIZING"].status === "failed" ? "INFEASIBLE" : "WAITING")}
            </p>
          </div>
          
          <div>
            <p className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider mb-1">Total Latency</p>
            <p className="text-sm font-bold font-mono text-foreground">
              {totalLatency} ms
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider mb-1">Confidence</p>
            <p className="text-sm font-bold font-mono text-chart-2">
              {activePhase === "COMPLETED" ? "91%" : "---"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
