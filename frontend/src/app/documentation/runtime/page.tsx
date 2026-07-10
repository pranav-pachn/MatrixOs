import React from "react";
import Link from "next/link";
import { DocsPageHeader } from "@/components/documentation/DocsPageHeader";

export default function RuntimePage() {
  return (
    <>
      <DocsPageHeader
        title="Runtime"
        summary="The execution engine that drives state transitions and agent evaluation."
        readingTime="10 min"
        lastUpdated="July 2026"
        version="1.0"
      />

      <h2 id="overview">Overview</h2>
      <p>
        The MatrixOS Runtime is the infinite loop that powers your environment. It is responsible for orchestrating the flow of data between the Shared World Model, the Operational Graph, and the reasoning agents.
      </p>

      <h2 id="runtime-lifecycle">Runtime Lifecycle</h2>
      <p>
        When an environment is provisioned, the Runtime goes through the following lifecycle phases:
      </p>
      <ul>
        <li><strong>Bootstrapping:</strong> Loading the Adapter schemas and initializing the World Model.</li>
        <li><strong>Syncing:</strong> Connecting to the external Event Bus to ingest initial state.</li>
        <li><strong>Execution Loop:</strong> The continuous tick-based processing phase.</li>
        <li><strong>Suspension:</strong> A halted state triggered manually or by critical safety violations.</li>
      </ul>

      <h2 id="execution-loop">Execution Loop</h2>
      <p>
        At a configured frequency (e.g., 100ms), the Runtime performs a "tick". During each tick, it executes the following strictly ordered steps:
      </p>
      <ol>
        <li>Apply pending state mutations to the Shared World Model.</li>
        <li>Evaluate all configured Invariants against the new World Model.</li>
        <li>If an Invariant is violated, freeze the Operational Graph and invoke the Recovery Engine.</li>
        <li>If Invariants pass, evaluate the Operational Graph and dispatch the next set of valid tasks.</li>
      </ol>

      <div className="bg-[#0B0B0B] border border-white/[0.08] p-6 rounded-xl my-8">
        <h4 className="text-white font-semibold flex items-center gap-2 mb-2">
          <span className="text-green-500">✓</span> Best Practice
        </h4>
        <p className="text-[#A1A1AA] m-0">
          Ensure your Runtime tick rate aligns with your physical reality. A warehouse of fast-moving bots requires a 10ms tick rate. An airport turnaround process may only require a 5-second tick rate, saving immense compute resources.
        </p>
      </div>

      <h2 id="event-processing">Event Processing</h2>
      <p>
        Events arrive asynchronously but are processed synchronously during the tick. This deterministic behavior ensures that race conditions cannot cause invariant evaluation to fail incorrectly.
      </p>

      <pre><code>{`// Example Runtime Configuration
const runtimeConfig = {
  tickRateMs: 250,
  maxEventsPerTick: 1000,
  autoSuspendOnCriticalViolation: true
};`}</code></pre>

      <h2 id="state-transitions">State Transitions</h2>
      <p>
        The Runtime governs state transitions for all nodes in the Operational Graph. A task node typically moves from <code>PENDING</code> → <code>ACTIVE</code> → <code>COMPLETED</code>. However, the Runtime can forcefully transition nodes to <code>ABORTED</code> or <code>BLOCKED</code> based on World Model updates.
      </p>

      <div className="mt-16 pt-8 border-t border-white/10">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4">Related</h3>
        <div className="flex flex-col gap-3">
          <Link href="/documentation/planner-agent" className="text-primary hover:text-primary/80 flex items-center gap-2">
            → Planner Agent
          </Link>
          <Link href="/documentation/recovery-engine" className="text-primary hover:text-primary/80 flex items-center gap-2">
            → Recovery Engine
          </Link>
        </div>
      </div>
    </>
  );
}
