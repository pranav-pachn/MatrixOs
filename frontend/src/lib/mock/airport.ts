import { Scenario } from "@/types/runtime";
import { Node, Edge } from "@xyflow/react";

export const airportScenario: Scenario = {
  id: "airport",
  name: "Airport Hub",
  missions: [
    {
      id: "MSN-101",
      name: "Flight AA102",
      type: "Turnaround",
      status: "diverged",
      priority: 1,
      deadline: "2026-07-09T18:30:00.000Z",
      tasks: [
        { id: "t1", name: "Deboarding", type: "pax", status: "complete", duration: 15, dependencies: [] },
        { id: "t2", name: "Fueling", type: "fuel", status: "pending", duration: 20, dependencies: [] }
      ],
    },
    {
      id: "MSN-102",
      name: "Flight DL405",
      type: "Arrival",
      status: "in-progress",
      priority: 2,
      deadline: "2026-07-09T19:30:00.000Z",
      tasks: [
        { id: "t1", name: "Gate Assign", type: "gate", status: "complete", duration: 5, dependencies: [] },
        { id: "t2", name: "Taxi", type: "ground", status: "active", duration: 10, dependencies: [] },
        { id: "t3", name: "Block In", type: "ground", status: "pending", duration: 2, dependencies: [] }
      ],
    }
  ],
  resources: [
    { id: "RES-01", type: "Fuel Truck", status: "failed", name: "FT-402" },
    { id: "RES-02", type: "Gate", status: "occupied", name: "Gate B12" },
    { id: "RES-03", type: "Baggage Cart", status: "available", name: "BC-109" },
    { id: "RES-04", type: "Pushback", status: "unavailable", name: "PB-04" },
  ],
  nodes: [
    { id: "mission-1", position: { x: 0, y: 0 }, data: { label: "Flight AA102", status: "diverged" }, type: "missionNode" },
    { id: "task-1", type: "taskNode", position: { x: 0, y: 0 }, data: { label: "Deboarding", status: "complete" } },
    { id: "task-2", type: "taskNode", position: { x: 0, y: 0 }, data: { label: "Fueling", status: "pending" } },
    { id: "res-1", type: "resourceNode", position: { x: 0, y: 0 }, data: { label: "Gate B12", status: "occupied" } },
    { id: "res-2", type: "resourceNode", position: { x: 0, y: 0 }, data: { label: "FT-402", status: "failed" } },
  ] as Node[],
  edges: [
    { id: "e1", source: "mission-1", target: "task-1", type: "smoothstep", animated: true, style: { stroke: "#6C63FF", strokeWidth: 2 } },
    { id: "e2", source: "mission-1", target: "task-2", type: "smoothstep", animated: true, style: { stroke: "#6C63FF", strokeWidth: 2 } },
    { id: "e3", source: "task-1", target: "res-1", type: "smoothstep", animated: false, style: { stroke: "#434343", strokeWidth: 2 } },
    { id: "e4", source: "task-2", target: "res-2", type: "smoothstep", animated: true, style: { stroke: "#FF4D4D", strokeWidth: 2, strokeDasharray: "5,5" } },
  ] as Edge[],
  divergences: [
    {
      id: "DIV-001",
      eventId: "EVT-999",
      expectedState: "Resource FT-402 online",
      actualState: "Resource FT-402 failed",
      severity: "critical",
      detectedAt: "2026-07-09T18:00:00.000Z"
    }
  ],
  memories: [
    { id: "MEM-902", type: "Resource Failure", strategy: "Semantic Re-routing", confidence: 94, outcome: "success", date: "2026-07-09T14:22:00Z" },
    { id: "MEM-844", type: "Weather Delay", strategy: "Dynamic De-icing Queue", confidence: 88, outcome: "success", date: "2026-07-08T09:15:00Z" },
    { id: "MEM-812", type: "Cascading Delay", strategy: "Gate Re-allocation", confidence: 62, outcome: "failure", date: "2026-07-06T18:45:00Z" },
    { id: "MEM-799", type: "Crew Shortage", strategy: "Reserve Activation", confidence: 98, outcome: "success", date: "2026-07-05T04:12:00Z" },
    { id: "MEM-750", type: "Resource Failure", strategy: "Semantic Re-routing", confidence: 85, outcome: "success", date: "2026-07-01T22:30:00Z" },
    { id: "MEM-721", type: "Security Breach", strategy: "Procedural Lockdown", confidence: 99, outcome: "success", date: "2026-06-28T11:05:00Z" },
    { id: "MEM-688", type: "Weather Delay", strategy: "Ground Hold Program", confidence: 74, outcome: "success", date: "2026-06-25T16:20:00Z" },
    { id: "MEM-640", type: "System Outage", strategy: "Manual Override", confidence: 45, outcome: "failure", date: "2026-06-20T08:00:00Z" },
  ],
  confidenceData: [
    { strategy: "Semantic Routing", confidence: 94 },
    { strategy: "Dynamic Queue", confidence: 88 },
    { strategy: "Reserve Swap", confidence: 98 },
    { strategy: "Ground Hold", confidence: 74 },
    { strategy: "Gate Swap", confidence: 62 },
    { strategy: "Override", confidence: 45 },
  ],
  currentPlan: {
    eventType: "Fuel Truck Breakdown",
    affectedMissions: ["UA402", "DL891"],
    confidence: 0.94,
    steps: [
      {
        id: "step-1",
        title: "Semantic Routing Engine",
        description: "Analyzing topology for available replacement units within constraint bounds.",
        status: "complete",
        duration: 120,
        metrics: [
          { label: "Search Radius", value: "2.4 km", trend: "neutral" },
          { label: "Candidates", value: "14", trend: "up" },
        ]
      },
      {
        id: "step-2",
        title: "Constraint Validation",
        description: "Checking physical invariants and dependency graphs for top candidates.",
        status: "complete",
        duration: 450,
        codeSnippet: `def check_invariants(truck, flight):\n  if not truck.is_compatible(flight.fuel_type):\n    return False\n  if truck.eta(flight.gate) > flight.deadline:\n    return False\n  return True`,
        metrics: [
          { label: "Valid Matches", value: "3", trend: "down" }
        ]
      },
      {
        id: "step-3",
        title: "Dispatch Authorization",
        description: "Executing autonomous dispatch protocol to FT-909.",
        status: "active",
        duration: 800,
        metrics: [
          { label: "Selected Resource", value: "FT-909", trend: "neutral" },
          { label: "ETA", value: "4m 12s", trend: "up" }
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
