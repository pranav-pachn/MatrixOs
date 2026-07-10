"use client";

import React, { useState } from "react";
import { MemoryTable } from "@/components/runtime/MemoryTable";
import { ConfidenceChart } from "@/components/runtime/ConfidenceChart";
import { SemanticMap } from "@/components/runtime/SemanticMap";
import { ProceduralPlaybooks } from "@/components/runtime/ProceduralPlaybooks";
import { Brain, Graph, BracketsCurly } from "@phosphor-icons/react/dist/ssr";
import { motion } from "framer-motion";

const tabs = [
  { id: "episodic", label: "Episodic", icon: Brain },
  { id: "semantic", label: "Semantic", icon: Graph },
  { id: "procedural", label: "Procedural", icon: BracketsCurly },
] as const;

export default function MemoryPage() {
  const [activeTab, setActiveTab] = useState<"episodic" | "semantic" | "procedural">("episodic");

  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-sans tracking-tight text-foreground">Historical Telemetry Archive</h1>
        <p className="text-sm text-muted-foreground font-sans">
          Review past system resolutions, strategy deployment metrics, and success confidence rates.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 mb-6 bg-card/40 p-1.5 rounded-lg border border-border/50 self-start relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-md text-sm font-sans font-bold transition-colors ${
                isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {/* Animated Sliding Pill */}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-primary rounded-md shadow-neu-raised"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* Content (Z-10 to stay above pill) */}
              <span className="relative z-10 flex items-center gap-2">
                <Icon size={18} weight={isActive ? "fill" : "regular"} />
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0">
        {activeTab === "episodic" && (
          <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-full min-h-0">
              <MemoryTable />
            </div>
            <div className="lg:col-span-1 h-full min-h-0">
              <ConfidenceChart />
            </div>
          </div>
        )}

        {activeTab === "semantic" && (
          <div className="h-full min-h-0">
            <SemanticMap />
          </div>
        )}

        {activeTab === "procedural" && (
          <div className="h-full min-h-0">
            <ProceduralPlaybooks />
          </div>
        )}
      </div>

    </div>
  );
}
