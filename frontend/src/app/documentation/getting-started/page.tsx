import React from "react";
import Link from "next/link";
import { DocsPageHeader } from "@/components/documentation/DocsPageHeader";

export default function GettingStartedPage() {
  return (
    <>
      <DocsPageHeader
        title="Getting Started"
        summary="A comprehensive guide to understanding and deploying your first MatrixOS operational environment."
        readingTime="7 min"
        lastUpdated="July 2026"
        version="1.0"
      />

      <h2 id="what-is-matrixos">What is MatrixOS?</h2>
      <p>
        MatrixOS is an operating system designed for physical and operational reality. Unlike traditional software that executes linear, rigid scripts (which break the moment reality diverges from the plan), MatrixOS uses a continuously synchronized <strong>Shared World Model</strong>. It observes real-world state changes, compares them against your operational constraints (Invariants), and autonomously deploys LLM-driven Planner and Recovery agents when things go wrong.
      </p>
      
      <h2 id="who-is-it-for">Who is it for?</h2>
      <p>
        MatrixOS is built for engineers and operators managing complex, constraint-heavy physical environments where failures cascade quickly. This includes:
      </p>
      <ul>
        <li><strong>Aviation:</strong> Managing airport turnaround times and tarmac congestion.</li>
        <li><strong>Healthcare:</strong> Routing trauma resources and prioritizing ICU beds.</li>
        <li><strong>Logistics:</strong> Orchestrating autonomous warehouse bot swarms.</li>
        <li><strong>Manufacturing:</strong> Dynamic assembly line load balancing.</li>
      </ul>

      <h2 id="core-philosophy">Core Philosophy</h2>
      <p>
        Traditional systems are built on <em>control flow</em>. MatrixOS is built on <em>constraint enforcement</em>. 
      </p>
      <div className="bg-[#0B0B0B] border border-white/[0.08] p-6 rounded-xl my-8">
        <h4 className="text-white font-semibold flex items-center gap-2 mb-2">
          <span className="text-primary">💡</span> The MatrixOS Paradigm
        </h4>
        <p className="text-[#A1A1AA] m-0">
          You don't write rules for every possible failure. Instead, you declare the physical truths of your environment, and let the reasoning engine find the recovery path.
        </p>
      </div>

      <h2 id="installation">Installation</h2>
      <p>
        MatrixOS runs as a distributed cluster, but you can run the unified playground locally for development and simulation.
      </p>
      <pre><code>{`# Install the MatrixOS CLI
npm install -g @matrixos/cli

# Initialize a new workspace
matrix init my-operational-hub
cd my-operational-hub

# Start the local runtime
matrix dev`}</code></pre>

      <h2 id="first-environment">First Environment</h2>
      <p>
        Once your local runtime is running, navigate to the <Link href="/hub">Hub</Link> and click <strong>Add Environment</strong>. An environment is an isolated sandbox or production namespace where your graph lives. Select a pre-built adapter (like <strong>Airport</strong> or <strong>Hospital</strong>) to instantly load a domain-specific vocabulary.
      </p>

      <h2 id="first-runtime">First Runtime</h2>
      <p>
        After provisioning your environment, you will enter the Runtime. The Runtime executes an infinite loop:
      </p>
      <ol>
        <li>Ingest events from the World State API.</li>
        <li>Evaluate the Operational Graph against your Invariants.</li>
        <li>If an Invariant is violated, halt execution and invoke the Recovery Engine.</li>
      </ol>

      <h2 id="quick-start">Quick Start Walkthrough</h2>
      <p>
        To see MatrixOS in action:
      </p>
      <ol>
        <li>Navigate to the <strong>Warehouse Hub</strong> in your local playground.</li>
        <li>Observe the live <strong>World State</strong> graph plotting bot coordinates.</li>
        <li>Click <strong>Inject Collision Event</strong> in the dev tools.</li>
        <li>Watch the Runtime instantly detect the spatial invariant violation.</li>
        <li>Observe the <strong>Recovery Engine</strong> autonomously plot a new routing path.</li>
      </ol>

      <div className="mt-16 pt-8 border-t border-white/10">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4">Related</h3>
        <div className="flex flex-col gap-3">
          <Link href="/documentation/core-concepts" className="text-primary hover:text-primary/80 flex items-center gap-2">
            → Core Concepts
          </Link>
          <Link href="/documentation/adapters" className="text-primary hover:text-primary/80 flex items-center gap-2">
            → Adapters
          </Link>
        </div>
      </div>
    </>
  );
}
