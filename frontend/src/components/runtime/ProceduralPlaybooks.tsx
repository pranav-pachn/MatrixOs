"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileCode, PlayCircle, CaretRight, ShieldCheck, TreeStructure } from "@phosphor-icons/react/dist/ssr";

const PLAYBOOKS = [
  {
    id: "pb_fuel_01",
    name: "Fuel Logistics Resupply",
    category: "Logistics",
    successRate: 94.2,
    executions: 128,
    steps: [
      "Identify immediate operational shortfall based on active missions.",
      "Re-allocate idle fuel trucks to high-priority zones.",
      "Initiate emergency off-airport fuel requisition protocol.",
      "Stall low-priority passenger flights by 15-30 mins."
    ]
  },
  {
    id: "pb_sec_04",
    name: "Terminal Breach Containment",
    category: "Security",
    successRate: 98.9,
    executions: 12,
    steps: [
      "Lock down affected terminal sector.",
      "Deploy rapid response drone fleet for surveillance.",
      "Reroute incoming passengers to adjacent sectors.",
      "Alert local law enforcement API."
    ]
  },
  {
    id: "pb_weather_02",
    name: "Severe Weather Grounding",
    category: "Operations",
    successRate: 88.5,
    executions: 45,
    steps: [
      "Halt all ground handling operations.",
      "Secure ground equipment to anchor points.",
      "Notify ATC of operational freeze.",
      "Begin passenger compensation & rebooking routines."
    ]
  }
];

export function ProceduralPlaybooks() {
  const [expandedId, setExpandedId] = useState<string | null>(PLAYBOOKS[0].id);

  return (
    <div className="h-full w-full flex flex-col bg-card/20 backdrop-blur-2xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden relative">
      <div className="p-5 border-b border-border/50 bg-background/50 flex items-center justify-between z-10">
        <div>
          <h2 className="text-lg font-bold font-sans tracking-tight text-foreground flex items-center gap-2">
            <TreeStructure weight="duotone" className="text-chart-2" />
            Procedural Rule Weights
          </h2>
          <p className="text-xs text-muted-foreground font-sans mt-1">Encoded standard operating procedures and execution confidence.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {PLAYBOOKS.map((playbook) => {
          const isExpanded = expandedId === playbook.id;
          
          return (
            <motion.div 
              layout
              key={playbook.id}
              className={`rounded-xl border transition-colors overflow-hidden ${
                isExpanded ? 'bg-card border-primary/50 shadow-neu-raised' : 'bg-background/40 border-border/50 hover:border-border cursor-pointer'
              }`}
              onClick={() => !isExpanded && setExpandedId(playbook.id)}
            >
              {/* Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${isExpanded ? 'bg-primary/20 text-primary' : 'bg-background text-muted-foreground'}`}>
                    <FileCode size={24} weight="duotone" />
                  </div>
                  <div>
                    <h3 className={`font-bold font-sans transition-colors ${isExpanded ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {playbook.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
                      <span>{playbook.category}</span>
                      <span className="w-1 h-1 rounded-full bg-border"></span>
                      <span>ID: {playbook.id}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] font-mono text-muted-foreground uppercase mb-0.5">Success Rate</div>
                    <div className="text-sm font-bold text-chart-4">{playbook.successRate}%</div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] font-mono text-muted-foreground uppercase mb-0.5">Executions</div>
                    <div className="text-sm font-bold text-foreground">{playbook.executions}</div>
                  </div>
                  <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} className="text-muted-foreground">
                    <CaretRight size={20} />
                  </motion.div>
                </div>
              </div>

              {/* Body */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="border-t border-border/30 bg-background/20"
                  >
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-4 text-xs font-mono uppercase text-muted-foreground">
                        <ShieldCheck size={16} className="text-chart-2" />
                        Encoded Steps sequence
                      </div>
                      <div className="space-y-3">
                        {playbook.steps.map((step, idx) => (
                          <div key={idx} className="flex gap-3 items-start group">
                            <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-card border border-border/50 flex items-center justify-center text-[10px] font-mono text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/50 transition-colors">
                              {idx + 1}
                            </div>
                            <div className="text-sm font-mono text-foreground/80 group-hover:text-foreground transition-colors leading-relaxed">
                              {step}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                        <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border hover:border-primary/50 rounded-lg text-xs font-sans font-bold text-foreground transition-all group">
                          <PlayCircle size={16} weight="fill" className="text-primary group-hover:scale-110 transition-transform" />
                          Dry Run Execution
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
