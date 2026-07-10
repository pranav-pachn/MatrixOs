"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  AirplaneTilt,
  FirstAid,
  Package,
  Factory,
  Lightning,
  Code,
  CaretDown,
  CaretRight,
  CheckCircle,
} from "@phosphor-icons/react/dist/ssr";
import { MatrixLogo } from "@/components/ui/MatrixLogo";

// Adapters
const ADAPTERS = [
  {
    id: "airport",
    title: "Airport",
    description: "Aviation turnaround constraint validation.",
    icon: <AirplaneTilt size={24} weight="duotone" />,
  },
  {
    id: "hospital",
    title: "Hospital",
    description: "Trauma bay and imaging resource routing.",
    icon: <FirstAid size={24} weight="duotone" />,
  },
  {
    id: "warehouse",
    title: "Warehouse",
    description: "Autonomous bot swarm pathfinding.",
    icon: <Package size={24} weight="duotone" />,
  },
  {
    id: "manufacturing",
    title: "Manufacturing",
    description: "Assembly line constraint enforcement.",
    icon: <Factory size={24} weight="duotone" />,
  },
  {
    id: "utilities",
    title: "Utilities",
    description: "Grid load and distribution management.",
    icon: <Lightning size={24} weight="duotone" />,
  },
  {
    id: "custom",
    title: "Custom Adapter",
    description: "Define a blank operational domain.",
    icon: <Code size={24} weight="duotone" />,
  },
];

// Reusable Switch Component
function Switch({ checked, onChange, label, description }: any) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-white/[0.04] last:border-0">
      <div>
        <h4 className="text-sm font-semibold text-white/90">{label}</h4>
        <p className="text-sm text-white/40 font-sans mt-1">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
          checked ? "bg-primary" : "bg-white/10"
        }`}
      >
        <span
          className={`pointer-events-none absolute left-0.5 inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

// Reusable Radio Card Component
function RadioCard({ name, value, selected, onChange, label, description }: any) {
  const isSelected = selected === value;
  return (
    <label
      className={`relative flex cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={isSelected}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center">
          <div className="text-sm">
            <p className={`font-medium ${isSelected ? "text-primary" : "text-white"}`}>
              {label}
            </p>
            {description && (
              <span className={`inline-block mt-1 ${isSelected ? "text-primary/70" : "text-white/40"}`}>
                {description}
              </span>
            )}
          </div>
        </div>
        {isSelected && <CheckCircle size={20} weight="fill" className="text-primary ml-2 shrink-0" />}
      </div>
    </label>
  );
}

export default function NewEnvironmentPage() {
  const router = useRouter();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [adapter, setAdapter] = useState("");
  const [status, setStatus] = useState("development");
  const [visibility, setVisibility] = useState("private");

  // Features State
  const [features, setFeatures] = useState({
    recoveryMemory: true,
    plannerAgent: true,
    recoveryAgent: true,
    runtimeAnalytics: true,
    eventLogging: true,
  });

  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const isValid = name.trim().length > 0 && adapter !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    
    // In a real app, this would be an API call. For now, simulate creation and redirect.
    router.push(`/playground/${adapter || "custom"}`);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-foreground font-sans selection:bg-primary/30">
      
      {/* Minimal Header */}
      <header className="border-b border-white/[0.06] bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <MatrixLogo className="scale-75 origin-left" />
            <span className="text-white/20">/</span>
            <span className="text-sm font-medium text-white/80">New Environment</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 pb-24">
        
        {/* Page Header */}
        <div className="mb-10 border-b border-white/[0.08] pb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight mb-3">
            Create Environment
          </h1>
          <p className="text-white/50 text-base max-w-2xl">
            Configure a new operational environment by defining its identity, adapter, metadata, and runtime behavior.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* 1. General */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/[0.04] pb-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/60">1</span>
              <h2 className="text-xl font-semibold text-white/90">General</h2>
            </div>
            
            <div className="space-y-5 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Environment Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Hospital Emergency Response"
                  className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  required
                />
                <p className="text-xs text-white/40 mt-2 font-mono">
                  Identifier: {slug || "hospital-emergency-response"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Short Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Trauma bay and imaging resource routing."
                  className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                />
                <p className="text-xs text-white/40 mt-2">
                  A brief explanation of this environment's operational domain.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Adapter */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/[0.04] pb-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/60">2</span>
              <h2 className="text-xl font-semibold text-white/90">Adapter</h2>
            </div>
            
            <p className="text-sm text-white/50 mb-4">
              Select the base operational adapter for your environment. This defines the core entities, rules, and logic graph.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ADAPTERS.map((a) => {
                const isSelected = adapter === a.id;
                return (
                  <div
                    key={a.id}
                    onClick={() => setAdapter(a.id)}
                    className={`relative cursor-pointer rounded-xl border p-5 transition-all duration-200 flex flex-col group ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className={`p-2 rounded-lg ${isSelected ? "bg-primary/20 text-primary" : "bg-white/5 text-white/60 group-hover:text-white/90"} transition-colors`}>
                        {a.icon}
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? "border-primary bg-primary" : "border-white/20"} transition-colors`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                      </div>
                    </div>
                    <h3 className={`font-semibold mb-1 ${isSelected ? "text-primary" : "text-white/90"}`}>
                      {a.title}
                    </h3>
                    <p className="text-xs text-white/40 leading-relaxed font-sans">
                      {a.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 3. Runtime Configuration */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/[0.04] pb-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/60">3</span>
              <h2 className="text-xl font-semibold text-white/90">Runtime Configuration</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-white/80">Environment Status</label>
                <div className="space-y-3">
                  <RadioCard name="status" value="development" selected={status} onChange={setStatus} label="Development" description="Sandbox environment for iterative building." />
                  <RadioCard name="status" value="simulation" selected={status} onChange={setStatus} label="Simulation" description="Run full tests against simulated event streams." />
                  <RadioCard name="status" value="live" selected={status} onChange={setStatus} label="Live" description="Production environment receiving real events." />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-white/80">Runtime Visibility</label>
                <div className="space-y-3">
                  <RadioCard name="visibility" value="private" selected={visibility} onChange={setVisibility} label="Private" description="Only you can access this environment." />
                  <RadioCard name="visibility" value="organization" selected={visibility} onChange={setVisibility} label="Organization" description="Anyone in your MatrixOS organization can access." />
                  <RadioCard name="visibility" value="public" selected={visibility} onChange={setVisibility} label="Public" description="Anyone on the internet can view this environment." />
                </div>
              </div>
            </div>
          </section>

          {/* 4. Runtime Features */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/[0.04] pb-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/60">4</span>
              <h2 className="text-xl font-semibold text-white/90">Runtime Features</h2>
            </div>
            
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5 space-y-2">
              <Switch 
                checked={features.recoveryMemory} 
                onChange={(c: boolean) => setFeatures(f => ({ ...f, recoveryMemory: c }))} 
                label="Enable Recovery Memory" 
                description="Persist successful recovery strategies across sessions." 
              />
              <Switch 
                checked={features.plannerAgent} 
                onChange={(c: boolean) => setFeatures(f => ({ ...f, plannerAgent: c }))} 
                label="Enable Planner Agent" 
                description="Allow MatrixOS to autonomously generate execution plans." 
              />
              <Switch 
                checked={features.recoveryAgent} 
                onChange={(c: boolean) => setFeatures(f => ({ ...f, recoveryAgent: c }))} 
                label="Enable Recovery Agent" 
                description="Automatically detect constraints and propose repairs." 
              />
              <Switch 
                checked={features.runtimeAnalytics} 
                onChange={(c: boolean) => setFeatures(f => ({ ...f, runtimeAnalytics: c }))} 
                label="Enable Runtime Analytics" 
                description="Collect metrics on node execution, state changes, and latency." 
              />
              <Switch 
                checked={features.eventLogging} 
                onChange={(c: boolean) => setFeatures(f => ({ ...f, eventLogging: c }))} 
                label="Enable Event Logging" 
                description="Maintain an immutable log of all incoming and outgoing events." 
              />
            </div>
          </section>

          {/* 5. Advanced */}
          <section className="pt-2 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="flex items-center gap-2 text-white/60 hover:text-white/90 text-sm font-medium transition-colors"
            >
              {isAdvancedOpen ? <CaretDown weight="bold" /> : <CaretRight weight="bold" />}
              Advanced Configuration
            </button>
            
            <AnimatePresence>
              {isAdvancedOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-6 rounded-xl bg-white/[0.01] border border-white/5">
                    
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Runtime Limits</label>
                      <input type="text" placeholder="e.g. 1000 events/sec" className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-primary/50 outline-none" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Invariant Configuration</label>
                      <input type="text" placeholder="Path to .yaml rules" className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-primary/50 outline-none" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Adapter Overrides</label>
                      <input type="text" placeholder="{}" className="w-full font-mono bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-primary/50 outline-none" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Resource Quotas</label>
                      <input type="text" placeholder="Default" className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-primary/50 outline-none" />
                    </div>
                    
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Actions */}
          <div className="pt-8 border-t border-white/[0.08] flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/hub')}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(108,99,255,0.2)] disabled:shadow-none"
            >
              Create Environment
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
