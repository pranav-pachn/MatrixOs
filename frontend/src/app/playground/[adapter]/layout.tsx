import React from "react";
import { Header } from "@/components/layout/Header";
import { TabBar } from "@/components/layout/TabBar";
import { ScenarioInitializer } from "@/components/runtime/ScenarioInitializer";

// This layout wraps all pages under /playground/[adapter]
export default async function AdapterLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ adapter: string }>;
}) {
  const resolvedParams = await params;
  
  // Format the adapter name (e.g. "airport" -> "Airport")
  const adapterName = resolvedParams.adapter
    ? resolvedParams.adapter.charAt(0).toUpperCase() + resolvedParams.adapter.slice(1)
    : "Unknown";

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <ScenarioInitializer adapter={resolvedParams.adapter} />
      
      {/* Brick 12: Header */}
      <Header adapterName={adapterName} status="LIVE" />
      
      {/* Navigation Tabs */}
      <TabBar adapter={resolvedParams.adapter} />
      
      {/* Dashboard Content Area */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
