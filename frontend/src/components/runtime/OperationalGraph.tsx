"use client";

import React, { useMemo, useEffect, useState } from "react";
import { ReactFlow, Background, BackgroundVariant, Controls, MiniMap, Node, Edge, useNodesState, useEdgesState } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";

import { TaskNode } from "./graph/TaskNode";
import { ResourceNode } from "./graph/ResourceNode";
import { MissionNode } from "./graph/MissionNode";
import { useRuntimeStore } from "@/lib/store/runtime";

// Initialize dagre graph for automatic layouting
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// Function to calculate layout automatically
const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = "TB") => {
  const nodeWidth = 172;
  const nodeHeight = 72;

  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export function OperationalGraph() {
  const storeNodes = useRuntimeStore((state) => state.nodes);
  const storeEdges = useRuntimeStore((state) => state.edges);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Node types registry
  const nodeTypes = useMemo(() => ({
    taskNode: TaskNode,
    resourceNode: ResourceNode,
    missionNode: MissionNode,
  }), []);

  // When store data changes, recalculate the dagre layout
  useEffect(() => {
    if (storeNodes.length > 0) {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(storeNodes, storeEdges, "TB");
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [storeNodes, storeEdges, setNodes, setEdges]);

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 z-10 bg-background/50 backdrop-blur-md p-3 rounded-lg border border-border/50 shadow-neu-raised">
        <h2 className="text-lg font-bold font-sans tracking-tight text-foreground">Operational Graph</h2>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mt-1">Auto-Layout Engine Active</p>
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        className="bg-card/10"
        proOptions={{ hideAttribution: true }} // Hides the default attribution for a cleaner OS look
      >
        <Background color="#434343" variant={BackgroundVariant.Dots} gap={24} size={2} />
        
        {/* Sleek MiniMap for navigation */}
        <MiniMap 
          nodeColor={(node) => {
            if (node.type === "missionNode") return "#6C63FF";
            if (node.type === "resourceNode") return "#FF4D4D";
            return "#434343";
          }}
          maskColor="rgba(26, 26, 26, 0.7)"
          style={{ backgroundColor: "#292929", border: "1px solid #434343", borderRadius: "8px" }}
        />
        
        <Controls className="fill-foreground bg-card border-border shadow-neu-raised rounded-md overflow-hidden" />
      </ReactFlow>
    </div>
  );
}
