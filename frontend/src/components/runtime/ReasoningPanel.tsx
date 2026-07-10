"use client";

import React from "react";
import { DivergenceAlert } from "./DivergenceAlert";
import { ValidationResult } from "./ValidationResult";
import { useRuntimeStore } from "@/lib/store/runtime";

export function ReasoningPanel() {
  const { divergences, invariants, runtimeEvents: events } = useRuntimeStore();

  const agentActions = events
    .filter(e => e.type.startsWith("runtime.phase.") || e.type === "runtime.divergence.detected")
    .slice(0, 6);

  return (
    <div className="flex flex-col h-full bg-card/20 backdrop-blur-2xl rounded-2xl border border-border/50 shadow-2xl p-6 relative overflow-hidden group">

      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-chart-4/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mb-6 relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold font-sans tracking-tight text-foreground">Runtime Reasoning</h2>
            <p className="text-xs text-muted-foreground font-sans mt-1">Live constraint validation & repair</p>
          </div>
          {/* Controls slot will go here */}
        </div>
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
                eventType={`Event: ${div.actualState}`}
                affectedMissions={["Scenario Impacted"]} // We simplify for the hackathon MVP
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
            {invariants.length > 0 ? invariants.map((inv, idx) => (
              <ValidationResult
                key={idx}
                status={inv.status}
                constraint={inv.constraint}
                reason={inv.reason}
              />
            )) : (
              <p className="text-xs font-mono text-muted-foreground">Awaiting recovery plan actions...</p>
            )}
          </div>
        </section>

        {/* Agentic Repair Logic Section */}
        <section className="mt-6 border border-border/50 bg-background rounded-lg p-3 overflow-hidden">
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary mb-2">Repair Engine (AI)</h3>
          <div className="text-xs font-mono flex flex-col space-y-1">
            {agentActions.length > 0 ? (
              agentActions.map((action, idx) => (
                <span key={action.id} className={idx === 0 ? "text-foreground" : "text-muted-foreground"}>
                  {">"} {action.payload?.message || action.payload?.event || action.type}
                </span>
              ))
            ) : (
              <span className="text-muted-foreground">{">"} Idle... waiting for telemetry.</span>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
