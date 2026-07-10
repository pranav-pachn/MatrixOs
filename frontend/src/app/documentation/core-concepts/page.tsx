import React from "react";
import Link from "next/link";
import { DocsPageHeader } from "@/components/documentation/DocsPageHeader";

export default function CoreConceptsPage() {
  return (
    <>
      <DocsPageHeader
        title="Core Concepts"
        summary="Understand the fundamental primitives that power MatrixOS: Operational Runtimes, Graph Models, and the Semantic Graph."
        readingTime="9 min"
        lastUpdated="July 2026"
        version="1.0"
      />

      <h2 id="operational-runtime">Operational Runtime</h2>
      <p>
        The Operational Runtime is the execution engine of MatrixOS. Unlike a standard OS that schedules CPU threads, the Operational Runtime schedules real-world state transitions. It ticks at a configured frequency, constantly aligning the physical world with your operational intent.
      </p>

      <h2 id="environment">Environment</h2>
      <p>
        An Environment is a sandboxed instance of the Operational Runtime. You can have multiple environments (e.g., <code>Simulation</code>, <code>Staging</code>, <code>Live</code>) running simultaneously. Each environment contains its own isolated World Model, Graph, and Adapter configurations.
      </p>

      <h2 id="operational-graph">Operational Graph</h2>
      <p>
        The Operational Graph is a directed acyclic graph (DAG) representing the intended execution of tasks. Nodes represent atomic operations (e.g., "Board Passengers"), while edges represent temporal or resource dependencies.
      </p>

      <h2 id="shared-world-model">Shared World Model</h2>
      <p>
        The Shared World Model is a real-time semantic database representing the <em>actual</em> physical state of your domain. While the Operational Graph maps what <em>should</em> happen, the World Model maps what <em>is</em> happening. MatrixOS constantly calculates the divergence between the two.
      </p>

      <h2 id="planner">Planner</h2>
      <p>
        When the World Model diverges too far from the Operational Graph, the Planner agent is invoked. It analyzes the current physical state, the end goal, and all configured constraints, and synthesizes a new Operational Graph dynamically to reach the goal.
      </p>

      <h2 id="recovery">Recovery</h2>
      <p>
        Recovery is a specialized, high-priority planning phase. It is triggered exclusively when a hard <strong>Invariant</strong> is violated (e.g., a critical safety constraint is broken). The Recovery Engine halts standard execution and takes immediate corrective action to restore system safety.
      </p>

      <h2 id="adapters">Adapters</h2>
      <p>
        Adapters are domain-specific plugins. The core MatrixOS engine doesn't know what a "Fuel Truck" or a "Trauma Bay" is. Adapters provide the semantic vocabulary, physical rules, and default invariants for a specific industry, allowing the LLM reasoning engine to understand the context.
      </p>

      <h2 id="invariants">Invariants</h2>
      <p>
        Invariants are absolute constraints that must evaluate to <code>true</code> at every tick of the Runtime. They are declarative statements about reality. If an invariant evaluates to <code>false</code>, a divergence fault is thrown.
      </p>
      <pre><code>{`// Example Invariant
invariant {
  target: "Flight 104",
  condition: "FuelTruck.status != 'fueling' WHEN Passengers.status == 'boarding'",
  severity: "CRITICAL"
}`}</code></pre>

      <h2 id="runtime-state">Runtime State</h2>
      <p>
        The Runtime State is a snapshot of the entire environment at a specific tick, containing the current World Model, the active Operational Graph, and the evaluation results of all Invariants. This state is immutable and appended to an event log for replayability and audit.
      </p>

      <div className="mt-16 pt-8 border-t border-white/10">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4">Related</h3>
        <div className="flex flex-col gap-3">
          <Link href="/documentation/shared-world-model" className="text-primary hover:text-primary/80 flex items-center gap-2">
            → Shared World Model
          </Link>
          <Link href="/documentation/runtime" className="text-primary hover:text-primary/80 flex items-center gap-2">
            → Runtime Execution
          </Link>
        </div>
      </div>
    </>
  );
}
