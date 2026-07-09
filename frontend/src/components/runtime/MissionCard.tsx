"use client";

import React from "react";
import { Mission } from "@/types/runtime";
import { motion } from "framer-motion";

interface MissionCardProps {
  mission: Mission;
}

export function MissionCard({ mission }: MissionCardProps) {
  // UX Law: Von Restorff Effect - Diverged missions heavily stand out
  const isDiverged = mission.status === "diverged";
  
  // UX Law: Law of Similarity - Colors map exactly to our semantic definitions
  const statusColors = {
    "normal": "bg-chart-3", // Cyan (Data)
    "in-progress": "bg-primary", // Purple (Active)
    "delayed": "bg-chart-2", // Amber (Optimization needed)
    "recovered": "bg-chart-4", // Green (Success)
    "diverged": "bg-destructive", // Red (Alert)
  };

  const statusColor = statusColors[mission.status];

  return (
    // UX Law: Law of Common Region - Neomorphic raised card
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative flex flex-col p-4 rounded-xl border bg-card transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(108,99,255,0.15)] hover:border-primary/50 cursor-pointer group ${
        isDiverged 
          ? "border-destructive shadow-[0_0_15px_rgba(255,77,77,0.2)]" 
          : "border-border shadow-neu-raised"
      }`}
    >
      {/* Left indicator strip */}
      <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-md ${statusColor}`} />

      <div className="pl-2 flex justify-between items-start mb-3">
        <div>
          <h4 className="text-lg font-bold font-sans tracking-tight text-foreground group-hover:text-primary transition-colors">
            {mission.name}
          </h4>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            {mission.id} • {mission.type}
          </p>
        </div>
        
        {/* UX Law: Progressive Disclosure - We only show high-level status badge here */}
        <div className="px-2 py-1 rounded bg-background/50 border border-border">
          <span className={`text-[10px] font-mono uppercase tracking-widest ${isDiverged ? "text-destructive font-bold" : "text-muted-foreground"}`}>
            {mission.status}
          </span>
        </div>
      </div>

      <div className="pl-2 grid grid-cols-2 gap-4 mt-2">
        {/* UX Law: Law of Proximity - Grouping related meta-data tightly */}
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground uppercase">Priority</span>
          <span className="text-sm font-sans text-foreground">Level {mission.priority}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground uppercase">Deadline</span>
          <span className="text-sm font-mono text-foreground" suppressHydrationWarning>
            {new Date(mission.deadline).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
        </div>
      </div>

      {/* Progress Bar (Zeigarnik Principle) */}
      <div className="pl-2 mt-4">
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
          <span>Tasks Complete</span>
          <span>
            {mission.tasks.filter(t => t.status === "complete").length} / {mission.tasks.length}
          </span>
        </div>
        <div className="h-1.5 w-full bg-background rounded-full overflow-hidden shadow-neu-inset">
          <motion.div 
            className={`h-full rounded-full ${statusColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${(mission.tasks.filter(t => t.status === "complete").length / Math.max(1, mission.tasks.length)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
