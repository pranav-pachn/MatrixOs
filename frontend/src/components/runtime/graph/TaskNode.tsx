import React from "react";
import { Handle, Position } from "@xyflow/react";

export function TaskNode({ data }: any) {
  const isComplete = data.status === "complete";
  
  return (
    <div className={`px-4 py-2 rounded-lg border bg-card/80 backdrop-blur-md shadow-neu-raised transition-all hover:scale-105 ${isComplete ? "border-chart-4/50" : "border-muted-foreground/30"}`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-foreground border-none" />
      <div className="flex items-center space-x-2">
        <span className={`h-2 w-2 rounded-full ${isComplete ? "bg-chart-4" : "bg-muted-foreground"}`}></span>
        <span className="text-[10px] font-mono uppercase text-muted-foreground">
          {isComplete ? "Complete" : "Pending"}
        </span>
      </div>
      <div className="mt-1 font-sans font-bold text-foreground">
        {data.label}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-foreground border-none" />
    </div>
  );
}
