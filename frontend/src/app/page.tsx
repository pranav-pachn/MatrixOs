import React from "react";
import { AdapterCard } from "@/components/runtime/AdapterCard";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LinearHero } from "@/components/landing/LinearHero";
import { AppMockup } from "@/components/landing/AppMockup";
import { BentoGrid } from "@/components/landing/BentoGrid";
import { AirplaneTilt, FirstAid, Package } from "@phosphor-icons/react/dist/ssr";
import { Adapter } from "@/types/runtime";

async function getAdapters(): Promise<Adapter[]> {
  try {
    const res = await fetch("http://127.0.0.1:8001/api/scenarios", { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    console.error("Failed to fetch adapters", e);
    return [];
  }
}

export default async function Home() {
  const adapters = await getAdapters();

  return (
    <div className="min-h-screen bg-[#000000] text-foreground font-sans selection:bg-primary/30">
      
      {/* 1. Transparent Nav */}
      <LandingHeader />

      <main className="flex flex-col items-center">
        
        {/* 2. Linear-style Hero Section */}
        <LinearHero />

        {/* 3. The Dashboard Mockup (Holding the Adapters) */}
        <AppMockup>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adapters.length > 0 ? (
              adapters.map((adapter: Adapter) => {
                let icon;
                if (adapter.id === "airport") icon = <AirplaneTilt size={32} weight="duotone" />;
                else if (adapter.id.includes("hospital")) icon = <FirstAid size={32} weight="duotone" />;
                else icon = <Package size={32} weight="duotone" />;
                
                return (
                  <AdapterCard 
                    key={adapter.id}
                    name={adapter.name} 
                    description={adapter.description} 
                    status={adapter.status} 
                    href={adapter.href}
                    icon={icon}
                  />
                );
              })
            ) : (
              // Fallback
              <>
                <AdapterCard 
                  name="Airport Hub" 
                  description="Aviation turnaround constraint validation." 
                  status="live" 
                  href="/playground/airport"
                  icon={<AirplaneTilt size={32} weight="duotone" />}
                />
                <AdapterCard 
                  name="Hospital ER" 
                  description="Patient triage and resource routing." 
                  status="coming-soon" 
                  href="/playground/hospital-er"
                  icon={<FirstAid size={32} weight="duotone" />}
                />
                <AdapterCard 
                  name="Warehouse Hub" 
                  description="Autonomous bot swarm pathfinding." 
                  status="coming-soon" 
                  href="/playground/warehouse-hub"
                  icon={<Package size={32} weight="duotone" />}
                />
              </>
            )}
          </div>
        </AppMockup>

        {/* 4. The Feature Grid */}
        <div className="mt-24 mb-32 w-full border-t border-white/[0.02] bg-gradient-to-b from-[#0A0A0C] to-[#000000]">
          <BentoGrid />
        </div>

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
