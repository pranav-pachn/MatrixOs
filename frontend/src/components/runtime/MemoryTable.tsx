"use client";

import React, { useState } from "react";
import { CheckCircle, XCircle, X } from "@phosphor-icons/react/dist/ssr";
import { motion, AnimatePresence } from "framer-motion";

import { useRuntimeStore } from "@/lib/store/runtime";

export function MemoryTable() {
  const [selectedMemId, setSelectedMemId] = useState<string | null>(null);
  const memories = useRuntimeStore((state) => state.memories);
  
  const selectedMem = memories.find(m => m.id === selectedMemId);

  return (
    <>
      <div className="bg-card/20 backdrop-blur-2xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden relative z-0">
        <div className="p-4 border-b border-border/50 bg-background/50">
          <h2 className="text-lg font-bold font-sans tracking-tight text-foreground">Episodic Memory Bank</h2>
          <p className="text-xs text-muted-foreground font-sans mt-1">Historical resolution strategies and outcome telemetry.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 bg-background/20 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                <th className="p-4 font-normal">Memory ID</th>
                <th className="p-4 font-normal">Divergence Type</th>
                <th className="p-4 font-normal">Applied Strategy</th>
                <th className="p-4 font-normal text-right">Confidence</th>
                <th className="p-4 font-normal text-center">Outcome</th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm">
              {memories.map((mem) => (
                <motion.tr 
                  layoutId={`row-${mem.id}`}
                  key={mem.id} 
                  onClick={() => setSelectedMemId(mem.id)}
                  className="border-b border-border/30 hover:bg-card/60 transition-colors cursor-pointer group"
                  whileHover={{ backgroundColor: "rgba(108, 99, 255, 0.1)" }}
                >
                  <td className="p-4 text-foreground/70 group-hover:text-primary transition-colors">{mem.id}</td>
                  <td className="p-4 text-foreground font-bold">{mem.type}</td>
                  <td className="p-4 text-primary">{mem.strategy}</td>
                  <td className="p-4 text-right">
                    <span className={`px-2 py-1 rounded bg-background/50 border ${mem.confidence > 80 ? 'border-chart-4/50 text-chart-4' : mem.confidence > 60 ? 'border-chart-2/50 text-chart-2' : 'border-destructive/50 text-destructive'}`}>
                      {mem.confidence}%
                    </span>
                  </td>
                  <td className="p-4 flex justify-center">
                    {mem.outcome === "success" ? (
                      <div className="flex items-center gap-2 text-chart-4 bg-chart-4/10 px-2 py-1 rounded border border-chart-4/30">
                        <CheckCircle weight="fill" />
                        <span className="text-[10px] uppercase tracking-wider">Success</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-destructive bg-destructive/10 px-2 py-1 rounded border border-destructive/30">
                        <XCircle weight="fill" />
                        <span className="text-[10px] uppercase tracking-wider">Failed</span>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expanded Modal Overlay */}
      <AnimatePresence>
        {selectedMem && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMemId(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 cursor-pointer"
            >
              {/* Modal Card */}
              <motion.div 
                layoutId={`row-${selectedMem.id}`}
                onClick={(e) => e.stopPropagation()}
                className="bg-card border border-primary/50 shadow-[0_0_50px_rgba(108,99,255,0.3)] rounded-2xl w-full max-w-2xl overflow-hidden cursor-default"
              >
                {/* Header */}
                <div className="p-6 border-b border-border/50 bg-background/50 flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold font-sans text-foreground flex items-center gap-3">
                      {selectedMem.type}
                      {selectedMem.outcome === "success" ? (
                        <span className="text-[10px] font-mono px-2 py-1 rounded bg-chart-4/10 text-chart-4 border border-chart-4/30 uppercase tracking-widest flex items-center gap-1">
                          <CheckCircle weight="fill"/> Recovered
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-1 rounded bg-destructive/10 text-destructive border border-destructive/30 uppercase tracking-widest flex items-center gap-1">
                          <XCircle weight="fill"/> Failed
                        </span>
                      )}
                    </h2>
                    <p className="text-sm font-mono text-muted-foreground mt-2">Archive ID: <span className="text-primary">{selectedMem.id}</span> • {new Date(selectedMem.date).toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedMemId(null)}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                  >
                    <X size={20} className="text-muted-foreground hover:text-foreground" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground mb-2">Executed Strategy</h3>
                    <div className="text-xl font-sans font-bold text-primary">{selectedMem.strategy}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-border/50 bg-background/30 shadow-neu-inset">
                      <h3 className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground mb-1">Neural Confidence</h3>
                      <div className="text-3xl font-mono font-bold text-foreground">{selectedMem.confidence}%</div>
                    </div>
                    <div className="p-4 rounded-xl border border-border/50 bg-background/30 shadow-neu-inset">
                      <h3 className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground mb-1">Resolution Time</h3>
                      <div className="text-3xl font-mono font-bold text-foreground">1.24s</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-border/50 bg-background/30">
                     <h3 className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground mb-2">System Telemetry Log</h3>
                     <div className="font-mono text-xs text-muted-foreground space-y-1">
                       <p>{`> [${selectedMem.id}] Event detected: ${selectedMem.type}`}</p>
                       <p>{`> Querying episodic memory banks...`}</p>
                       <p>{`> Strategy loaded: ${selectedMem.strategy} (Confidence: ${selectedMem.confidence}%)`}</p>
                       <p className={selectedMem.outcome === 'success' ? 'text-chart-4' : 'text-destructive'}>
                         {`> Outcome: ${selectedMem.outcome.toUpperCase()}`}
                       </p>
                     </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
