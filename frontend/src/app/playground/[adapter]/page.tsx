import React from "react";
import { PanelLayout } from "@/components/layout/PanelLayout";
import { WorldStatePanel } from "@/components/runtime/WorldStatePanel";
import { OperationalGraph } from "@/components/runtime/OperationalGraph";
import { ReasoningPanel } from "@/components/runtime/ReasoningPanel";
import { MetricsBar } from "@/components/runtime/MetricsBar";

export default function DashboardPage() {
  return (
    <div className="h-full flex flex-col">
      {/* Top 3-Panel Layout */}
      <PanelLayout 
        left={<WorldStatePanel />}
        center={<OperationalGraph />}
        right={<ReasoningPanel />}
      />
      
      {/* Brick 25: Bottom Metrics Bar */}
      <MetricsBar />
    </div>
  );
}
