import React from "react";
import { Handle, Position } from "@xyflow/react";

export function ResourceNode({ data }: any) {
  const isFailed = data.status === "failed";

  return (
    <div className="px-4 py-2 rounded-full border border-border/50 bg-background shadow-neu-inset transition-all hover:scale-105 flex items-center space-x-2">
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-foreground border-none" />
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-foreground border-none" />
      
      <span className={`h-2 w-2 rounded-full ${isFailed ? "bg-destructive animate-pulse" : "bg-chart-2"}`}></span>
      <span className="text-xs font-sans font-bold text-foreground">
        {data.label}
      </span>

      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-foreground border-none" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-foreground border-none" />
    </div>
  );
}
