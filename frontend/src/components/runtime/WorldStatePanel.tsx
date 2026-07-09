"use client";

import React from "react";
import { MissionCard } from "./MissionCard";
import { ResourceBadge } from "./ResourceBadge";
import { useRuntimeStore } from "@/lib/store/runtime";

export function WorldStatePanel() {
  // Brick 27: Wire up to Zustand Brain
  const missions = useRuntimeStore((state) => state.missions);
  const resources = useRuntimeStore((state) => state.resources);

  return (
    <div className="flex flex-col h-full p-4 overflow-hidden">
      <div className="mb-6">
        <h2 className="text-lg font-bold font-sans tracking-tight text-foreground">World State</h2>
        <p className="text-xs text-muted-foreground font-sans">Live operational telemetry</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-8 custom-scrollbar">
        
        {/* UX Law: Miller's Law (Chunking) - Breaking dense data into manageable sections */}
        
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">Missions</h3>
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-foreground">{missions.length} Active</span>
          </div>
          
          <div className="space-y-4">
            {missions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        </section>

        <div className="h-px w-full bg-border/50" />

        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">Resources</h3>
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-foreground">{resources.length} Tracked</span>
          </div>
          
          <div className="space-y-3">
            {resources.map((res) => (
              <ResourceBadge key={res.id} name={res.name} type={res.type} status={res.status} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
