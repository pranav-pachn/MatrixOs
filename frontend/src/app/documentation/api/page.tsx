import React from "react";
import Link from "next/link";
import { DocsPageHeader } from "@/components/documentation/DocsPageHeader";

export default function ApiReferencePage() {
  return (
    <>
      <DocsPageHeader
        title="API Reference"
        summary="Programmatic access to the MatrixOS event bus, state graph, and runtime controls."
        readingTime="15 min"
        lastUpdated="July 2026"
        version="1.0"
      />

      <h2 id="overview">Overview</h2>
      <p>
        The MatrixOS API allows external systems (sensors, ERPs, manual user interfaces) to push state mutations into the Shared World Model and query the current Operational Graph. The API is available over REST and GraphQL, with WebSockets for real-time telemetry.
      </p>

      <h2 id="authentication">Authentication</h2>
      <p>
        All API requests must be authenticated using a Bearer token. You can generate an API key from your Environment Settings page.
      </p>
      <pre><code>{`Authorization: Bearer mtrx_live_xxxxxxxxxxxx`}</code></pre>

      <h2 id="endpoints">Endpoints</h2>
      
      <h3 id="ingest-event">POST /v1/events/ingest</h3>
      <p>
        Injects a new physical or logical event into the World Model. This is the primary method for sensors to update reality.
      </p>
      <pre><code>{`// Request
POST https://api.matrixos.dev/v1/events/ingest
{
  "entity_id": "bot_102",
  "type": "location_update",
  "payload": {
    "x": 105.2,
    "y": 42.1
  }
}

// Response (202 Accepted)
{
  "status": "queued",
  "event_id": "evt_09f3j2"
}`}</code></pre>

      <h3 id="query-graph">GET /v1/graph/active</h3>
      <p>
        Retrieves the currently executing Operational Graph, including all pending, active, and completed task nodes.
      </p>
      <pre><code>{`// Response (200 OK)
{
  "graph_id": "gph_882jfa",
  "status": "executing",
  "nodes": [...],
  "edges": [...]
}`}</code></pre>

      <h2 id="rate-limits">Rate Limits</h2>
      <p>
        To protect the Runtime execution loop, the Event Ingestion API is rate-limited to <strong>10,000 requests per second</strong> per environment on the Enterprise tier. If you exceed this limit, the API will return a <code>429 Too Many Requests</code> response. For higher throughput, consider using the gRPC stream.
      </p>

      <div className="bg-[#0B0B0B] border border-white/[0.08] p-6 rounded-xl my-8">
        <h4 className="text-white font-semibold flex items-center gap-2 mb-2">
          <span className="text-blue-500">ℹ</span> Event Ordering
        </h4>
        <p className="text-[#A1A1AA] m-0">
          MatrixOS guarantees strict ordering of events based on the ingestion timestamp. Ensure your client clocks are synced via NTP to prevent out-of-order state mutations.
        </p>
      </div>

      <div className="mt-16 pt-8 border-t border-white/10">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4">Related</h3>
        <div className="flex flex-col gap-3">
          <Link href="/documentation/shared-world-model" className="text-primary hover:text-primary/80 flex items-center gap-2">
            → Shared World Model
          </Link>
          <Link href="/documentation/runtime" className="text-primary hover:text-primary/80 flex items-center gap-2">
            → Runtime Execution Loop
          </Link>
        </div>
      </div>
    </>
  );
}
