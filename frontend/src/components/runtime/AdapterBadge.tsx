import React from "react";

interface AdapterBadgeProps {
  status: "live" | "coming-soon";
}

export function AdapterBadge({ status }: AdapterBadgeProps) {
  if (status === "live") {
    return (
      <div className="inline-flex items-center space-x-2 rounded-full border border-border bg-card px-3 py-1 shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chart-4 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-chart-4"></span>
        </span>
        <span className="font-mono text-xs font-medium uppercase tracking-wider text-foreground">
          Live
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center space-x-2 rounded-full border border-border/50 bg-card/50 px-3 py-1 opacity-75">
      <span className="relative flex h-2 w-2">
        <span className="relative inline-flex h-2 w-2 rounded-full bg-muted-foreground"></span>
      </span>
      <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Coming Soon
      </span>
    </div>
  );
}
