import { Scenario } from "@/types/runtime";
import { Node, Edge } from "@xyflow/react";

export const warehouseScenario: Scenario = {
  id: "warehouse",
  name: "Warehouse",
  missions: [
    {
        "id": "MSN-W88",
        "name": "Outbound Freight 404",
        "type": "Fulfillment",
        "status": "diverged",
        "priority": 1,
        "deadline": "2026-07-09T20:00:00.000Z",
        "tasks": [
            {
                "id": "t1",
                "name": "Pallet Picking",
                "type": "logistics",
                "status": "COMPLETED",
                "duration": 25,
                "assignedResourceId": "RES-W3",
                "dependencies": []
            },
            {
                "id": "t2",
                "name": "Dock Loading",
                "type": "loading",
                "status": "PENDING",
                "duration": 15,
                "assignedResourceId": "RES-W4",
                "dependencies": [
                    "t1"
                ]
            }
        ]
    },
    {
        "id": "MSN-W89",
        "name": "Inbound Restock A2",
        "type": "Inventory",
        "status": "in-progress",
        "priority": 2,
        "deadline": "2026-07-09T21:30:00.000Z",
        "tasks": [
            {
                "id": "t1",
                "name": "Unload",
                "type": "loading",
                "status": "COMPLETED",
                "duration": 10,
                "assignedResourceId": "RES-W2",
                "dependencies": []
            },
            {
                "id": "t2",
                "name": "Sort",
                "type": "logistics",
                "status": "RUNNING",
                "duration": 30,
                "assignedResourceId": "RES-W3",
                "dependencies": [
                    "t1"
                ]
            }
        ]
    },
    {
        "id": "MSN-W90",
        "name": "Robot Dispatch",
        "type": "Fulfillment",
        "status": "diverged",
        "priority": 1,
        "deadline": "2026-07-09T18:20:00.000Z",
        "tasks": [
            {
                "id": "t1",
                "name": "Path Calculation",
                "type": "logistics",
                "status": "COMPLETED",
                "duration": 2,
                "assignedResourceId": null,
                "dependencies": []
            },
            {
                "id": "t2",
                "name": "Transport",
                "type": "logistics",
                "status": "PENDING",
                "duration": 15,
                "assignedResourceId": "RES-W1",
                "dependencies": [
                    "t1"
                ]
            }
        ]
    },
    {
        "id": "MSN-W91",
        "name": "Shipment Route 7",
        "type": "Fulfillment",
        "status": "normal",
        "priority": 2,
        "deadline": "2026-07-09T19:00:00.000Z",
        "tasks": [
            {
                "id": "t1",
                "name": "Staging",
                "type": "logistics",
                "status": "COMPLETED",
                "duration": 5,
                "assignedResourceId": null,
                "dependencies": []
            },
            {
                "id": "t2",
                "name": "Loading",
                "type": "loading",
                "status": "PENDING",
                "duration": 15,
                "assignedResourceId": "RES-W2",
                "dependencies": [
                    "t1"
                ]
            }
        ]
    }
],
  resources: [
    { id: "RES-W1", type: "Autonomous Bot", status: "failed", name: "Bot 004" },
    { id: "RES-W2", type: "Loading Dock", status: "occupied", name: "Dock B" },
    { id: "RES-W3", type: "Conveyor Belt", status: "available", name: "Belt 3A" },
    { id: "RES-W4", type: "Forklift", status: "unavailable", name: "FL-09" },
  ],
  nodes: [
    { id: "mission-1", position: { x: 0, y: 0 }, data: { label: "Outbound Freight 404", status: "diverged" }, type: "missionNode" },
    { id: "task-1", type: "taskNode", position: { x: 0, y: 0 }, data: { label: "Pallet Picking", status: "complete" } },
    { id: "task-2", type: "taskNode", position: { x: 0, y: 0 }, data: { label: "Dock Loading", status: "pending" } },
    { id: "res-1", type: "resourceNode", position: { x: 0, y: 0 }, data: { label: "Dock B", status: "occupied" } },
    { id: "res-2", type: "resourceNode", position: { x: 0, y: 0 }, data: { label: "Bot 004", status: "failed" } },
  ] as Node[],
  edges: [
    { id: "e1", source: "mission-1", target: "task-1", type: "smoothstep", animated: true, style: { stroke: "#6C63FF", strokeWidth: 2 } },
    { id: "e2", source: "mission-1", target: "task-2", type: "smoothstep", animated: true, style: { stroke: "#6C63FF", strokeWidth: 2 } },
    { id: "e3", source: "task-1", target: "res-1", type: "smoothstep", animated: false, style: { stroke: "#434343", strokeWidth: 2 } },
    { id: "e4", source: "task-2", target: "res-2", type: "smoothstep", animated: true, style: { stroke: "#FF4D4D", strokeWidth: 2, strokeDasharray: "5,5" } },
  ] as Edge[],
  divergences: [
    {
      id: "DIV-003",
      eventId: "EVT-777",
      expectedState: "Bot 004 in transit to Dock B",
      actualState: "Bot 004 path blocked (Collision detected)",
      severity: "warning",
      detectedAt: "2026-07-09T18:10:00.000Z"
    }
  ],
  memories: [
    { id: "MEM-W91", type: "Path Obstruction", strategy: "Dynamic Re-routing", confidence: 97, outcome: "success", date: "2026-07-09T11:22:00Z" },
    { id: "MEM-W85", type: "Inventory Mismatch", strategy: "Audit Cycle Count", confidence: 88, outcome: "success", date: "2026-07-08T14:15:00Z" },
    { id: "MEM-W82", type: "Dock Congestion", strategy: "Spillover Assignment", confidence: 64, outcome: "failure", date: "2026-07-07T09:45:00Z" },
    { id: "MEM-W80", type: "Bot Battery Low", strategy: "Auto-Charge Swap", confidence: 99, outcome: "success", date: "2026-07-05T22:12:00Z" },
    { id: "MEM-W76", type: "Path Obstruction", strategy: "Dynamic Re-routing", confidence: 95, outcome: "success", date: "2026-07-02T12:30:00Z" },
  ],
  confidenceData: [
    { strategy: "Dynamic Re-route", confidence: 97 },
    { strategy: "Auto-Charge Swap", confidence: 99 },
    { strategy: "Audit Cycle Count", confidence: 88 },
    { strategy: "Spillover Assign", confidence: 64 },
    { strategy: "Manual Override", confidence: 35 },
  ],
  currentPlan: {
    eventType: "Autonomous Path Obstruction: Sector 7G",
    affectedMissions: ["Outbound Freight 404"],
    confidence: 97,
    steps: [
      {
        id: "step-1",
        title: "Semantic Routing Engine",
        description: "Calculating alternative corridors to bypass Sector 7G block.",
        status: "complete",
        duration: 25,
        metrics: [
          { label: "Search Radius", value: "Sector 7", trend: "neutral" },
          { label: "Candidates", value: "8", trend: "up" },
        ]
      },
      {
        id: "step-2",
        title: "Constraint Validation",
        description: "Verifying load width constraints for narrow corridors.",
        status: "complete",
        duration: 150,
        codeSnippet: `def check_corridor(bot, corridor):\n  if not bot.width + bot.load_width < corridor.width:\n    return False\n  if corridor.traffic_density > 0.8:\n    return False\n  return True`,
        metrics: [
          { label: "Valid Matches", value: "2", trend: "down" }
        ]
      },
      {
        id: "step-3",
        title: "Dispatch Authorization",
        description: "Pushing updated routing table to Bot 004.",
        status: "active",
        duration: 400,
        metrics: [
          { label: "Selected Path", value: "Corridor 7H", trend: "neutral" },
          { label: "Delay Added", value: "1m 15s", trend: "up" }
        ]
      },
      {
        id: "step-4",
        title: "Graph Mutation",
        description: "Committing new edges to the Operational Graph and resolving divergence.",
        status: "pending"
      }
    ]
  }
};
