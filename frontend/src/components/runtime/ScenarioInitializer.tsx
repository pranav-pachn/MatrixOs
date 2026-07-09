"use client";

import { useEffect } from "react";
import { useRuntimeStore } from "@/lib/store/runtime";

interface Props {
  adapter: string;
}

export function ScenarioInitializer({ adapter }: Props) {
  const loadScenario = useRuntimeStore((state) => state.loadScenario);

  useEffect(() => {
    if (adapter) {
      loadScenario(adapter);
    }
  }, [adapter, loadScenario]);

  return null; // Silent component, renders nothing
}
