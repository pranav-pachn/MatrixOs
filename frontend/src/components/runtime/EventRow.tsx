"use client";

import React from "react";
import { motion } from "framer-motion";

export interface EventRowProps {
  id: string;
  type: string;
  timestamp: string;
  severity: "info" | "warning" | "critical";
  description: string;
}

export function EventRow({ id, type, timestamp, severity, description }: EventRowProps) {
  const severityStyles = {
    info: {
      dot: "bg-chart-3 shadow-[0_0_8px_rgba(41,182,246,0.6)]",
      badge: "text-chart-3 border-chart-3/30 bg-chart-3/10",
      rowHover: "hover:bg-chart-3/5",
    },
    warning: {
      dot: "bg-chart-2 shadow-[0_0_8px_rgba(245,166,35,0.6)]",
      badge: "text-chart-2 border-chart-2/30 bg-chart-2/10",
      rowHover: "hover:bg-chart-2/5",
    },
    critical: {
      dot: "bg-destructive shadow-[0_0_12px_rgba(255,77,77,0.8)] animate-pulse",
      badge: "text-destructive border-destructive/30 bg-destructive/10",
      rowHover: "hover:bg-destructive/10",
    },
  };

  // Format timestamp to be cleaner (just the time part HH:MM:SS)
  const timeString = new Date(timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`group flex items-center justify-between py-3 px-4 border-b border-border/40 transition-colors ${severityStyles[severity].rowHover}`}
    >
      <div className="flex items-center gap-6 flex-1 min-w-0">
        
        {/* Timestamp */}
        <div className="flex items-center gap-3 w-24 shrink-0">
          <div className={`w-1.5 h-1.5 rounded-full ${severityStyles[severity].dot}`} />
          <span className="text-[11px] font-mono text-muted-foreground">{timeString}</span>
        </div>
        
        {/* Type Badge */}
        <div className="w-32 shrink-0">
          <span className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-widest border ${severityStyles[severity].badge}`}>
            {type.replace("_", " ")}
          </span>
        </div>
        
        {/* Description */}
        <span className="text-sm font-sans text-foreground/90 truncate">
          {description}
        </span>
      </div>
      
      {/* ID (Faded out until hover) */}
      <div className="shrink-0 pl-4">
        <span className="text-[10px] font-mono text-muted-foreground/40 group-hover:text-muted-foreground transition-colors">
          {id}
        </span>
      </div>
    </motion.div>
  );
}
