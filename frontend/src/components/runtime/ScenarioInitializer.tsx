"use client";

import { useEffect, useRef } from "react";
import { useRuntimeStore } from "@/lib/store/runtime";

interface Props {
  adapter: string;
}

export function ScenarioInitializer({ adapter }: Props) {
  const {
    loadScenario,
    activeScenarioId,
    setWsConnected,
    setSnapshot,
    applyReplay,
    updateWorldState,
    setMetrics,
    setPhaseState,
    resetLifecycle,
    setCurrentPlan,
    addEvent
  } = useRuntimeStore();

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (adapter) {
      loadScenario(adapter);
    }
  }, [adapter, loadScenario]);

  // Global WebSocket Connection
  useEffect(() => {
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

  return null;
}
