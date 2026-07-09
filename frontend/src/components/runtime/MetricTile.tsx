import React from "react";
import { TrendUp, TrendDown, Minus } from "@phosphor-icons/react/dist/ssr";

interface MetricTileProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  goodTrend?: "up" | "down"; // Which direction is considered "good" (green)
}

export function MetricTile({ label, value, unit, trend, goodTrend = "up" }: MetricTileProps) {
  let TrendIcon = Minus;
  let trendColor = "text-muted-foreground";

  if (trend === "up") {
    TrendIcon = TrendUp;
    trendColor = goodTrend === "up" ? "text-chart-4" : "text-destructive";
  } else if (trend === "down") {
    TrendIcon = TrendDown;
    trendColor = goodTrend === "down" ? "text-chart-4" : "text-destructive";
  }

  return (
    <div className="flex flex-col justify-center px-6 py-2 border-r border-border/50 last:border-r-0 transition-colors duration-300 hover:bg-card/40 cursor-default group">
      <div className="flex items-center space-x-2 mb-1">
        <span className="text-xs font-sans text-muted-foreground tracking-wide uppercase">{label}</span>
      </div>
      
      <div className="flex items-baseline space-x-2">
        <span className="text-2xl font-bold font-mono text-foreground">{value}</span>
        {unit && <span className="text-xs font-mono text-muted-foreground">{unit}</span>}
        
        {trend && (
          <div className={`flex items-center ml-2 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110 ${trendColor}`}>
            <TrendIcon size={14} weight="bold" />
          </div>
        )}
      </div>
    </div>
  );
}
