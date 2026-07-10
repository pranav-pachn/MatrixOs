"use client";

import React, { useState } from "react";
import { Lightning, CloudRain, WarningCircle, Users, Ambulance, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { useRuntimeStore } from "@/lib/store/runtime";

export function TriggerEventPanel() {
  const activeScenarioId = useRuntimeStore((state) => state.activeScenarioId);
  const [injectingId, setInjectingId] = useState<string | null>(null);

  const airportTriggers = [
    { id: "fuel", label: "Fuel Truck Failure", icon: Lightning, glow: "group-hover:shadow-[0_0_20px_rgba(255,77,77,0.4)] group-hover:border-destructive/60", iconColor: "text-destructive group-hover:text-destructive" },
    { id: "weather", label: "Heavy Rain (Cat 2)", icon: CloudRain, glow: "group-hover:shadow-[0_0_20px_rgba(41,182,246,0.4)] group-hover:border-chart-3/60", iconColor: "text-chart-3 group-hover:text-chart-3" },
    { id: "gate", label: "Gate B12 Blocked", icon: WarningCircle, glow: "group-hover:shadow-[0_0_20px_rgba(245,166,35,0.4)] group-hover:border-chart-2/60", iconColor: "text-chart-2 group-hover:text-chart-2" },
    { id: "crew", label: "Crew Unavailable", icon: Users, glow: "group-hover:shadow-[0_0_20px_rgba(0,208,132,0.4)] group-hover:border-chart-4/60", iconColor: "text-chart-4 group-hover:text-chart-4" },
    { id: "emergency", label: "Emergency Arrival", icon: Ambulance, glow: "group-hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] group-hover:border-primary/60", iconColor: "text-primary group-hover:text-primary" },
  ];

  const hospitalTriggers = [
    { id: "EmergencyPatient", label: "Emergency Patient Arrival", icon: Ambulance, glow: "group-hover:shadow-[0_0_20px_rgba(255,77,77,0.4)] group-hover:border-destructive/60", iconColor: "text-destructive group-hover:text-destructive" },
    { id: "DoctorUnavailable", label: "Doctor Unavailable", icon: Users, glow: "group-hover:shadow-[0_0_20px_rgba(245,166,35,0.4)] group-hover:border-chart-2/60", iconColor: "text-chart-2 group-hover:text-chart-2" },
    { id: "MRIFailure", label: "MRI Failure", icon: Lightning, glow: "group-hover:shadow-[0_0_20px_rgba(41,182,246,0.4)] group-hover:border-chart-3/60", iconColor: "text-chart-3 group-hover:text-chart-3" },
  ];

  const warehouseTriggers = [
    { id: "ForkliftFailure", label: "Forklift Breakdown", icon: Lightning, glow: "group-hover:shadow-[0_0_20px_rgba(255,77,77,0.4)] group-hover:border-destructive/60", iconColor: "text-destructive group-hover:text-destructive" },
    { id: "DockBlocked", label: "Dock Blocked", icon: WarningCircle, glow: "group-hover:shadow-[0_0_20px_rgba(245,166,35,0.4)] group-hover:border-chart-2/60", iconColor: "text-chart-2 group-hover:text-chart-2" },
    { id: "InventoryShortage", label: "Inventory Shortage", icon: Users, glow: "group-hover:shadow-[0_0_20px_rgba(41,182,246,0.4)] group-hover:border-chart-3/60", iconColor: "text-chart-3 group-hover:text-chart-3" },
  ];

  const triggers = activeScenarioId === "hospital-er" ? hospitalTriggers : activeScenarioId === "warehouse-hub" ? warehouseTriggers : airportTriggers;
  return (
    <div className="flex flex-col h-full bg-card/20 backdrop-blur-2xl rounded-2xl border border-border/50 shadow-2xl p-6 relative overflow-hidden">
      
      {/* Decorative gradient blob */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mb-8 relative z-10">
        <h2 className="text-xl font-bold font-sans tracking-tight text-foreground">Disruption Controls</h2>
        <p className="text-xs text-muted-foreground font-sans mt-1">Inject simulated chaos scenarios to trigger AI recovery routines.</p>
      </div>

      <div className="flex-1 space-y-4 relative z-10 overflow-y-auto custom-scrollbar pr-2 min-h-0">
        {triggers.map((trigger) => {
          const Icon = trigger.icon;
          const isInjecting = injectingId === trigger.id;
          
          return (
            <button
              key={trigger.id}
              disabled={!!injectingId}
              onClick={async () => {
                try {
                  setInjectingId(trigger.id);
                  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000'}/api/v1/runtime/${activeScenarioId}/events`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ event: trigger.id })
                  });
                  if (!res.ok) throw new Error("Failed to inject event");
                } catch (e) {
                  console.warn("Backend unavailable, simulated event injection.");
                  // Fallback for prototype: Wait a bit to simulate network
                  await new Promise(r => setTimeout(r, 600));
                } finally {
                  setInjectingId(null);
                }
              }}
              className={`w-full group relative overflow-hidden px-5 py-4 rounded-xl border border-border/30 bg-background/40 backdrop-blur-sm flex items-center justify-between transition-all duration-300 ${!injectingId ? trigger.glow : ''} ${!injectingId ? 'active:scale-[0.98] cursor-pointer' : 'opacity-70 cursor-not-allowed'}`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2.5 rounded-lg bg-card/50 shadow-neu-inset border border-border/50 transition-colors ${trigger.iconColor}`}>
                  {isInjecting ? (
                    <CircleNotch size={20} className="animate-spin text-muted-foreground" />
                  ) : (
                    <Icon size={20} weight="duotone" />
                  )}
                </div>
                <span className="text-sm font-sans font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                  {trigger.label}
                </span>
              </div>
              
              <div className="flex items-center">
                <span className="text-[10px] font-mono text-muted-foreground/0 group-hover:text-muted-foreground/60 transition-colors tracking-widest mr-2">
                  INJECT
                </span>
                <div className="w-6 h-6 rounded-full border border-border/50 flex items-center justify-center bg-card/50 group-hover:bg-background transition-colors">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/30 group-hover:bg-foreground/50 transition-colors" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
