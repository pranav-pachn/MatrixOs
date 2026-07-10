import React from "react";
import Link from "next/link";
import { DocsPageHeader } from "@/components/documentation/DocsPageHeader";

export default function ExamplesPage() {
  return (
    <>
      <DocsPageHeader
        title="Examples"
        summary="Complete walkthroughs for Airport, Hospital, and Warehouse domains."
        readingTime="14 min"
        lastUpdated="July 2026"
        version="1.0"
      />

      <h2 id="overview">Overview</h2>
      <p>
        The best way to understand MatrixOS is to see it orchestrate complex physical systems. Below are three complete examples demonstrating how Adapters, Invariants, and the Recovery Engine work in concert to manage reality.
      </p>

      <h2 id="hospital-emergency-response">Hospital Emergency Response</h2>
      <p>
        <strong>The Scenario:</strong> A Level 1 Trauma Center is operating at near capacity. A multi-vehicle collision occurs on the highway, and 4 critical patients are inbound via ambulance.
      </p>
      <ul>
        <li><strong>Environment Setup:</strong> Load the <code>HospitalAdapter</code>. The graph maps Trauma Bays, CT Scanners, Surgeons, and Nurses.</li>
        <li><strong>Event Injection:</strong> Dispatch transmits the ETA and acuity of the 4 patients.</li>
        <li><strong>Planner Execution:</strong> The Planner synthesizes a graph to clear Trauma Bays 1 and 2, preemptively route the CT technician to standby, and page the on-call surgical team.</li>
        <li><strong>Recovery:</strong> Five minutes later, the CT Scanner goes offline (hardware fault). The Recovery Engine detects the invariant violation (<code>Critical patient must receive imaging</code>), halts the current graph, and reroutes patients to the secondary portable X-Ray units while prioritizing the most unstable patient for immediate surgery without imaging.</li>
      </ul>

      <h2 id="airport-ground-operations">Airport Ground Operations</h2>
      <p>
        <strong>The Scenario:</strong> Turning around an A380 in under 90 minutes.
      </p>
      <ul>
        <li><strong>Environment Setup:</strong> Load the <code>AirportAdapter</code>. Entities include the Aircraft, Gate, Fuel Truck, Catering, and Baggage Carts.</li>
        <li><strong>Invariants:</strong> <code>Fueling and Catering cannot occur simultaneously on the starboard side.</code></li>
        <li><strong>Planner Execution:</strong> The Planner creates a perfectly timed DAG optimizing parallel operations where safe.</li>
        <li><strong>Recovery:</strong> A baggage cart breaks down behind the plane. The Recovery Engine detects a spatial blockage. It reroutes the catering truck to the port side (if compatible) and dispatches a tug to clear the broken cart, minimizing the overall delay to 4 minutes instead of 20.</li>
      </ul>

      <h2 id="warehouse-automation">Warehouse Automation</h2>
      <p>
        <strong>The Scenario:</strong> Orchestrating a swarm of 50 autonomous robots fulfilling orders.
      </p>
      <ul>
        <li><strong>Environment Setup:</strong> Load the <code>WarehouseAdapter</code>. The map consists of grid coordinates, charging stations, and packing stations.</li>
        <li><strong>Event Injection:</strong> An urgent priority order is placed for overnight shipping.</li>
        <li><strong>Recovery:</strong> Bot 12 (carrying the priority order) experiences a sudden battery drain and drops below the 5% invariant threshold. The Recovery Engine commands Bot 12 to safely park at the nearest edge, dispatches Bot 14 to retrieve the payload, and sends Bot 12 to a charging station, ensuring the SLA is met.</li>
      </ul>

      <div className="mt-16 pt-8 border-t border-white/10">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4">Related</h3>
        <div className="flex flex-col gap-3">
          <Link href="/documentation/adapters" className="text-primary hover:text-primary/80 flex items-center gap-2">
            → Adapters
          </Link>
          <Link href="/documentation/planner-agent" className="text-primary hover:text-primary/80 flex items-center gap-2">
            → Planner Agent
          </Link>
        </div>
      </div>
    </>
  );
}
