import React from "react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LinearHero } from "@/components/landing/LinearHero";
import { BentoGrid } from "@/components/landing/BentoGrid";
import { LogoStrip } from "@/components/landing/LogoStrip";
import { LandingFooter } from "@/components/landing/LandingFooter";
import DotGrid from "@/components/landing/DotGrid";
import { ArchitectureTrust } from "@/components/landing/ArchitectureTrust";
import { MatrixLogo } from "@/components/ui/MatrixLogo";

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

        {/* 5. Trust Architecture (Documentation Style) */}
        <div className="w-full relative z-10 bg-black">
          <ArchitectureTrust />
        </div>

      </main>

      {/* Unified Footer & CTA */}
      <LandingFooter />
    </div>
  );
}
