"use client";

import React from "react";
import Link from "next/link";
import { FirstAid, ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export default function HospitalStubPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background relative overflow-hidden">
      {/* Decorative scanline background */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(transparent_50%,rgba(255,255,255,1)_50%)] bg-[length:100%_4px] pointer-events-none" />
      
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 text-center shadow-2xl relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 text-primary mb-6 shadow-[0_0_30px_rgba(108,99,255,0.3)]">
          <FirstAid size={40} weight="duotone" />
        </div>
        
        <h1 className="text-3xl font-bold font-sans tracking-tight text-foreground mb-3">Hospital ER <br/><span className="text-primary text-xl">Adapter Offline</span></h1>
        
        <p className="text-sm font-sans text-muted-foreground mb-8">
          The Triage prioritization and dynamic bed allocation neural nets are currently offline. We are securing the API endpoints for HIPAA compliance before activating the live data feed.
        </p>
        
        <div className="inline-block border border-border/50 bg-background/50 rounded-lg px-4 py-2 mb-8 font-mono text-xs text-muted-foreground uppercase tracking-widest shadow-neu-inset">
          Status: <span className="text-chart-2 ml-2">Training Models...</span>
        </div>

        <Link 
          href="/" 
          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-bold font-sans hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(108,99,255,0.4)]"
        >
          <ArrowLeft weight="bold" />
          Return to MatrixOS Hub
        </Link>
      </div>
    </div>
  );
}
