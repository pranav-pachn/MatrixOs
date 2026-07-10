import React from "react";
import Link from "next/link";
import { DocsPageHeader } from "@/components/documentation/DocsPageHeader";

export default function RecoveryEnginePage() {
  return (
    <>
      <DocsPageHeader
        title="Recovery Engine"
        summary="Detect constraint violations and dynamically orchestrate repairs."
        readingTime="12 min"
        lastUpdated="July 2026"
        version="1.0"
      />

      <h2 id="overview">Overview</h2>
      <p>
        No matter how perfect your initial plan is, the real world is chaotic. The Recovery Engine is a specialized, high-priority subsystem of MatrixOS that activates the moment physical reality diverges from your operational plan.
      </p>

      <h2 id="failure-detection">Failure Detection</h2>
      <p>
        The Recovery Engine does not poll for errors. It is event-driven. Every time the Runtime ticks, it evaluates the Shared World Model against the configured Invariants. If a rule evaluates to <code>false</code>, a divergence fault is emitted, and the Recovery Engine intercepts the execution loop.
      </p>

      <h2 id="recovery-planning">Recovery Planning</h2>
      <p>
        Once activated, the Recovery Engine halts the execution of the current Operational Graph. It performs a rapid root-cause analysis by looking at the diff between the expected world state and the actual world state.
      </p>
      <p>
        It then acts as a specialized Planner Agent. It takes the current broken state as the starting point, and the original goal as the endpoint, and synthesizes a "patch" graph—a series of immediate corrective actions.
      </p>

      <div className="bg-[#0B0B0B] border border-white/[0.08] p-6 rounded-xl my-8">
        <h4 className="text-white font-semibold flex items-center gap-2 mb-2">
          <span className="text-red-500">⚠</span> Halting the World
        </h4>
        <p className="text-[#A1A1AA] m-0">
          By default, MatrixOS halts all non-critical tasks during a critical divergence to prevent cascading failures. You can configure this behavior in the Advanced Settings of your Environment.
        </p>
      </div>

      <h2 id="rollback-strategy">Rollback Strategy</h2>
      <p>
        In physical systems, you cannot easily "rollback" a database transaction. If a pallet is dropped, you can't just undo the code. The Recovery Engine instead relies on "Compensating Actions". The Adapter defines what actions can compensate for a failure (e.g., dispatching a cleanup bot).
      </p>

      <h2 id="example-recovery-flow">Example Recovery Flow</h2>
      <p>
        In a Warehouse environment, an autonomous bot breaks down in a narrow aisle.
      </p>
      <ol>
        <li><strong>World State Update:</strong> Bot 42 reports velocity 0, error code 500.</li>
        <li><strong>Detection:</strong> Runtime detects a violation: "Aisles cannot be blocked for {`>`} 30 seconds."</li>
        <li><strong>Halt:</strong> Recovery Engine halts all bots routing through that aisle.</li>
        <li><strong>Plan:</strong> It synthesizes a recovery graph: Dispatch tow-bot to Bot 42, reroute pending bots via Aisle 3.</li>
        <li><strong>Execute:</strong> The recovery graph is merged into the main operational graph and executed.</li>
      </ol>

      <div className="mt-16 pt-8 border-t border-white/10">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4">Related</h3>
        <div className="flex flex-col gap-3">
          <Link href="/documentation/invariants" className="text-primary hover:text-primary/80 flex items-center gap-2">
            → Invariants
          </Link>
          <Link href="/documentation/runtime" className="text-primary hover:text-primary/80 flex items-center gap-2">
            → Runtime
          </Link>
        </div>
      </div>
    </>
  );
}
