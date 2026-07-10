"use client";

import React, { useState, useEffect, useRef } from "react";
import { EventRow } from "./EventRow";
import { useRuntimeStore } from "@/lib/store/runtime";

export function EventStream() {
  const [isClient, setIsClient] = useState(false);
  const {
    runtimeEvents: events,
    addEvent,
    activeScenarioId,
    wsConnected,
    setWsConnected,
    setSnapshot,
    applyReplay,
    updateWorldState,
    setMetrics,
    setPhaseState,
    resetLifecycle,
    setCurrentPlan
  } = useRuntimeStore();

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);
    
    if (!activeScenarioId) return;

    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    let isMounted = true;

    const connect = () => {
      if (!isMounted) return;
      if (wsRef.current?.readyState === WebSocket.OPEN) return;
      
      const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL ?? 'ws://127.0.0.1:8000'}/ws/runtime/${activeScenarioId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!isMounted) { ws.close(); return; }
        setWsConnected(true);
        reconnectAttempts = 0;
      };

      ws.onclose = () => {
        setWsConnected(false);
        if (isMounted && reconnectAttempts < maxReconnectAttempts) {
          const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000);
          reconnectTimeoutRef.current = setTimeout(connect, timeout);
          reconnectAttempts++;
        }
      };

      ws.onmessage = (event) => {
        if (!isMounted) return;
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case "runtime.snapshot":
              setSnapshot(data.payload);
              break;
              
            case "runtime.replay":
              applyReplay(data.payload.events);
              break;
              
            case "runtime.ready":
              // We could show a toast or transition state if needed
              break;
              
            case "runtime.divergence.detected":
              resetLifecycle();
              addEvent(data);
              break;
              
            case "runtime.phase.started":
            case "runtime.phase.completed":
            case "runtime.phase.failed":
              let status = "running";
              if (data.type === "runtime.phase.completed") status = "success";
              if (data.type === "runtime.phase.failed") status = "failed";
              
              setPhaseState(data.phase, {
                status: status as any,
                message: data.payload.message,
                duration: data.payload.duration
              });
              addEvent(data);
              break;
              
            case "runtime.state.updated":
              updateWorldState(data.payload);
              break;
              
            case "runtime.metrics.updated":
              setMetrics(data.payload);
              break;
              
            case "runtime.plan.updated":
              setCurrentPlan(data.payload);
              break;
          }
        } catch (e) {
          console.error("Failed to parse WS message", e);
        }
      };
    };

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.close();
        }
        wsRef.current = null;
      }
    };
  }, [
    activeScenarioId, addEvent, setWsConnected, setSnapshot, applyReplay,
    updateWorldState, setMetrics, setPhaseState, resetLifecycle, setCurrentPlan
  ]);


  if (!isClient) return null;

  return (
    <div className="flex flex-col h-full bg-card/20 backdrop-blur-2xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden relative">
      
      {/* Sleek Header */}
      <div className="bg-card/40 border-b border-border/30 px-6 py-4 flex items-center justify-between z-10 backdrop-blur-md">
        <div>
          <h2 className="text-base font-bold font-sans tracking-tight text-foreground flex items-center gap-2">
            Live Telemetry Stream
          </h2>
          <p className="text-[11px] text-muted-foreground font-sans mt-0.5">Real-time system events and agent actions</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-background/50 px-3 py-1.5 rounded-full border border-border/50 shadow-neu-inset">
          <span className="relative flex h-2 w-2">
            {wsConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-4 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${wsConnected ? 'bg-chart-4' : 'bg-muted-foreground'}`}></span>
          </span>
          <span className="text-[10px] font-mono text-foreground uppercase tracking-widest">
            {wsConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Fade Top/Bottom gradients for smooth scrolling effect */}
      <div className="absolute top-[73px] left-0 right-0 h-8 bg-gradient-to-b from-card/20 to-transparent pointer-events-none z-10" />

      {/* Stream Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col-reverse p-2">
        {events.map((evt: any) => (
          <EventRow key={evt.id} {...evt} />
        ))}
        {events.length === 0 && (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground font-mono">
            Waiting for telemetry...
          </div>
        )}
      </div>
    </div>
  );
}
