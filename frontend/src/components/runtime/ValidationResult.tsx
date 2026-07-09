"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "@phosphor-icons/react/dist/ssr";

interface ValidationResultProps {
  status: "PASS" | "REJECTED";
  reason?: string;
  constraint: string;
}

export function ValidationResult({ status, reason, constraint }: ValidationResultProps) {
  const isPass = status === "PASS";

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={isPass ? { opacity: 1, x: 0 } : { opacity: 1, x: [-5, 5, -5, 5, 0] }}
      transition={{ duration: 0.3 }}
      className={`group flex items-start space-x-4 p-3 rounded-xl border border-transparent hover:bg-card/40 hover:border-border/50 transition-colors relative ${
        !isPass ? "bg-destructive/5 hover:bg-destructive/10 hover:border-destructive/30" : ""
      }`}
    >
      {/* Connector Line (pretending it's part of a vertical list) */}
      <div className="absolute left-6 top-10 bottom-[-16px] w-px bg-border/40 group-last:hidden" />

      <div className="relative z-10 mt-0.5 bg-background rounded-full">
        {isPass ? (
          <div className="p-0.5 rounded-full bg-chart-4/10 shadow-[0_0_10px_rgba(0,208,132,0.2)] group-hover:shadow-[0_0_15px_rgba(0,208,132,0.4)] transition-shadow">
            <CheckCircle size={20} weight="fill" className="text-chart-4" />
          </div>
        ) : (
          <div className="p-0.5 rounded-full bg-destructive/10 shadow-[0_0_15px_rgba(255,77,77,0.4)]">
            <XCircle size={20} weight="fill" className="text-destructive" />
          </div>
        )}
      </div>
      
      <div className="flex flex-col pt-0.5">
        <span className={`text-[13px] font-sans font-medium transition-colors ${!isPass ? "text-destructive" : "text-foreground/90"}`}>
          {constraint}
        </span>
        {!isPass && reason && (
          <span className="text-[11px] font-mono text-muted-foreground mt-1.5 leading-relaxed bg-background/50 p-2 rounded-md border border-border/50">
            {reason}
          </span>
        )}
      </div>
    </motion.div>
  );
}
