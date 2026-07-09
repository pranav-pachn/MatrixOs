import React from "react";
import { MetricTile } from "./MetricTile";

export function MetricsBar() {
  return (
    <div className="h-20 w-full flex items-center border-t border-border bg-card/40 backdrop-blur-md overflow-x-auto overflow-y-hidden custom-scrollbar">
      <div className="flex flex-nowrap w-full divide-x divide-border/50 px-4">
        
        <div className="flex-1 min-w-[200px]">
          <MetricTile 
            label="System Health" 
            value="98.4" 
            unit="%" 
            trend="down" 
            goodTrend="up" 
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <MetricTile 
            label="Active Constraints" 
            value="142" 
            trend="neutral" 
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <MetricTile 
            label="Divergence Rate" 
            value="1.2" 
            unit="/hr" 
            trend="up" 
            goodTrend="down" 
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <MetricTile 
            label="Recovery Latency" 
            value="450" 
            unit="ms" 
            trend="down" 
            goodTrend="down" 
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <MetricTile 
            label="Resource Util" 
            value="87" 
            unit="%" 
            trend="up" 
            goodTrend="down" // 87% might be getting too high for an airport buffer
          />
        </div>

      </div>
    </div>
  );
}
