"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowsOut, SidebarSimple } from "@phosphor-icons/react/dist/ssr";

interface PanelLayoutProps {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
}

export function PanelLayout({ left, center, right }: PanelLayoutProps) {
  // Panel Widths (percentages)
  const [leftWidth, setLeftWidth] = useState(25);
  const [rightWidth, setRightWidth] = useState(25);
  
  // Collapse States
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  
  // Maximize State (null, "left", "center", "right")
  const [maximized, setMaximized] = useState<string | null>(null);

  // Dragging State
  const isDragging = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("matrixos-layout-panels");
    if (saved) {
      const state = JSON.parse(saved);
      if (state.leftWidth) setLeftWidth(state.leftWidth);
      if (state.rightWidth) setRightWidth(state.rightWidth);
      if (state.leftCollapsed !== undefined) setLeftCollapsed(state.leftCollapsed);
      if (state.rightCollapsed !== undefined) setRightCollapsed(state.rightCollapsed);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("matrixos-layout-panels", JSON.stringify({
      leftWidth,
      rightWidth,
      leftCollapsed,
      rightCollapsed
    }));
  }, [leftWidth, rightWidth, leftCollapsed, rightCollapsed]);

  // Handle Dragging
  const handlePointerDown = (e: React.PointerEvent, handleId: string) => {
    isDragging.current = handleId;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      
      const container = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - container.left;
      const percentage = (relativeX / container.width) * 100;

      if (isDragging.current === "left") {
        if (percentage > 15 && percentage < 80 - rightWidth) {
          setLeftWidth(percentage);
          setLeftCollapsed(false);
        }
      } else if (isDragging.current === "right") {
        const newRightWidth = 100 - percentage;
        if (newRightWidth > 15 && newRightWidth < 80 - leftWidth) {
          setRightWidth(newRightWidth);
          setRightCollapsed(false);
        }
      }
    };

    const handlePointerUp = () => {
      isDragging.current = null;
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [rightWidth, leftWidth]);

  // Compute final display widths based on states
  let finalLeft = leftCollapsed ? 4 : leftWidth;
  let finalRight = rightCollapsed ? 4 : rightWidth;
  let finalCenter = 100 - finalLeft - finalRight;

  if (maximized) {
    if (maximized === "left") {
      finalLeft = 100; finalCenter = 0; finalRight = 0;
    } else if (maximized === "center") {
      finalLeft = 0; finalCenter = 100; finalRight = 0;
    } else if (maximized === "right") {
      finalLeft = 0; finalCenter = 0; finalRight = 100;
    }
  }

  const toggleMaximize = (id: string) => {
    setMaximized(maximized === id ? null : id);
  };

  return (
    <div ref={containerRef} className="flex-1 flex p-4 overflow-hidden h-full w-full">
      
      {/* Left Panel */}
      {finalLeft > 0 && (
        <div 
          style={{ width: `${finalLeft}%` }}
          className="flex flex-col rounded-xl border border-border/50 bg-card/40 backdrop-blur-md shadow-sm overflow-hidden relative group/panel transition-all duration-200 ease-out shrink-0"
        >
          {left}
          <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover/panel:opacity-100 transition-opacity duration-200 z-50 bg-background/50 backdrop-blur-md rounded px-1 py-0.5">
            <button onClick={() => setLeftCollapsed(!leftCollapsed)} className="text-muted-foreground hover:text-white p-1">
              <SidebarSimple size={14} />
            </button>
            <button onClick={() => toggleMaximize("left")} className="text-muted-foreground hover:text-white p-1">
              <ArrowsOut size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Left Resize Handle */}
      {!maximized && !leftCollapsed && (
        <div 
          onPointerDown={(e) => handlePointerDown(e, "left")}
          className="relative flex items-center justify-center w-4 -mx-2 z-50 cursor-col-resize group outline-none shrink-0"
        >
          <div className="w-[1px] h-full bg-transparent group-hover:bg-purple-500/80 group-data-[dragging=true]:bg-purple-500 transition-colors duration-200" />
        </div>
      )}

      {/* Center Panel */}
      {finalCenter > 0 && (
        <div 
          style={{ width: `${finalCenter}%` }}
          className="flex flex-col rounded-xl border border-border/50 bg-background/50 backdrop-blur-md shadow-inner overflow-hidden relative group/panel transition-all duration-200 ease-out shrink-0"
        >
          {center}
          <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover/panel:opacity-100 transition-opacity duration-200 z-50 bg-background/50 backdrop-blur-md rounded px-1 py-0.5">
            <button onClick={() => toggleMaximize("center")} className="text-muted-foreground hover:text-white p-1">
              <ArrowsOut size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Right Resize Handle */}
      {!maximized && !rightCollapsed && (
        <div 
          onPointerDown={(e) => handlePointerDown(e, "right")}
          className="relative flex items-center justify-center w-4 -mx-2 z-50 cursor-col-resize group outline-none shrink-0"
        >
          <div className="w-[1px] h-full bg-transparent group-hover:bg-purple-500/80 group-data-[dragging=true]:bg-purple-500 transition-colors duration-200" />
        </div>
      )}

      {/* Right Panel */}
      {finalRight > 0 && (
        <div 
          style={{ width: `${finalRight}%` }}
          className="flex flex-col rounded-xl border border-border/50 bg-card/40 backdrop-blur-md shadow-sm overflow-hidden relative group/panel transition-all duration-200 ease-out shrink-0"
        >
          {right}
          <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover/panel:opacity-100 transition-opacity duration-200 z-50 bg-background/50 backdrop-blur-md rounded px-1 py-0.5">
            <button onClick={() => setRightCollapsed(!rightCollapsed)} className="text-muted-foreground hover:text-white p-1">
              <SidebarSimple size={14} />
            </button>
            <button onClick={() => toggleMaximize("right")} className="text-muted-foreground hover:text-white p-1">
              <ArrowsOut size={14} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
