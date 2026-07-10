"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Graph, Node, ShareNetwork, MagnifyingGlass, Cpu } from "@phosphor-icons/react/dist/ssr";

// Mock Data for the Knowledge Graph
const SEMANTIC_NODES = [
  { id: "concept_1", label: "Ground Operations", group: "domain", size: 40, x: 50, y: 50 },
  { id: "concept_2", label: "Fuel Logistics", group: "resource", size: 30, x: 25, y: 30 },
  { id: "concept_3", label: "Aircraft Turnaround", group: "domain", size: 35, x: 75, y: 35 },
  { id: "concept_4", label: "Fuel Shortage Protocol", group: "action", size: 25, x: 30, y: 70 },
  { id: "concept_5", label: "Weather Delay", group: "event", size: 28, x: 70, y: 75 },
  { id: "concept_6", label: "Gate Reassignment", group: "action", size: 25, x: 85, y: 55 },
  { id: "concept_7", label: "Emergency Response", group: "domain", size: 32, x: 15, y: 50 },
];

const SEMANTIC_EDGES = [
  { source: 0, target: 1, label: "depends_on" },
  { source: 0, target: 2, label: "includes" },
  { source: 1, target: 3, label: "triggers" },
  { source: 2, target: 5, label: "affected_by" },
  { source: 4, target: 2, label: "causes" },
  { source: 1, target: 6, label: "escalates_to" },
];

export function SemanticMap() {
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [isSimulating, setIsSimulating] = useState(true);

  // Simulate layout settling
  useEffect(() => {
    const timer = setTimeout(() => setIsSimulating(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full w-full flex gap-6">
      {/* Graph Visualizer Area */}
      <div className="flex-1 bg-card/20 backdrop-blur-2xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden relative flex flex-col">
        <div className="p-4 border-b border-border/50 bg-background/50 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold font-sans tracking-tight text-foreground flex items-center gap-2">
              <ShareNetwork weight="duotone" className="text-primary" />
              Vector Space Graph
            </h2>
            <p className="text-xs text-muted-foreground font-sans mt-1">Live semantic ontology network representation.</p>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 border border-border/50 shadow-neu-inset">
            <span className="relative flex h-2 w-2">
              {isSimulating && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-4 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isSimulating ? 'bg-chart-4' : 'bg-primary'}`}></span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              {isSimulating ? "Stabilizing" : "Connected"}
            </span>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
          {/* Edges */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {SEMANTIC_EDGES.map((edge, idx) => {
              const src = SEMANTIC_NODES[edge.source];
              const tgt = SEMANTIC_NODES[edge.target];
              const isHighlighted = selectedNode && (selectedNode.id === src.id || selectedNode.id === tgt.id);
              
              return (
                <g key={idx}>
                  <motion.line
                    x1={`${src.x}%`} y1={`${src.y}%`}
                    x2={`${tgt.x}%`} y2={`${tgt.y}%`}
                    stroke={isHighlighted ? "hsl(var(--primary))" : "hsl(var(--border))"}
                    strokeWidth={isHighlighted ? 2 : 1}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: isHighlighted ? 0.8 : 0.3 }}
                    transition={{ duration: 1.5, delay: idx * 0.1 }}
                  />
                  {isHighlighted && (
                    <text
                      x={`${(src.x + tgt.x) / 2}%`}
                      y={`${(src.y + tgt.y) / 2}%`}
                      fill="hsl(var(--primary))"
                      fontSize="10"
                      className="font-mono"
                      textAnchor="middle"
                      dy="-5"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {SEMANTIC_NODES.map((node, idx) => {
            const isSelected = selectedNode?.id === node.id;
            const isConnected = selectedNode && SEMANTIC_EDGES.some(e => 
              (SEMANTIC_NODES[e.source].id === selectedNode.id && SEMANTIC_NODES[e.target].id === node.id) ||
              (SEMANTIC_NODES[e.target].id === selectedNode.id && SEMANTIC_NODES[e.source].id === node.id)
            );
            const opacity = !selectedNode || isSelected || isConnected ? 1 : 0.2;

            return (
              <motion.div
                key={node.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center cursor-pointer group"
                style={{ left: `${node.x}%`, top: `${node.y}%`, opacity }}
                onClick={() => setSelectedNode(node)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity,
                  y: isSimulating ? [0, -10, 0] : 0 
                }}
                transition={{ 
                  scale: { type: "spring", delay: idx * 0.1 },
                  opacity: { duration: 0.3 },
                  y: { repeat: Infinity, duration: 2 + Math.random(), ease: "easeInOut" }
                }}
              >
                <div 
                  className={`rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)]
                    ${isSelected ? 'bg-primary border-primary shadow-[0_0_30px_rgba(108,99,255,0.6)]' : 
                    node.group === 'domain' ? 'bg-card border-chart-2' : 
                    node.group === 'resource' ? 'bg-card border-chart-4' : 
                    'bg-card border-chart-3'}
                  `}
                  style={{ width: node.size, height: node.size }}
                >
                  {isSelected && <Graph weight="fill" className="text-primary-foreground text-opacity-80" size={node.size * 0.5} />}
                </div>
                <div className="mt-2 text-center">
                  <span className={`text-xs font-bold font-sans px-2 py-0.5 rounded-full bg-background/80 border backdrop-blur-sm
                    ${isSelected ? 'border-primary text-primary' : 'border-border/50 text-foreground'}
                  `}>
                    {node.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Details Panel */}
      <div className="w-80 flex flex-col gap-4">
        {selectedNode ? (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card/20 backdrop-blur-2xl rounded-2xl border border-border/50 shadow-2xl p-6 h-full flex flex-col"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground bg-background/50 px-2 py-1 rounded border border-border/50">
                  Concept Node
                </span>
                <h3 className="text-xl font-bold font-sans text-foreground mt-3">{selectedNode.label}</h3>
              </div>
              <Cpu size={24} className="text-primary opacity-50" />
            </div>

            <div className="space-y-4 flex-1">
              <div>
                <label className="text-[10px] uppercase font-mono text-muted-foreground block mb-1">Entity Group</label>
                <div className="text-sm font-mono text-foreground capitalize">{selectedNode.group}</div>
              </div>
              
              <div>
                <label className="text-[10px] uppercase font-mono text-muted-foreground block mb-1">Embedding Vector (Preview)</label>
                <div className="font-mono text-xs text-muted-foreground bg-background/50 p-2 rounded border border-border/30 break-all leading-relaxed">
                  [0.824, -0.193, 0.441, ... 0.992]
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-muted-foreground block mb-2">Connected Relations</label>
                <div className="space-y-2">
                  {SEMANTIC_EDGES.filter(e => SEMANTIC_NODES[e.source].id === selectedNode.id || SEMANTIC_NODES[e.target].id === selectedNode.id).map((edge, i) => {
                    const isSrc = SEMANTIC_NODES[edge.source].id === selectedNode.id;
                    const relatedNode = isSrc ? SEMANTIC_NODES[edge.target] : SEMANTIC_NODES[edge.source];
                    return (
                      <div key={i} className="flex items-center gap-2 text-xs font-mono p-2 rounded bg-background/30 border border-border/50">
                        <span className="text-primary">{isSrc ? "OUT" : "IN"}</span>
                        <span className="text-muted-foreground truncate">{edge.label}</span>
                        <span className="text-foreground ml-auto">{relatedNode.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <button 
              className="mt-6 w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm font-bold transition-colors font-sans"
              onClick={() => setSelectedNode(null)}
            >
              Clear Selection
            </button>
          </motion.div>
        ) : (
          <div className="bg-card/10 border border-dashed border-border/50 rounded-2xl h-full flex flex-col items-center justify-center p-6 text-center">
            <MagnifyingGlass size={32} className="text-muted-foreground/30 mb-3" />
            <h3 className="text-sm font-bold font-sans text-muted-foreground">No Node Selected</h3>
            <p className="text-xs text-muted-foreground/50 mt-1">Select a concept from the knowledge graph to view its properties and vector embeddings.</p>
          </div>
        )}
      </div>
    </div>
  );
}
