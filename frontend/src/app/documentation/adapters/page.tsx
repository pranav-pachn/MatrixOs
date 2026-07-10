import React from "react";
import Link from "next/link";
import { DocsPageHeader } from "@/components/documentation/DocsPageHeader";

export default function AdaptersPage() {
  return (
    <>
      <DocsPageHeader
        title="Adapters"
        summary="Translate real-world domains into MatrixOS semantics."
        readingTime="9 min"
        lastUpdated="July 2026"
        version="1.0"
      />

      <h2 id="overview">Overview</h2>
      <p>
        The MatrixOS core engine is completely domain-agnostic. It understands nodes, edges, states, and constraints, but it does not inherently know what a "Fuel Truck" or a "Trauma Bay" is. 
      </p>
      <p>
        Adapters bridge this gap. An Adapter is a configuration package that defines the semantic vocabulary, physical entity types, operational rules, and default invariants for a specific industry.
      </p>

      <h2 id="adapter-abstraction">Adapter Abstraction</h2>
      <p>
        When you install an adapter, you are providing the reasoning engine with context. If the Planner Agent knows that an entity is of type <code>Vehicle</code>, it understands spatial logic. If it knows a task requires a <code>Specialist</code>, it understands skill-based resource allocation.
      </p>

      <h2 id="hospital-adapter">Hospital Adapter</h2>
      <p>
        The Hospital adapter models emergency rooms, trauma bays, and imaging resources. It includes built-in constraints for triage prioritization, ensuring critical patients are routed correctly even when the ED is at full capacity.
      </p>
      <ul>
        <li><strong>Entities:</strong> Patient, Doctor, Nurse, Trauma Bay, MRI Machine.</li>
        <li><strong>Invariants:</strong> <code>Trauma patients must receive a bed within 5 minutes.</code></li>
      </ul>

      <h2 id="airport-adapter">Airport Adapter</h2>
      <p>
        The Airport adapter handles ground operations, tarmac routing, and turnaround synchronization. It manages spatial constraints to prevent collisions and temporal constraints to ensure on-time departures.
      </p>
      <ul>
        <li><strong>Entities:</strong> Aircraft, Gate, Fuel Truck, Baggage Cart, Catering.</li>
        <li><strong>Invariants:</strong> <code>Fuel trucks cannot operate during passenger boarding.</code></li>
      </ul>

      <h2 id="building-custom-adapters">Building Custom Adapters</h2>
      <p>
        You can build a custom adapter using the MatrixOS SDK. A custom adapter requires defining a JSON/YAML schema of your entities and extending the base <code>Adapter</code> class.
      </p>

      <pre><code>{`import { Adapter, EntitySchema } from "@matrixos/sdk";

const warehouseSchema = new EntitySchema({
  types: {
    AutonomousBot: { properties: ["battery", "location", "payload"] },
    ChargingStation: { properties: ["status", "location"] },
    Pallet: { properties: ["weight", "destination"] }
  }
});

export class WarehouseAdapter extends Adapter {
  schema = warehouseSchema;
  
  onInit() {
    this.registerInvariant("Bots below 15% battery must route to charging station.");
  }
}`}</code></pre>

      <div className="mt-16 pt-8 border-t border-white/10">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4">Related</h3>
        <div className="flex flex-col gap-3">
          <Link href="/documentation/shared-world-model" className="text-primary hover:text-primary/80 flex items-center gap-2">
            → Shared World Model
          </Link>
          <Link href="/documentation/invariants" className="text-primary hover:text-primary/80 flex items-center gap-2">
            → Invariants
          </Link>
        </div>
      </div>
    </>
  );
}
