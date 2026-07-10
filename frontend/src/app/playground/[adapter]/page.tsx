"use client";

import React, { useState, useRef, useEffect } from "react";
import { PanelLayout } from "@/components/layout/PanelLayout";
import { WorldStatePanel } from "@/components/runtime/WorldStatePanel";
import { OperationalGraph } from "@/components/runtime/OperationalGraph";
import { ReasoningPanel } from "@/components/runtime/ReasoningPanel";
import { MetricsBar } from "@/components/runtime/MetricsBar";
import { CaretUp, CaretDown } from "@phosphor-icons/react/dist/ssr";

export default function DashboardPage() {
  const [metricsHeight, setMetricsHeight] = useState(15); // Percentage
  const [isMetricsCollapsed, setIsMetricsCollapsed] = useState(false);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("matrixos-metrics-height");
    if (saved) {
      const { height, collapsed } = JSON.parse(saved);
      if (height) setMetricsHeight(height);
      if (collapsed !== undefined) setIsMetricsCollapsed(collapsed);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("matrixos-metrics-height", JSON.stringify({
      height: metricsHeight,
      collapsed: isMetricsCollapsed
    }));
  }, [metricsHeight, isMetricsCollapsed]);

  const toggleMetrics = () => {
    setIsMetricsCollapsed(!isMetricsCollapsed);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const container = containerRef.current.getBoundingClientRect();
      const relativeY = e.clientY - container.top;
      const newMetricsHeight = 100 - ((relativeY / container.height) * 100);
      
      if (newMetricsHeight > 5 && newMetricsHeight < 60) {
        setMetricsHeight(newMetricsHeight);
        setIsMetricsCollapsed(false);
      }
    };

    const handlePointerUp = () => {
      isDragging.current = false;
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  const actualMetricsHeight = isMetricsCollapsed ? 0 : metricsHeight;
  const mainHeight = 100 - actualMetricsHeight;

  return (
    <div ref={containerRef} className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Main 3-Panel Workspace */}
      <div style={{ height: `${mainHeight}%` }} className="relative transition-all duration-200 ease-out">
        <PanelLayout 
          left={<WorldStatePanel />}
          center={<OperationalGraph />}
          right={<ReasoningPanel />}
        />
      </div>

      {/* Custom Vertical Resize Handle */}
      <div 
        onPointerDown={handlePointerDown}
        className="relative flex items-center justify-center h-2 -my-1 z-50 cursor-row-resize group outline-none shrink-0"
      >
        <div className="w-full h-[1px] bg-transparent group-hover:bg-purple-500/80 group-data-[dragging=true]:bg-purple-500 transition-colors duration-200" />
        
        {/* Tiny Collapse/Expand Button */}
        <button 
          onClick={toggleMetrics}
          className="absolute bg-card/80 backdrop-blur-md border border-border/50 text-muted-foreground hover:text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 cursor-pointer"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {isMetricsCollapsed ? <CaretUp size={12} /> : <CaretDown size={12} />}
        </button>
      </div>

      {/* Bottom Metrics Bar */}
      <div 
        style={{ height: `${actualMetricsHeight}%` }} 
        className="relative transition-all duration-200 ease-out overflow-hidden"
      >
        <div className="absolute inset-0">
          <MetricsBar />
        </div>
      </div>
    </div>
  );
}
