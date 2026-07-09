"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PipelineStep } from "./PipelineStep";
import { useRuntimeStore } from "@/lib/store/runtime";

export function RecoveryConsole() {
  const steps = useRuntimeStore((state) => state.recovery.steps);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  useEffect(() => {
    setCurrentStepIndex(0); // Reset when scenario changes
    const timer = setInterval(() => {
      setCurrentStepIndex(prev => (prev < steps.length ? prev + 1 : 0));
    }, 4000);
    return () => clearInterval(timer);
  }, [steps]);

  return (
    <div className="flex flex-col h-full bg-card/20 backdrop-blur-2xl rounded-2xl border border-border/50 shadow-2xl p-6 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-chart-4/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mb-8 relative z-10">
        <h2 className="text-2xl font-bold font-sans tracking-tight text-foreground flex items-center gap-3">
          AI Recovery Pipeline
        </h2>
        <p className="text-sm text-muted-foreground font-sans mt-1">
          Autonomous divergence resolution and live execution tracking.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 relative z-10">
        
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const status = currentStepIndex > index ? "complete" : currentStepIndex === index ? "active" : "pending";
          
          return (
            <PipelineStep 
              key={step.id}
              step={stepNum} 
              title={step.title} 
              status={status}
              isLast={index === steps.length - 1}
            >
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{step.description}</p>
                
                {step.codeSnippet && (
                  <div className="bg-background/80 p-3 rounded-lg border border-border/50 font-mono text-[10px] text-chart-3 overflow-x-auto whitespace-pre">
                    {step.codeSnippet}
                  </div>
                )}
                
                {step.metrics && step.metrics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {step.metrics.map((m, i) => (
                      <div key={i} className="flex items-center gap-2 px-2 py-1 bg-card border border-border/50 rounded-md text-xs">
                        <span className="text-muted-foreground uppercase font-mono text-[9px]">{m.label}</span>
                        <span className="font-bold font-mono text-foreground">{m.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {index === steps.length - 1 && (
                  <div className="h-1.5 w-full bg-background rounded-full overflow-hidden mt-3 border border-border/50">
                    <motion.div 
                      className="h-full bg-chart-4"
                      initial={{ width: 0 }}
                      animate={status === "complete" ? { width: "100%" } : status === "active" ? { width: "40%" } : { width: "0%" }}
                      transition={{ duration: 2 }}
                    />
                  </div>
                )}
              </div>
            </PipelineStep>
          );
        })}

      </div>
    </div>
  );
}
