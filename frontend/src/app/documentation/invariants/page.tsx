import React from "react";
import Link from "next/link";
import { DocsPageHeader } from "@/components/documentation/DocsPageHeader";

export default function InvariantsPage() {
  return (
    <>
      <DocsPageHeader
        title="Invariants"
        summary="Define the fundamental physical and logical truths of your environment."
        readingTime="8 min"
        lastUpdated="July 2026"
        version="1.0"
      />

      <h2 id="overview">Overview</h2>
      <p>
        Invariants are the absolute laws of your operational environment. They are declarative rules that must evaluate to <code>true</code> at every single tick of the Runtime. If an invariant is broken, the system is in an unsafe state.
      </p>

      <h2 id="why-they-matter">Why they matter</h2>
      <p>
        Traditional programming relies on control flow (if/else) to handle errors. But in reality, you cannot predict every possible way a system might fail. A baggage cart might break down, a storm might delay a flight, or a sensor might glitch. 
      </p>
      <p>
        Instead of writing handlers for a million scenarios, you define a single Invariant: <code>"A taxiway must remain unobstructed."</code> MatrixOS handles the rest.
      </p>

      <h2 id="constraint-validation">Constraint Validation</h2>
      <p>
        Invariants are evaluated synchronously against the Shared World Model. They are written in a specialized expression syntax that is compiled down for high-performance execution, allowing thousands of constraints to be checked in milliseconds.
      </p>

      <pre><code>{`// Example Hospital Invariant
{
  "id": "inv_triage_01",
  "name": "Critical Patient SLA",
  "expression": "Patient.acuity == 'critical' implies Patient.wait_time < 5m",
  "severity": "CRITICAL"
}`}</code></pre>

      <h2 id="severity-levels">Severity Levels</h2>
      <ul>
        <li><strong>CRITICAL:</strong> Halts the entire operational graph and forces immediate Recovery mode. (e.g., Collision detected).</li>
        <li><strong>WARNING:</strong> Triggers the Recovery Engine to run in the background to find a better optimization, but does not halt current execution. (e.g., Bottleneck forming).</li>
        <li><strong>INFO:</strong> Emits an event to the analytics dashboard without triggering recovery.</li>
      </ul>

      <div className="bg-[#0B0B0B] border border-white/[0.08] p-6 rounded-xl my-8">
        <h4 className="text-white font-semibold flex items-center gap-2 mb-2">
          <span className="text-green-500">✓</span> Best Practice
        </h4>
        <p className="text-[#A1A1AA] m-0">
          Keep invariants simple and atomic. Instead of writing one massive invariant that checks 10 different conditions, write 10 individual invariants. This allows the Recovery Engine to pinpoint the exact failure much faster.
        </p>
      </div>

      <div className="mt-16 pt-8 border-t border-white/10">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4">Related</h3>
        <div className="flex flex-col gap-3">
          <Link href="/documentation/recovery-engine" className="text-primary hover:text-primary/80 flex items-center gap-2">
            → Recovery Engine
          </Link>
          <Link href="/documentation/adapters" className="text-primary hover:text-primary/80 flex items-center gap-2">
            → Adapters
          </Link>
        </div>
      </div>
    </>
  );
}
