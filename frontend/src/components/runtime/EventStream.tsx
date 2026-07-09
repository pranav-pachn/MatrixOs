"use client";

import React, { useState, useEffect } from "react";
import { EventRow, EventRowProps } from "./EventRow";

const mockEvents: EventRowProps[] = [
  { id: "EVT-1001", type: "system", timestamp: "2026-07-09T18:00:01.000Z", severity: "info", description: "MatrixOS initialized. Core adapters loaded." },
  { id: "EVT-1002", type: "telemetry", timestamp: "2026-07-09T18:01:15.000Z", severity: "info", description: "Flight AA102 entered airspace boundary." },
  { id: "EVT-1003", type: "telemetry", timestamp: "2026-07-09T18:03:42.000Z", severity: "info", description: "Flight DL405 gate assignment confirmed (B12)." },
  { id: "EVT-1004", type: "resource_status", timestamp: "2026-07-09T18:10:00.000Z", severity: "warning", description: "Baggage Cart BC-109 running low on battery (15%)." },
  { id: "EVT-1005", type: "mission_update", timestamp: "2026-07-09T18:15:22.000Z", severity: "info", description: "Flight AA102 block-in complete." },
  { id: "EVT-1006", type: "task_complete", timestamp: "2026-07-09T18:30:10.000Z", severity: "info", description: "Flight AA102 Deboarding completed." },
  { id: "EVT-1007", type: "hardware_fault", timestamp: "2026-07-09T18:31:05.000Z", severity: "critical", description: "Fuel Truck FT-402 engine stall detected." },
  { id: "EVT-1008", type: "divergence", timestamp: "2026-07-09T18:31:06.000Z", severity: "critical", description: "Divergence triggered: Flight AA102 Fueling blocked." },
  { id: "EVT-1009", type: "agent_action", timestamp: "2026-07-09T18:31:10.000Z", severity: "warning", description: "AI Agent calculating alternative fueling vectors." },
  { id: "EVT-1010", type: "agent_action", timestamp: "2026-07-09T18:31:15.000Z", severity: "info", description: "AI Agent re-routing FT-409 to Gate B12." },
];

export function EventStream() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Prevent hydration mismatch with timestamps

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
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-4 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-chart-4"></span>
          </span>
          <span className="text-[10px] font-mono text-foreground uppercase tracking-widest">Connected</span>
        </div>
      </div>

      {/* Fade Top/Bottom gradients for smooth scrolling effect */}
      <div className="absolute top-[73px] left-0 right-0 h-8 bg-gradient-to-b from-card/20 to-transparent pointer-events-none z-10" />

      {/* Stream Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col-reverse p-2">
        {mockEvents.map((evt) => (
          <EventRow key={evt.id} {...evt} />
        ))}
      </div>
    </div>
  );
}
