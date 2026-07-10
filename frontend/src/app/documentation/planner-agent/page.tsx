import React from "react";
import Link from "next/link";
import { DocsPageHeader } from "@/components/documentation/DocsPageHeader";

export default function PlannerAgentPage() {
  return (
    <>
      <DocsPageHeader
        title="Planner Agent"
        summary="Autonomously synthesize execution plans based on current invariants."
        readingTime="11 min"
        lastUpdated="July 2026"
        version="1.0"
      />

      <h2 id="overview">Overview</h2>
      <p>
        The Planner Agent is the intelligent core of MatrixOS. While traditional orchestration systems require you to explicitly define every step of a workflow, the Planner Agent allows you to define the <strong>Goal</strong> and the <strong>Constraints</strong>, and it will autonomously synthesize the valid graph of execution steps to get there.
      </p>

      <h2 id="planning-algorithm">Planning Algorithm</h2>
      <p>
        MatrixOS utilizes a neuro-symbolic approach. It combines LLM-driven semantic reasoning with deterministic constraint solvers. 
      </p>
      <ul>
        <li>The LLM decomposes the high-level goal into logical steps based on the Adapter vocabulary.</li>
        <li>The Constraint Solver validates the proposed steps against the Invariants.</li>
        <li>If a step violates a physical rule, the solver rejects it, and the LLM attempts a different path.</li>
      </ul>

      <div className="bg-[#0B0B0B] border border-white/[0.08] p-6 rounded-xl my-8">
        <h4 className="text-white font-semibold flex items-center gap-2 mb-2">
          <span className="text-blue-500">ℹ</span> Non-Deterministic AI, Deterministic Execution
        </h4>
        <p className="text-[#A1A1AA] m-0">
          While the LLM generation phase is probabilistic, the output is converted into a strictly typed DAG (Directed Acyclic Graph) that is verified by the Runtime before a single action is ever executed.
        </p>
      </div>

      <h2 id="goal-decomposition">Goal Decomposition</h2>
      <p>
        When you submit a goal like <code>"Turnaround Flight 104 in 45 minutes"</code>, the Planner Agent breaks it down. It queries the Shared World Model to see the current state (e.g., "Where is Flight 104?", "Are fuel trucks available?"). It then creates tasks: Deploy Stairs, Unload Baggage, Refuel, Board Passengers.
      </p>

      <h2 id="dependency-graph">Dependency Graph</h2>
      <p>
        The Planner does not just create a list of tasks; it creates a dependency graph. It knows that <code>Board Passengers</code> cannot start until <code>Refuel</code> is complete, because the Airport Adapter defines a safety invariant prohibiting fueling while passengers are boarding.
      </p>

      <pre><code>{`// Planner Output Example (Internal DAG Representation)
{
  "goal": "Turnaround_Flight_104",
  "nodes": [
    { "id": "task_1", "type": "DeployStairs", "status": "PENDING" },
    { "id": "task_2", "type": "Refuel", "status": "PENDING" },
    { "id": "task_3", "type": "BoardPassengers", "status": "PENDING" }
  ],
  "edges": [
    { "from": "task_1", "to": "task_3" },
    { "from": "task_2", "to": "task_3" } // Enforces fueling must finish before boarding
  ]
}`}</code></pre>

      <h2 id="best-practices">Best Practices</h2>
      <p>
        Do not over-constrain the Planner. If you define too many rigid edges manually, you defeat the purpose of autonomous planning. Provide the goal, define the safety invariants, and let the agent discover the optimal execution path.
      </p>

      <div className="mt-16 pt-8 border-t border-white/10">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4">Related</h3>
        <div className="flex flex-col gap-3">
          <Link href="/documentation/recovery-engine" className="text-primary hover:text-primary/80 flex items-center gap-2">
            → Recovery Engine
          </Link>
          <Link href="/documentation/shared-world-model" className="text-primary hover:text-primary/80 flex items-center gap-2">
            → Shared World Model
          </Link>
        </div>
      </div>
    </>
  );
}
