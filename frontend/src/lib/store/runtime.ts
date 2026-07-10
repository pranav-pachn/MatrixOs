import { create } from "zustand";
import { Mission, Resource, Divergence, Memory, RecoveryStep, Scenario, SystemMetrics, InvariantResult, RuntimePhase, PhaseState } from "@/types/runtime";
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
  events: any[];
  
  metrics: any | null;
  invariants: InvariantResult[];
  isLoading: boolean;
  wsConnected: boolean;
  
  lifecycle: Record<RuntimePhase, PhaseState>;
  
  // Actions
  loadScenario: (scenarioId: string) => Promise<void>;
  setMissions: (missions: Mission[]) => void;
  setResources: (resources: Resource[]) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setDivergences: (divergences: Divergence[]) => void;
  addEvent: (event: any) => void;
  
  setPhaseState: (phase: RuntimePhase, state: PhaseState) => void;
  resetLifecycle: () => void;
  
  setMetrics: (metrics: any) => void;
  setInvariants: (invariants: InvariantResult[]) => void;
  setWsConnected: (connected: boolean) => void;
  updateRecoveryPlan: (recovery: Scenario["recovery"]) => void;
  updateWorldState: (missions: Mission[], resources: Resource[], divergences: Divergence[], edges: Edge[]) => void;
  resolveDivergence: (divergenceId: string) => void;
}

const scenarios: Record<string, Scenario> = {
  airport: airportScenario,
  "hospital-er": hospitalScenario,
  "warehouse-hub": warehouseScenario,
};

export const useRuntimeStore = create<RuntimeState>((set, get) => ({
  activeScenarioId: "airport", // Start with default to prevent errors, updated on load
  missions: airportScenario.missions,
  resources: airportScenario.resources,
  nodes: airportScenario.nodes,
  edges: airportScenario.edges,
  divergences: airportScenario.divergences,
  memories: airportScenario.memories,
  confidenceData: airportScenario.confidenceData,
  recovery: airportScenario.recovery,
  events: [],
  
  metrics: null,
  invariants: [],
  isLoading: false,
  wsConnected: false,
  
  lifecycle: {
    OBSERVING: { status: "pending" },
    ASSESSING: { status: "pending" },
    PLANNING: { status: "pending" },
    POLICY: { status: "pending" },
    OPTIMIZING: { status: "pending" },
    VALIDATING: { status: "pending" },
    EXECUTING: { status: "pending" },
    COMPLETED: { status: "pending" },
    FAILED: { status: "pending" },
  },

  loadScenario: async (scenarioId: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/scenarios/${scenarioId}/state`);
      if (!response.ok) throw new Error("Failed to fetch scenario state");
      const scenario: Scenario = await response.json();
      
      const metricsRes = await fetch(`http://127.0.0.1:8000/api/scenarios/${scenarioId}/metrics`);
      let metrics = null;
      if (metricsRes.ok) {
        metrics = await metricsRes.json();
      }

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
        metrics,
        isLoading: false
      });
    } catch (error) {
      console.error("Error loading scenario from backend:", error);
      // Fallback to local mocks if backend fails
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
        isLoading: false
      });
    }
  },

  setMissions: (missions) => set({ missions }),
  setResources: (resources) => set({ resources }),
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setDivergences: (divergences) => set({ divergences }),
  addEvent: (event) => set((state) => ({ events: [event, ...state.events] })),
  
  setPhaseState: (phase, stateData) => set((state) => ({
    lifecycle: {
      ...state.lifecycle,
      [phase]: stateData
    }
  })),
  resetLifecycle: () => set({
    lifecycle: {
      OBSERVING: { status: "pending" },
      ASSESSING: { status: "pending" },
      PLANNING: { status: "pending" },
      POLICY: { status: "pending" },
      OPTIMIZING: { status: "pending" },
      VALIDATING: { status: "pending" },
      EXECUTING: { status: "pending" },
      COMPLETED: { status: "pending" },
      FAILED: { status: "pending" },
    }
  }),
  
  setMetrics: (metrics) => set({ metrics }),
  setInvariants: (invariants) => set({ invariants }),
  setWsConnected: (connected) => set({ wsConnected: connected }),
  updateRecoveryPlan: (recovery) => set({ recovery }),
  updateWorldState: (missions, resources, divergences, edges) => set({ missions, resources, divergences, edges }),
  resolveDivergence: (divergenceId) => set((state) => ({
    divergences: state.divergences.filter(d => d.id !== divergenceId)
  }))
}));
