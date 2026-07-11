"use client";

import React, { useState } from "react";
import { useRuntimeStore } from "@/lib/store/runtime";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, CheckCircle, XCircle, ArrowRight, Lightbulb,
  ClockCounterClockwise, ShieldCheck, BookOpen,
  SealQuestion, ArrowElbowDownRight, Star, TreeStructure
} from "@phosphor-icons/react/dist/ssr";

const tabs = [
  { id: "episodic", label: "What the AI Learned", icon: Brain },
  { id: "playbooks", label: "How the AI Acts", icon: TreeStructure },
] as const;

function ConfidenceBadge({ value }: { value: number }) {
  const high = value >= 80;
  const med = value >= 60;
  const label = high ? "High Confidence" : med ? "Medium Confidence" : "Low Confidence";
  const color = high
    ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]"
    : med
    ? "text-amber-400 bg-amber-400/10 border-amber-400/20 shadow-[0_0_10px_rgba(251,191,36,0.1)]"
    : "text-rose-400 bg-rose-400/10 border-rose-400/20 shadow-[0_0_10px_rgba(251,113,133,0.1)]";
  return (
    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${color} inline-flex items-center gap-1 backdrop-blur-md`}>
      <Star size={10} weight="fill" />
      {value}% &middot; {label}
    </span>
  );
}

function getExplanation(mem: any) {
  return mem.outcome === "success"
    ? `When a "${mem.type}" incident happened before, the AI used "${mem.strategy}" and it worked. So next time this happens, the AI will try the same approach with ${mem.confidence}% confidence.`
    : `The AI tried "${mem.strategy}" for a "${mem.type}" incident but it didn't fully resolve the problem. The AI has learned from this and will adjust its approach next time.`;
}

const PLAYBOOKS = [
  {
    id: "pb_1",
    trigger: "A critical resource breaks down (e.g., fuel truck, MRI machine, forklift)",
    whatHappens: "The AI scans all available backup resources, finds the closest compatible replacement, and re-assigns it to the impacted task automatically.",
    steps: [
      "Detect the failed resource and identify affected tasks",
      "Search for idle or low-priority resources of the same type",
      "Validate the replacement meets all constraints (time, location, capability)",
      "Re-assign and update the operational dashboard",
    ],
    successRate: 94,
    Icon: ShieldCheck,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10 border-emerald-400/20",
    barColor: "bg-gradient-to-r from-emerald-500 to-emerald-300",
  },
  {
    id: "pb_2",
    trigger: "A chain of delays causes a mission to miss its deadline",
    whatHappens: "The AI identifies which tasks are blocking progress, re-sequences the schedule to unlock the critical path, and deprioritizes non-urgent tasks.",
    steps: [
      "Identify the bottleneck task causing the cascade",
      "Re-calculate task priority scores across all missions",
      "Move non-critical tasks to a delayed queue",
      "Fast-track the critical path with dedicated resources",
    ],
    successRate: 88,
    Icon: ClockCounterClockwise,
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10 border-cyan-400/20",
    barColor: "bg-gradient-to-r from-cyan-500 to-cyan-300",
  },
  {
    id: "pb_3",
    trigger: "An unexpected emergency overrides the current plan",
    whatHappens: "All non-critical operations are paused and resources are immediately redirected to the emergency mission. The AI ensures the highest-priority task always gets resources first.",
    steps: [
      "Flag mission as Priority 1 (emergency override)",
      "Freeze all lower-priority task assignments",
      "Redirect available specialized resources to the emergency",
      "Resume normal operations after emergency is stabilized",
    ],
    successRate: 99,
    Icon: Lightbulb,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10 border-amber-400/20",
    barColor: "bg-gradient-to-r from-amber-500 to-amber-300",
  },
];

function EpisodicView() {
  const memories = useRuntimeStore((s) => s.memories);
  const [selected, setSelected] = useState<any>(null);

  return (
    <div className="h-full flex gap-6 min-h-0">
      <div className="flex-1 flex flex-col min-h-0 bg-card/40 backdrop-blur-3xl rounded-2xl border border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none opacity-50" />
        <div className="p-6 border-b border-white/5 bg-background/20 flex-shrink-0 relative z-10 backdrop-blur-md">
          <h2 className="text-lg font-bold font-sans text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 flex items-center gap-3">
            <ClockCounterClockwise weight="duotone" className="text-primary" size={24} />
            Incident History
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Every past event the AI has seen and responded to. Click any entry to understand what happened.</p>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3 min-h-0 custom-scrollbar relative z-10">
          {memories.map((mem, i) => (
            <motion.button
              key={mem.id}
              onClick={() => setSelected(mem)}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 25 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                selected?.id === mem.id
                  ? "bg-primary/10 border-primary/40 shadow-[0_0_25px_rgba(108,99,255,0.2)]"
                  : "bg-background/40 border-white/5 hover:border-primary/20 hover:bg-card/60 hover:shadow-lg"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-inner ${mem.outcome === "success" ? "bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20" : "bg-gradient-to-br from-rose-500/20 to-rose-500/5 border border-rose-500/20"}`}>
                    {mem.outcome === "success"
                      ? <CheckCircle size={20} weight="fill" className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                      : <XCircle size={20} weight="fill" className="text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]" />}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold font-sans text-base text-foreground truncate">{mem.type}</div>
                    <div className="text-xs text-muted-foreground/80 truncate flex items-center gap-1.5 mt-1">
                      <ArrowElbowDownRight size={12} className="text-primary/70" />
                      {mem.strategy}
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right flex flex-col items-end gap-1.5">
                  <ConfidenceBadge value={mem.confidence} />
                  <div className="text-[10px] text-muted-foreground/60 font-mono tracking-wider" suppressHydrationWarning>{new Date(mem.date).toLocaleDateString()}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="w-[350px] flex-shrink-0">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
              className="bg-card/40 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-6 h-full flex flex-col relative overflow-hidden"
            >
              {/* Subtle top glow */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
              
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  {selected.outcome === "success"
                    ? <CheckCircle size={22} weight="fill" className="text-emerald-400" />
                    : <XCircle size={22} weight="fill" className="text-rose-400" />}
                  <span className={`text-xs font-mono uppercase tracking-widest font-bold ${selected.outcome === "success" ? "text-emerald-400" : "text-rose-400"}`}>
                    {selected.outcome === "success" ? "Successfully Resolved" : "Partially Failed"}
                  </span>
                </div>
                <h3 className="text-xl font-bold font-sans text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">{selected.type}</h3>
                <p className="text-xs text-muted-foreground/60 font-mono mt-1" suppressHydrationWarning>{selected.id} &middot; {new Date(selected.date).toLocaleString()}</p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 mb-6 shadow-inner relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center gap-2 mb-2 text-[10px] uppercase font-mono tracking-widest text-primary font-bold">
                  <BookOpen size={14} weight="duotone" />
                  What This Means
                </div>
                <p className="text-sm font-sans text-foreground/90 leading-relaxed relative z-10">{getExplanation(selected)}</p>
              </div>

              <div className="mb-6">
                <div className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground/80 mb-2">Strategy Used</div>
                <div className="flex items-center gap-3 p-3.5 bg-background/50 backdrop-blur-md rounded-xl border border-white/5 shadow-sm">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <ArrowRight size={16} weight="bold" />
                  </div>
                  <span className="text-sm font-bold font-sans text-foreground/90">{selected.strategy}</span>
                </div>
              </div>

              <div className="p-4 bg-background/40 backdrop-blur-md rounded-xl border border-white/5 shadow-sm">
                <div className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground/80 mb-3">Confidence Score</div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-white/5 rounded-full h-2.5 overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selected.confidence}%` }}
                      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                      className={`h-full rounded-full ${selected.confidence >= 80 ? "bg-gradient-to-r from-emerald-500 to-emerald-400" : selected.confidence >= 60 ? "bg-gradient-to-r from-amber-500 to-amber-400" : "bg-gradient-to-r from-rose-500 to-rose-400"}`}
                    />
                  </div>
                  <span className="text-base font-bold font-mono text-foreground drop-shadow-md">{selected.confidence}%</span>
                </div>
                <p className="text-xs text-muted-foreground/70 mt-3 leading-relaxed">
                  {selected.confidence >= 80
                    ? "The AI is very confident this strategy will work again."
                    : selected.confidence >= 60
                    ? "The AI thinks this will probably work, but may explore alternatives."
                    : "Low confidence — the AI will likely try a different approach next time."}
                </p>
              </div>

              <button 
                onClick={() => setSelected(null)} 
                className="mt-auto pt-6 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors text-center w-full flex justify-center items-center gap-2 group"
              >
                <ArrowRight size={12} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> 
                Back to list
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full bg-card/20 backdrop-blur-xl border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="p-4 rounded-full bg-white/5 mb-4 border border-white/5 shadow-inner">
                <SealQuestion size={32} className="text-muted-foreground/50" weight="duotone" />
              </div>
              <h3 className="text-base font-bold font-sans text-muted-foreground">Select an incident</h3>
              <p className="text-sm text-muted-foreground/60 mt-2 leading-relaxed">
                Click any incident from the list to see a plain-English explanation of what happened and how the AI responded.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PlaybooksView() {
  const [expanded, setExpanded] = useState<string>(PLAYBOOKS[0].id);

  return (
    <div className="h-full flex flex-col min-h-0 max-w-4xl mx-auto w-full">
      <div className="mb-6 p-5 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl flex items-start gap-4 shadow-lg backdrop-blur-md">
        <div className="p-2 bg-primary/20 rounded-xl text-primary shadow-inner mt-0.5">
          <Lightbulb size={24} weight="duotone" />
        </div>
        <div>
          <h3 className="text-sm font-bold font-sans text-foreground mb-1">AI Operational Rules</h3>
          <p className="text-sm font-sans text-foreground/70 leading-relaxed">
            These are the <strong className="text-foreground">rules the AI follows</strong> when it detects a problem. Think of them as emergency response playbooks — each one describes a situation, what the AI does about it, and how often it works.
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 min-h-0 custom-scrollbar pr-2">
        {PLAYBOOKS.map((pb) => {
          const isOpen = expanded === pb.id;
          const Icon = pb.Icon;
          return (
            <motion.div
              key={pb.id}
              layout
              className={`rounded-2xl border overflow-hidden transition-all duration-300 ${isOpen ? "bg-card/60 backdrop-blur-3xl border-primary/30 shadow-[0_8px_30px_rgb(0,0,0,0.15)] shadow-primary/5" : "bg-card/20 backdrop-blur-xl border-white/5 hover:border-white/10 cursor-pointer hover:bg-card/30"}`}
              onClick={() => !isOpen && setExpanded(pb.id)}
            >
              <div className="p-5 flex items-center gap-5">
                <div className={`flex-shrink-0 p-3 rounded-xl border shadow-inner ${pb.bgColor}`}>
                  <Icon size={24} weight="duotone" className={pb.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground/80 mb-1">Triggered When</div>
                  <p className="text-base font-bold font-sans text-foreground/90 leading-snug">{pb.trigger}</p>
                </div>
                <div className="flex-shrink-0 text-right bg-background/40 p-3 rounded-xl border border-white/5 backdrop-blur-md">
                  <div className="text-[10px] text-muted-foreground/80 font-mono uppercase tracking-wider mb-1">Success Rate</div>
                  <div className={`text-xl font-bold font-mono ${pb.color} drop-shadow-md`}>{pb.successRate}%</div>
                </div>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, type: "spring", bounce: 0.1 }}
                    className="border-t border-white/5 bg-background/20 backdrop-blur-md"
                  >
                    <div className="p-6 space-y-6">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 shadow-inner relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="text-[11px] uppercase font-mono tracking-widest text-primary mb-3 flex items-center gap-2 font-bold">
                          <BookOpen size={14} weight="duotone" />
                          What the AI Does
                        </div>
                        <p className="text-sm font-sans text-foreground/90 leading-relaxed relative z-10">{pb.whatHappens}</p>
                      </div>
                      <div className="pl-2">
                        <div className="text-[11px] uppercase font-mono tracking-widest text-muted-foreground/80 mb-4">Step-by-Step Process</div>
                        <div className="space-y-4 relative">
                          <div className="absolute left-3.5 top-2 bottom-2 w-px bg-white/10" />
                          {pb.steps.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-4 group relative z-10">
                              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-card border-2 border-white/10 shadow-md flex items-center justify-center text-[11px] font-bold font-mono text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/40 transition-all duration-300">
                                {idx + 1}
                              </div>
                              <p className="text-sm font-sans text-foreground/80 group-hover:text-foreground transition-colors leading-relaxed pt-1">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="pt-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[11px] uppercase font-mono tracking-widest text-muted-foreground/80">Historical Success Rate</span>
                          <span className={`text-sm font-bold font-mono ${pb.color}`}>{pb.successRate}%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2 shadow-inner overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${pb.successRate}%` }}
                            transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
                            className={`h-full rounded-full ${pb.barColor}`} 
                          />
                        </div>
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

export default function MemoryPage() {
  const [activeTab, setActiveTab] = useState<"episodic" | "playbooks">("episodic");

  return (
    <div className="h-full flex flex-col p-6 bg-background relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-chart-4/5 blur-[100px] pointer-events-none" />

      <div className="mb-8 relative z-10">
        <h1 className="text-3xl font-bold font-sans tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">AI Memory Center</h1>
        <p className="text-sm text-muted-foreground/80 font-sans mt-2 max-w-2xl leading-relaxed">
          Everything the AI has learned from past incidents — and the rules it uses to respond automatically to future disruptions.
        </p>
      </div>

      <div className="flex items-center space-x-2 mb-8 bg-card/30 backdrop-blur-xl p-1.5 rounded-xl border border-white/10 self-start shadow-sm relative z-10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-lg text-sm font-sans font-bold transition-all duration-300 ${isActive ? "text-primary-foreground drop-shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
            >
              {isActive && (
                <motion.div
                  layoutId="memTabIndicatorPremium"
                  className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 rounded-lg shadow-[0_4px_15px_rgba(108,99,255,0.4)] border border-primary/20"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon size={18} weight={isActive ? "fill" : "duotone"} />
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 min-h-0 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === "episodic" ? (
            <motion.div key="episodic" initial={{ opacity: 0, y: 15, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -15, scale: 0.98 }} transition={{ duration: 0.3, ease: "easeOut" }} className="h-full">
              <EpisodicView />
            </motion.div>
          ) : (
            <motion.div key="playbooks" initial={{ opacity: 0, y: 15, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -15, scale: 0.98 }} transition={{ duration: 0.3, ease: "easeOut" }} className="h-full">
              <PlaybooksView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
