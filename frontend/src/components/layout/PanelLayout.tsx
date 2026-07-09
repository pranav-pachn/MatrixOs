import React from "react";

interface PanelLayoutProps {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
}

export function PanelLayout({ left, center, right }: PanelLayoutProps) {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 overflow-hidden h-full">
      {/* Left Panel - World State */}
      <div className="lg:col-span-3 flex flex-col rounded-xl border border-border/50 bg-card/40 backdrop-blur-md shadow-sm overflow-hidden">
        {left}
      </div>

      {/* Center Panel - Operational Graph */}
      <div className="lg:col-span-6 flex flex-col rounded-xl border border-border/50 bg-background/50 backdrop-blur-md shadow-inner overflow-hidden relative">
        {center}
      </div>

      {/* Right Panel - Runtime Reasoning */}
      <div className="lg:col-span-3 flex flex-col rounded-xl border border-border/50 bg-card/40 backdrop-blur-md shadow-sm overflow-hidden">
        {right}
      </div>
    </div>
  );
}
