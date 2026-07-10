"use client";

import React from "react";
import { MetricTile } from "./MetricTile";
import { useRuntimeStore } from "@/lib/store/runtime";

export function MetricsBar() {
  const metrics = useRuntimeStore(state => state.metrics);

  if (!metrics) {
    return (
      <div className="h-20 w-full flex items-center justify-center border-t border-border bg-card/40 backdrop-blur-md">
        <span className="text-sm text-muted-foreground font-mono animate-pulse">Loading Telemetry...</span>
      </div>
    );
  }

  return (
    <div className="h-20 w-full flex items-center border-t border-border bg-card/40 backdrop-blur-md overflow-x-auto overflow-y-hidden custom-scrollbar">
      <div className="flex flex-nowrap w-full divide-x divide-border/50 px-4">
        
        {Array.isArray(metrics) ? metrics.map((metric: any, idx: number) => (
          <div key={metric.key || idx} className="flex-1 min-w-[200px]">
            <MetricTile 
              label={metric.label} 
              value={metric.value.toString()} 
              unit={metric.unit || ""} 
              trend="neutral" 
            />
          </div>
        )) : (
          <div className="flex-1 min-w-[200px]">
            <span className="text-sm text-muted-foreground px-4">Invalid metrics format</span>
          </div>
        )}

      </div>
    </div>
  );
}
