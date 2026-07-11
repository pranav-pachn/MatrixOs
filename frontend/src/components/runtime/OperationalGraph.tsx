"use client";

import React, { useMemo, useEffect, useState } from "react";
import { ReactFlow, ReactFlowProvider, useReactFlow, Background, BackgroundVariant, Controls, MiniMap, Node, Edge, useNodesState, useEdgesState } from "@xyflow/react";
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

// Normalize status to lowercase for consistent display
const normalizeStatus = (status: string): string => {
  const s = (status || "").toLowerCase();
  if (s === "completed") return "complete";
  if (s === "running") return "active";
  if (s === "in-progress" || s === "in_progress") return "active";
  if (s === "diverged") return "diverged";
  if (s === "failed") return "failed";
  return s;
};

function OperationalGraphInner() {
  const missions = useRuntimeStore((state) => state.missions);
  const resources = useRuntimeStore((state) => state.resources);
  const { fitView } = useReactFlow();

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
    const dynamicNodes: Node[] = [];
    const dynamicEdges: Edge[] = [];

    // Build a set of all assigned resource IDs (case-insensitive check)
    const assignedResourceIds = new Set(
      missions.flatMap(m => m.tasks.map(t => t.assignedResourceId)).filter(Boolean)
    );

    // Add Resources — always show if assigned to a task OR if they are in a failed state
    resources.forEach((res) => {
      const statusNorm = normalizeStatus(res.status);
      if (assignedResourceIds.has(res.id) || statusNorm === "failed") {
        dynamicNodes.push({
          id: res.id,
          type: "resourceNode",
          position: { x: 0, y: 0 },
          data: { label: res.name, status: statusNorm },
        });
      }
    });

    // Add Mission nodes, Task nodes, and edges
    missions.forEach((mission) => {
      const missionStatus = normalizeStatus(mission.status);
      dynamicNodes.push({
        id: mission.id,
        type: "missionNode",
        position: { x: 0, y: 0 },
        data: { label: mission.name, status: missionStatus },
      });

      // Build a local task id map for dependency resolution within this mission
      const taskNodeIds: Record<string, string> = {};
      mission.tasks.forEach((task) => {
        taskNodeIds[task.id] = `${mission.id}-${task.id}`;
      });

      mission.tasks.forEach((task) => {
        const taskNodeId = `${mission.id}-${task.id}`;
        const taskStatus = normalizeStatus(task.status);

        dynamicNodes.push({
          id: taskNodeId,
          type: "taskNode",
          position: { x: 0, y: 0 },
          data: { label: task.name, status: taskStatus },
        });

        // Determine source: if task has dependencies, connect from last dep; else from mission
        const deps: string[] = (task.dependencies || []) as string[];
        if (deps.length > 0) {
          deps.forEach((depId) => {
            const depNodeId = taskNodeIds[depId];
            if (depNodeId) {
              dynamicEdges.push({
                id: `e-dep-${depNodeId}-${taskNodeId}`,
                source: depNodeId,
                target: taskNodeId,
                type: "smoothstep",
                animated: taskStatus !== "complete",
                style: { stroke: "#6C63FF", strokeWidth: 2 },
              });
            }
          });
        } else {
          // No dependencies → connect directly from mission
          dynamicEdges.push({
            id: `e-${mission.id}-${taskNodeId}`,
            source: mission.id,
            target: taskNodeId,
            type: "smoothstep",
            animated: taskStatus !== "complete",
            style: { stroke: "#6C63FF", strokeWidth: 2 },
          });
        }

        // Edge: Task -> Resource (dashed red)
        if (task.assignedResourceId && assignedResourceIds.has(task.assignedResourceId)) {
          const isActive = taskStatus === "active" || taskStatus === "running";
          dynamicEdges.push({
            id: `e-res-${taskNodeId}-${task.assignedResourceId}`,
            source: taskNodeId,
            target: task.assignedResourceId,
            type: "smoothstep",
            animated: isActive,
            style: { stroke: "#FF4D4D", strokeWidth: 2, strokeDasharray: "5,5" },
          });
        }
      });
    });

    if (dynamicNodes.length > 0) {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(dynamicNodes, dynamicEdges, "LR");
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [missions, resources, setNodes, setEdges]);

  // Fit view automatically when nodes change
  useEffect(() => {
    if (nodes.length > 0) {
      const timeoutId = setTimeout(() => {
        fitView({ padding: 0.2, duration: 800 });
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [nodes, fitView]);

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
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#434343" variant={BackgroundVariant.Dots} gap={24} size={2} />

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

export function OperationalGraph() {
  return (
    <ReactFlowProvider>
      <OperationalGraphInner />
    </ReactFlowProvider>
  );
}
