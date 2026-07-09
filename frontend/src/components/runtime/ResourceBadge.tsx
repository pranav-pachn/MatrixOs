import React from "react";
import { Status } from "@/types/runtime";

interface ResourceBadgeProps {
  name: string;
  type: string;
  status: Status;
}

export function ResourceBadge({ name, type, status }: ResourceBadgeProps) {
  // UX Law: Law of Similarity - We consistently color code statuses across the entire app
  const statusConfig = {
    available: { bg: "bg-chart-4", text: "text-foreground", label: "Available", border: "border-chart-4/20" },
    occupied: { bg: "bg-chart-2", text: "text-foreground", label: "Occupied", border: "border-chart-2/20" },
    unavailable: { bg: "bg-muted-foreground", text: "text-muted-foreground", label: "Unavailable", border: "border-muted/50" },
    failed: { bg: "bg-destructive", text: "text-destructive", label: "Failed", border: "border-destructive/20" },
  };

  const config = statusConfig[status];

  return (
    // UX Law: Fitts's Law - Giving it comfortable padding even though it's a small badge
    // UX Law: Law of Common Region - Neomorphic inset encapsulates the resource
    <div className={`flex items-center justify-between p-2 rounded-lg border bg-background/50 shadow-neu-inset transition-all duration-300 hover:scale-[1.02] hover:bg-card hover:shadow-neu-raised cursor-pointer group ${config.border}`}>
      <div className="flex items-center space-x-3">
        <span className="text-sm font-sans font-medium text-foreground">{name}</span>
        <span className="text-xs font-mono text-muted-foreground">{type}</span>
      </div>
      
      <div className="flex items-center space-x-2 bg-card px-2 py-1 rounded-md border border-border/50">
        <span className={`h-2 w-2 rounded-full ${config.bg}`}></span>
        <span className={`text-[10px] uppercase font-mono tracking-wider ${config.text}`}>
          {config.label}
        </span>
      </div>
    </div>
  );
}
