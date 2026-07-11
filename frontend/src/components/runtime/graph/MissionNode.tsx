"use client";

import React from "react";
import { Handle, Position } from "@xyflow/react";
import { AirplaneTilt, FirstAid, Package } from "@phosphor-icons/react/dist/ssr";
import { useRuntimeStore } from "@/lib/store/runtime";

export function MissionNode({ data }: any) {
  const isDiverged = data.status === "diverged";
  const activeScenarioId = useRuntimeStore((state) => state.activeScenarioId);
  
  const Icon = activeScenarioId === "airport" 
    ? AirplaneTilt 
    : activeScenarioId === "hospital-er" 
      ? FirstAid 
      : Package;
  
  return (
    <div className={`px-5 py-3 shadow-neu-raised rounded-xl bg-card border-2 transition-all hover:scale-105 ${isDiverged ? "border-destructive shadow-[0_0_15px_rgba(255,77,77,0.3)]" : "border-primary/50"}`}>
      <div className="flex flex-col items-center justify-center">
        <div className={`mb-1 ${isDiverged ? "text-destructive animate-pulse" : "text-primary"}`}>
          <Icon size={24} weight="duotone" />
        </div>
        <div className="text-sm font-bold font-sans text-foreground">
          {data.label}
        </div>
      </div>
      {/* Outgoing Handle on Bottom */}
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-foreground border-none" />
    </div>
  );
}
