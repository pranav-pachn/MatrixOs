import { create } from "zustand";
import { Mission, Resource, Divergence, Memory, RecoveryStep, Scenario } from "@/types/runtime";
import { Node, Edge } from "@xyflow/react";

import { airportScenario } from "../mock/airport";
import { hospitalScenario } from "../mock/hospital";
import { warehouseScenario } from "../mock/warehouse";

interface RuntimeState {
  activeScenarioId: string;
  missions: Mission[];
  resources: Resource[];
  nodes: Node[];
  edges: Edge[];
  divergences: Divergence[];
  memories: Memory[];
  confidenceData: { strategy: string; confidence: number }[];
  recovery: Scenario["recovery"];
  
  // Actions
  loadScenario: (scenarioId: string) => void;
  setMissions: (missions: Mission[]) => void;
  setResources: (resources: Resource[]) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setDivergences: (divergences: Divergence[]) => void;
}

const scenarios: Record<string, Scenario> = {
  airport: airportScenario,
  "hospital-er": hospitalScenario,
  "warehouse-hub": warehouseScenario,
};

export const useRuntimeStore = create<RuntimeState>((set) => ({
  activeScenarioId: "airport",
  missions: airportScenario.missions,
  resources: airportScenario.resources,
  nodes: airportScenario.nodes,
  edges: airportScenario.edges,
  divergences: airportScenario.divergences,
  memories: airportScenario.memories,
  confidenceData: airportScenario.confidenceData,
  recovery: airportScenario.recovery,

  loadScenario: (scenarioId: string) => {
    const scenario = scenarios[scenarioId] || airportScenario;
    set({
      activeScenarioId: scenarioId,
      missions: scenario.missions,
      resources: scenario.resources,
      nodes: scenario.nodes,
      edges: scenario.edges,
      divergences: scenario.divergences,
      memories: scenario.memories,
      confidenceData: scenario.confidenceData,
      recovery: scenario.recovery,
    });
  },

  setMissions: (missions) => set({ missions }),
  setResources: (resources) => set({ resources }),
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setDivergences: (divergences) => set({ divergences }),
}));
