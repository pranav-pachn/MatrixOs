import React from "react";
import Link from "next/link";
import { DocsPageHeader } from "@/components/documentation/DocsPageHeader";

export default function SharedWorldModelPage() {
  return (
    <>
      <DocsPageHeader
        title="Shared World Model"
        summary="Synchronize every operational entity into one verifiable semantic graph."
        readingTime="11 min"
        lastUpdated="July 2026"
        version="1.0"
      />

      <h2 id="overview">Overview</h2>
      <p>
        The Shared World Model (SWM) is the beating heart of MatrixOS. It acts as the single, authoritative source of truth for the physical and logical state of your operational environment. By representing reality as a semantic graph, MatrixOS enables autonomous agents to reason about complex, multi-variable environments.
      </p>

      <h2 id="semantic-representation">Semantic Representation</h2>
      <p>
        Traditional systems store state in relational databases, which struggle to represent complex physical realities and contextual relationships. The SWM stores data semantically:
      </p>
      <ul>
        <li><strong>Entities:</strong> Physical objects (bots, trucks, doctors).</li>
        <li><strong>Properties:</strong> Current state attributes (location, status, capacity).</li>
        <li><strong>Relationships:</strong> How entities interact (Truck A <em>is blocking</em> Gate B).</li>
      </ul>

      <h2 id="world-state-synchronization">World State Synchronization</h2>
      <p>
        The SWM must remain perfectly synchronized with physical reality. This is achieved via a high-frequency event ingestion pipeline. Sensors, API webhooks, and manual inputs stream into the SWM Event Bus, which updates the graph in real-time.
      </p>

      <div className="bg-[#0B0B0B] border border-white/[0.08] p-6 rounded-xl my-8">
        <h4 className="text-white font-semibold flex items-center gap-2 mb-2">
          <span className="text-yellow-500">⚠</span> Latency Warning
        </h4>
        <p className="text-[#A1A1AA] m-0">
          The reasoning engine is only as good as the data it receives. Network latency between your physical sensors and the SWM Event Bus directly impacts the Recovery Engine's ability to prevent invariant violations.
        </p>
      </div>

      <h2 id="graph-relationships">Graph Relationships</h2>
      <p>
        Relationships are first-class citizens in the SWM. When the Planner Agent evaluates a recovery strategy, it traverses these relationships to understand cascading impacts. If a doctor is delayed, the graph reveals which surgeries are impacted, which beds remain occupied, and which ambulances must be diverted.
      </p>

      <h2 id="state-updates">State Updates</h2>
      <p>
        State updates are immutable. Instead of overwriting a property, MatrixOS appends a new state node with a timestamp. This allows the system to perfectly rewind and replay reality, which is crucial for incident forensics and simulation.
      </p>

      <pre><code>{`// Example State Update Payload
{
  "event_id": "evt_9f8d7c",
  "timestamp": 1715421200,
  "entity_id": "bot_42",
  "mutation": {
    "property": "location",
    "value": { "x": 14.5, "y": 8.2, "z": 0 }
  }
}`}</code></pre>

      <h2 id="example">Example</h2>
      <p>
        In an Airport domain, the SWM knows that <code>Gate 4</code> is physically connected to <code>Taxiway B</code>. When a baggage cart reports a breakdown on <code>Taxiway B</code>, the SWM updates the relationship graph. The Runtime detects this, realizes the graph path to <code>Gate 4</code> is severed, and immediately halts planes attempting to route there.
      </p>

      <div className="mt-16 pt-8 border-t border-white/10">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4">Related</h3>
        <div className="flex flex-col gap-3">
          <Link href="/documentation/runtime" className="text-primary hover:text-primary/80 flex items-center gap-2">
            → Runtime Execution Loop
          </Link>
          <Link href="/documentation/api" className="text-primary hover:text-primary/80 flex items-center gap-2">
            → Event Bus API Reference
          </Link>
        </div>
      </div>
    </>
  );
}
