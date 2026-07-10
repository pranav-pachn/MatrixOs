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
  const missions = useRuntimeStore((state) => state.missions);
  const resources = useRuntimeStore((state) => state.resources);

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
    // Generate dynamic nodes and edges from missions and resources
    const dynamicNodes: Node[] = [];
    const dynamicEdges: Edge[] = [];

    // Find all resources that are actually assigned to tasks to prevent floating disconnected nodes
    const assignedResourceIds = new Set(
      missions.flatMap(mission => mission.tasks.map(task => task.assignedResourceId)).filter(Boolean)
    );

    // Add Resources (Only those assigned to active tasks)
    resources.forEach((res) => {
      if (assignedResourceIds.has(res.id) || res.status === "FAILED") {
        dynamicNodes.push({
          id: res.id,
          type: "resourceNode",
          position: { x: 0, y: 0 },
          data: { label: res.name, status: res.status.toLowerCase() },
        });
      }
    });

    // Add Missions and Tasks
    missions.forEach((mission) => {
      dynamicNodes.push({
        id: mission.id,
        type: "missionNode",
        position: { x: 0, y: 0 },
        data: { label: mission.name, status: mission.status.toLowerCase() },
      });

      mission.tasks.forEach((task) => {
        const taskId = `${mission.id}-${task.id}`;
        dynamicNodes.push({
          id: taskId,
          type: "taskNode",
          position: { x: 0, y: 0 },
          data: { label: task.name, status: task.status.toLowerCase() },
        });

        // Edge: Mission -> Task
        dynamicEdges.push({
          id: `e-${mission.id}-${taskId}`,
          source: mission.id,
          target: taskId,
          type: "smoothstep",
          animated: task.status !== "COMPLETED",
          style: { stroke: "#6C63FF", strokeWidth: 2 },
        });

        // Edge: Task -> Resource
        if (task.assignedResourceId) {
          dynamicEdges.push({
            id: `e-${taskId}-${task.assignedResourceId}`,
            source: taskId,
            target: task.assignedResourceId,
            type: "smoothstep",
            animated: task.status === "RUNNING",
            style: { stroke: "#FF4D4D", strokeWidth: 2, strokeDasharray: "5,5" },
          });
        }
      });
    });

    if (dynamicNodes.length > 0) {
      // Use LR (Left-to-Right) layout for a cleaner timeline appearance
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(dynamicNodes, dynamicEdges, "LR");
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [missions, resources, setNodes, setEdges]);

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
