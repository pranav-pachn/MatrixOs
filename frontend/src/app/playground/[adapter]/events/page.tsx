import React from "react";
import { TriggerEventPanel } from "@/components/runtime/TriggerEventPanel";
import { EventStream } from "@/components/runtime/EventStream";

export default function EventsPage() {
  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-sans tracking-tight text-foreground">Event Stream & Injection</h1>
        <p className="text-sm text-muted-foreground font-sans">Monitor system telemetry and inject scripted chaos to test AI recovery.</p>
      </div>

      {/* Grid Layout: 1/3 Trigger Panel, 2/3 Event Stream */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        <div className="lg:col-span-1 h-full">
          <TriggerEventPanel />
        </div>
        <div className="lg:col-span-2 h-full">
          <EventStream />
        </div>
      </div>
    </div>
  );
}
