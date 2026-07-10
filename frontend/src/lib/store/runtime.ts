import { create } from "zustand";
import { Mission, Resource, Divergence, Memory, RecoveryStep, Scenario, SystemMetrics, InvariantResult, RuntimePhase, PhaseState, RuntimeEvent, CurrentPlan } from "@/types/runtime";
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
  currentPlan?: CurrentPlan;
  runtimeEvents: RuntimeEvent[];
  
  metrics: any | null;
  invariants: InvariantResult[];
  isLoading: boolean;
  wsConnected: boolean;
  
  lifecycle: Record<RuntimePhase, PhaseState>;
  
  // Actions
  loadScenario: (scenarioId: string) => Promise<void>;
  
  // WS Reducers
  setSnapshot: (scenario: Scenario) => void;
  applyReplay: (events: RuntimeEvent[]) => void;
  addEvent: (event: RuntimeEvent) => void;
  
  setPhaseState: (phase: RuntimePhase, state: PhaseState) => void;
  resetLifecycle: () => void;
  
  setCurrentPlan: (plan: CurrentPlan) => void;
  setMetrics: (metrics: any) => void;
  setWsConnected: (connected: boolean) => void;
  updateWorldState: (scenario: Partial<Scenario>) => void;
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
  currentPlan: airportScenario.currentPlan,
  runtimeEvents: [],
  
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
    RECOVERY_ACTIVATED: { status: "pending" },
    MEMORY_RETRIEVED: { status: "pending" },
    RECOVERY_REPLANNING: { status: "pending" },
  },

  loadScenario: async (scenarioId: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000'}/api/scenarios/${scenarioId}/state`);
      if (!response.ok) throw new Error("Failed to fetch scenario state");
      const scenario: Scenario = await response.json();
      
      const metricsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000'}/api/scenarios/${scenarioId}/metrics`);
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
        currentPlan: scenario.currentPlan,
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
        currentPlan: scenario.currentPlan,
        isLoading: false
      });
    }
  },

  setSnapshot: (scenario) => set({
    missions: scenario.missions,
    resources: scenario.resources,
    nodes: scenario.nodes,
    edges: scenario.edges,
    divergences: scenario.divergences,
    memories: scenario.memories,
    confidenceData: scenario.confidenceData,
    currentPlan: scenario.currentPlan,
  }),

  applyReplay: (events) => set((state) => {
    const existingIds = new Set(state.runtimeEvents.map((e) => e.id));
    const newEvents = events.reverse().filter((e) => !existingIds.has(e.id));
    return {
      runtimeEvents: [...newEvents, ...state.runtimeEvents]
    };
  }),

  addEvent: (event) => set((state) => {
    if (state.runtimeEvents.some((e) => e.id === event.id)) return state;
    return { runtimeEvents: [event, ...state.runtimeEvents] };
  }),
  
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
      RECOVERY_ACTIVATED: { status: "pending" },
      MEMORY_RETRIEVED: { status: "pending" },
      RECOVERY_REPLANNING: { status: "pending" },
    }
  }),
  
  setCurrentPlan: (plan) => set({ currentPlan: plan }),
  setMetrics: (metrics) => set({ metrics }),
  setWsConnected: (connected) => set({ wsConnected: connected }),
  
  updateWorldState: (scenario) => set((state) => ({ 
    ...state,
    ...scenario
  })),
  
  resolveDivergence: (divergenceId) => set((state) => ({
    divergences: state.divergences.filter(d => d.id !== divergenceId)
  }))
}));
