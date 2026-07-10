"use client";

import React, { useState, useEffect, useRef } from "react";
import { EventRow } from "./EventRow";
import { useRuntimeStore } from "@/lib/store/runtime";

export function EventStream() {
  const [isClient, setIsClient] = useState(false);
  const {
    runtimeEvents: events,
    addEvent,
    activeScenarioId,
    wsConnected,
    setWsConnected,
    setSnapshot,
    applyReplay,
    updateWorldState,
    setMetrics,
    setPhaseState,
    resetLifecycle,
    setCurrentPlan
  } = useRuntimeStore();

  useEffect(() => {
    setIsClient(true);
  }, []);


  if (!isClient) return null;

  return (
    <div className="flex flex-col h-full bg-card/20 backdrop-blur-2xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden relative">
      
      {/* Sleek Header */}
      <div className="bg-card/40 border-b border-border/30 px-6 py-4 flex items-center justify-between z-10 backdrop-blur-md">
        <div>
          <h2 className="text-base font-bold font-sans tracking-tight text-foreground flex items-center gap-2">
            Live Telemetry Stream
          </h2>
          <p className="text-[11px] text-muted-foreground font-sans mt-0.5">Real-time system events and agent actions</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-background/50 px-3 py-1.5 rounded-full border border-border/50 shadow-neu-inset">
          <span className="relative flex h-2 w-2">
            {wsConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-4 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${wsConnected ? 'bg-chart-4' : 'bg-muted-foreground'}`}></span>
          </span>
          <span className="text-[10px] font-mono text-foreground uppercase tracking-widest">
            {wsConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Fade Top/Bottom gradients for smooth scrolling effect */}
      <div className="absolute top-[73px] left-0 right-0 h-8 bg-gradient-to-b from-card/20 to-transparent pointer-events-none z-10" />

      {/* Stream Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col-reverse p-2 min-h-0">
        {events.map((evt: any) => (
          <EventRow key={evt.id} {...evt} />
        ))}
        {events.length === 0 && (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground font-mono">
            Waiting for telemetry...
          </div>
        )}
      </div>
    </div>
  );
}
