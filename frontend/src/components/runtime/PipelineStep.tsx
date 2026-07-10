"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, CircleDashed, CircleNotch, XCircle } from "@phosphor-icons/react/dist/ssr";

export interface PipelineStepProps {
  step: number;
  title: string;
  status: "pending" | "active" | "complete" | "rejected" | "failed";
  children: React.ReactNode;
  isLast?: boolean;
}

export function PipelineStep({ step, title, status, children, isLast = false }: PipelineStepProps) {
  const statusConfig = {
    pending: {
      color: "text-muted-foreground",
      bg: "bg-muted",
      border: "border-border/30",
      icon: <CircleDashed size={24} weight="regular" />,
      glow: ""
    },
    active: {
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/50",
      icon: <CircleNotch size={24} weight="bold" className="animate-spin" />,
      glow: "shadow-[0_0_20px_rgba(108,99,255,0.3)]"
    },
    complete: {
      color: "text-chart-4",
      bg: "bg-chart-4/10",
      border: "border-chart-4/50",
      icon: <CheckCircle size={24} weight="fill" />,
      glow: "shadow-[0_0_15px_rgba(0,208,132,0.2)]"
    },
    rejected: {
      color: "text-destructive",
      bg: "bg-destructive/10",
      border: "border-destructive/50",
      icon: <XCircle size={24} weight="fill" />,
      glow: "shadow-[0_0_15px_rgba(255,77,77,0.2)]"
    },
    failed: {
      color: "text-destructive",
      bg: "bg-destructive/10",
      border: "border-destructive/50",
      icon: <XCircle size={24} weight="fill" />,
      glow: "shadow-[0_0_15px_rgba(255,77,77,0.2)]"
    }
  };

  const config = statusConfig[status];

  return (
    <div className="relative flex gap-6 min-h-[100px]">
      
      {/* Vertical Timeline Connector Line */}
      {!isLast && (
        <div className={`absolute left-[15px] top-12 bottom-[-16px] w-0.5 ${status === "complete" ? "bg-chart-4/30" : "bg-border/40"}`} />
      )}

      {/* Step Indicator */}
      <div className="relative z-10 shrink-0 flex flex-col items-center mt-1">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${config.bg} ${config.border} ${config.color} ${config.glow} transition-all duration-500`}>
          {status === "pending" ? (
            <span className="text-xs font-mono font-bold">{step}</span>
          ) : (
            config.icon
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl border backdrop-blur-md p-5 transition-all duration-500 ${
            status === "active" 
              ? "bg-card border-primary/40 shadow-neu-raised" 
              : "bg-card/40 border-border/40 shadow-neu-inset"
          } ${status === "pending" ? "opacity-50 grayscale" : ""}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-bold font-sans tracking-tight ${status === "active" ? "text-foreground" : config.color}`}>
              {title}
            </h3>
            <span className={`text-[10px] uppercase font-mono tracking-widest px-2 py-1 rounded border ${config.bg} ${config.border} ${config.color}`}>
              {status}
            </span>
          </div>
          
          <div className="text-sm font-sans text-foreground/80 leading-relaxed">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
