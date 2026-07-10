import React from "react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LinearHero } from "@/components/landing/LinearHero";
import { BentoGrid } from "@/components/landing/BentoGrid";
import { LogoStrip } from "@/components/landing/LogoStrip";
import { CtaSection } from "@/components/landing/CtaSection";
import DotGrid from "@/components/landing/DotGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#000000] text-foreground font-sans selection:bg-primary/30 relative z-0">

      {/* Global Interactive Dot Grid Background */}
      <div className="fixed inset-0 z-[-1] pointer-events-auto">
        <DotGrid
          dotSize={5}
          gap={15}
          baseColor="#2F293A"
          activeColor="#5227FF"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      {/* 1. Transparent Nav */}
      <LandingHeader />

      <main className="flex flex-col items-center">

        {/* 2. Hero Section */}
        <LinearHero />

        {/* 3. Stats Strip */}
        <LogoStrip />

        {/* 4. Feature Showcase */}
        <div className="mt-24 mb-0 w-full border-t border-white/[0.02] bg-gradient-to-b from-[#0A0A0C] to-[#000000]">
          <BentoGrid />
        </div>

        {/* 5. Bottom CTA */}
        <CtaSection />

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center">
        <div className="flex items-center justify-center space-x-2 opacity-50 mb-4">
          <div className="w-4 h-4 rounded bg-foreground flex items-center justify-center">
            <div className="w-2 h-2 rounded-sm bg-background" />
          </div>
          <span className="font-bold tracking-tight">MatrixOS</span>
        </div>
        <p className="text-sm text-muted-foreground font-mono uppercase tracking-widest">
          SYSTEM ONLINE • v1.0.0
        </p>
      </footer>
    </div>
  );
}
