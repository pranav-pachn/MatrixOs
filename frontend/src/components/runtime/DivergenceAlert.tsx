"use client";

import React from "react";
import { motion } from "framer-motion";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";

interface DivergenceAlertProps {
  eventType: string;
  affectedMissions: string[];
  severity: "info" | "warning" | "critical";
}

export function DivergenceAlert({ eventType, affectedMissions, severity }: DivergenceAlertProps) {
  const isCritical = severity === "critical";

  // Split eventType if it has a colon for better typography (e.g., "Resource Failure" | "FT-402 Failed")
  const parts = eventType.split(": ");
  const category = parts.length > 1 ? parts[0] : "System Alert";
  const message = parts.length > 1 ? parts[1] : eventType;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative p-5 rounded-xl border overflow-hidden backdrop-blur-md shadow-2xl transition-all hover:scale-[1.01] ${
        isCritical 
          ? "border-destructive/60 bg-gradient-to-br from-destructive/20 to-destructive/5 shadow-[0_0_30px_rgba(255,77,77,0.15)]" 
          : "border-chart-2/60 bg-gradient-to-br from-chart-2/20 to-chart-2/5 shadow-[0_0_30px_rgba(245,166,35,0.15)]"
      }`}
    >
      {/* Animated warning stripe */}
      {isCritical && (
        <div className="absolute top-0 left-0 w-full h-1 bg-destructive">
          <motion.div 
            className="h-full bg-white/50 w-1/3"
            animate={{ x: ["-100%", "300%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <WarningCircle 
              size={22} 
              weight="duotone" 
              className={isCritical ? "text-destructive animate-pulse" : "text-chart-2"} 
            />
            <h4 className={`text-xs font-bold font-mono uppercase tracking-widest ${isCritical ? "text-destructive" : "text-chart-2"}`}>
              {category}
            </h4>
          </div>
          <span className="text-[10px] bg-background/50 text-muted-foreground px-2 py-0.5 rounded border border-border/50 font-mono">
            {severity.toUpperCase()}
          </span>
        </div>
        
        <p className="text-lg font-sans font-medium text-foreground mb-4 leading-tight">
          {message}
        </p>
        
        <div className="space-y-2 bg-background/40 p-3 rounded-lg border border-border/30">
          <span className="text-[10px] uppercase font-mono text-muted-foreground tracking-widest">Impacted Streams</span>
          <div className="flex flex-wrap gap-2">
            {affectedMissions.map(m => (
              <span key={m} className="px-2.5 py-1 text-xs font-mono font-medium bg-card border border-border/50 rounded-md text-foreground shadow-neu-inset">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
