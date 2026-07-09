"use client";

import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";

import { useRuntimeStore } from "@/lib/store/runtime";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border/50 shadow-neu-raised p-3 rounded-lg backdrop-blur-md">
        <p className="text-sm font-sans font-bold text-foreground mb-1">{data.strategy}</p>
        <p className="text-xs font-mono text-muted-foreground">
          Neural Confidence: <span className="text-primary font-bold">{data.confidence}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export function ConfidenceChart() {
  const data = useRuntimeStore((state) => state.confidenceData);
  return (
    <div className="bg-card/20 backdrop-blur-2xl rounded-2xl border border-border/50 shadow-2xl p-6 h-full flex flex-col relative overflow-hidden">
      
      {/* Decorative ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none z-0" />

      <div className="mb-2 relative z-10">
        <h2 className="text-lg font-bold font-sans tracking-tight text-foreground">Strategy Efficacy Analysis</h2>
        <p className="text-[10px] uppercase tracking-widest text-primary/80 font-mono mt-1">Historical success rate of deployed automated strategies</p>
      </div>
      
      <div className="flex-1 w-full min-h-[300px] relative z-10 -ml-4 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
            <PolarGrid stroke="var(--border)" strokeDasharray="3 3" />
            <PolarAngleAxis 
              dataKey="strategy" 
              tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'var(--font-mono)' }} 
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              tick={{ fill: 'var(--muted)', fontSize: 10 }}
              axisLine={false}
              tickCount={6}
            />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name="Confidence"
              dataKey="confidence"
              stroke="var(--primary)"
              strokeWidth={2}
              fill="var(--primary)"
              fillOpacity={0.2}
              isAnimationActive={true}
              animationDuration={2000}
            />
            {/* Overlay a secondary radar line to create a complex double-web effect */}
            <Radar
              name="Baseline"
              dataKey={() => 80} // The 80% acceptable threshold
              stroke="var(--chart-4)"
              strokeDasharray="4 4"
              strokeWidth={1}
              fill="transparent"
              isAnimationActive={false}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="absolute bottom-6 right-6 flex items-center gap-2 text-[10px] font-mono text-muted-foreground z-10 bg-background/50 px-2 py-1 rounded border border-border/50">
        <span className="w-2 h-2 rounded-full bg-chart-4 shadow-[0_0_8px_rgba(0,208,132,0.6)]"></span>
        80% Threshold
      </div>
    </div>
  );
}
