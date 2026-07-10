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
        
        <div className="flex-1 min-w-[200px]">
          <MetricTile 
            label="System Health" 
            value={metrics.systemHealth.toString()} 
            unit="%" 
            trend={metrics.systemHealth >= 95 ? "up" : metrics.systemHealth < 80 ? "down" : "neutral"} 
            goodTrend="up" 
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <MetricTile 
            label="Active Constraints" 
            value={metrics.activeConstraints.toString()} 
            trend="neutral" 
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <MetricTile 
            label="Divergence Rate" 
            value={metrics.divergenceRate.toString()} 
            unit="/hr" 
            trend={metrics.divergenceRate > 1.5 ? "up" : "down"} 
            goodTrend="down" 
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <MetricTile 
            label="Recovery Latency" 
            value={metrics.recoveryLatency.toString()} 
            unit="ms" 
            trend={metrics.recoveryLatency > 1000 ? "up" : "down"} 
            goodTrend="down" 
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <MetricTile 
            label="Resource Util" 
            value={metrics.resourceUtilization.toString()} 
            unit="%" 
            trend={metrics.resourceUtilization > 90 ? "up" : "neutral"} 
            goodTrend="down" 
          />
        </div>

      </div>
    </div>
  );
}
