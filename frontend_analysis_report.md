# MatrixOS Frontend Readiness & Backend Contract Report

> [!TIP]
> **Status:** The frontend is **fully implemented, typed, and successfully building**. It is ready for the backend to be built against it.

This report outlines exactly what the frontend expects from the backend, so you can build the backend APIs and WebSocket streams seamlessly.

## 1. REST API Contract

The frontend makes the following HTTP calls to `http://127.0.0.1:8001`:

| Endpoint | Method | Purpose | Called From | Expected Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/scenarios` | `GET` | Fetches available adapters/scenarios for the landing page. | `src/app/page.tsx` | Array of `Adapter` objects (id, name, description, status, href). |
| `/api/scenarios/{scenarioId}/state` | `GET` | Fetches the initial world state when entering a playground. | `src/lib/store/runtime.ts` | A `Scenario` object (missions, resources, nodes, edges, divergences, memories, recovery, confidenceData). |
| `/api/scenarios/{scenarioId}/metrics` | `GET` | Fetches the initial system metrics. | `src/lib/store/runtime.ts` | A `SystemMetrics` object (health, constraints, divergenceRate, latency, utilization). |
| `/api/events/inject` | `POST` | Injects a scripted disruption into the system. | `src/components/runtime/TriggerEventPanel.tsx` | Status 200 OK. Body expects: `{ scenarioId: string, type: string }`. |

## 2. WebSocket Contract

Live telemetry and AI reasoning updates are handled entirely through WebSockets. The frontend establishes a connection to:
`ws://127.0.0.1:8001/ws/runtime/{scenarioId}` (in `src/components/runtime/EventStream.tsx`).

The backend must emit JSON payloads with an `event` key specifying the event type. The frontend listens for these 6 event types:

> [!IMPORTANT]
> The backend should broadcast these events to update the UI dynamically during the recovery loop.

1. **`new_divergence`**
   - **Trigger:** When an anomaly or disruption is detected.
   - **Payload:** `{ event: "new_divergence", eventId, timestamp, severity, message }`
2. **`agent_action`**
   - **Trigger:** Streams thoughts/actions from the AI (Planner/Recovery agents) and Invariant Engine.
   - **Payload:** `{ event: "agent_action", timestamp, message }`
3. **`recovery_plan`**
   - **Trigger:** When the Planner Agent outputs a proposed recovery plan.
   - **Payload:** `{ event: "recovery_plan", data: { eventType, affectedMissions, confidence, steps: [...] } }`
4. **`world_state_update`**
   - **Trigger:** After the recovery plan is executed and the shared world model changes.
   - **Payload:** `{ event: "world_state_update", missions: [...], resources: [...], divergences: [...], edges: [...] }`
5. **`divergence_resolved`**
   - **Trigger:** When a divergence is successfully closed.
   - **Payload:** `{ event: "divergence_resolved", divergenceId }`
6. **`metrics_update`**
   - **Trigger:** Live updates to the bottom metrics bar.
   - **Payload:** `{ event: "metrics_update", data: SystemMetrics }`

## 3. Data Models (Types)

The backend responses must map to the following core interfaces defined in `src/types/runtime.ts`. I highly recommend using **Pydantic** in the FastAPI backend to match these strictly.

```typescript
export interface Resource {
  id: string;
  type: string;
  status: 'available' | 'occupied' | 'unavailable' | 'failed';
  name: string;
}

export interface Task {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'complete' | 'rejected';
  duration: number;
}

export interface Mission {
  id: string;
  name: string;
  status: 'normal' | 'in-progress' | 'delayed' | 'recovered' | 'diverged';
  tasks: Task[];
}

export interface RecoveryStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'complete' | 'failed';
}
```

## Next Steps for Backend Development

1. **FastAPI Setup:** Ensure CORS is configured for `*` or `http://localhost:3000`.
2. **State Manager:** Implement the in-memory SQLite state manager to hold the `Scenario` graph.
3. **Recovery Loop:** Wire up the DeepSeek V4 Pro API (which we already prepared in `recovery.py`) to trigger when `/api/events/inject` is called, broadcasting the sequence of WebSocket events listed above as it thinks and acts.
4. **Mock Data Sync:** Align the backend's initial state (Python dictionaries/models) with the frontend's mock data structure (`src/lib/mock/airport.ts`) so the graph renders correctly on load.
