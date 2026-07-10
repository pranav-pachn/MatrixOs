"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Factory,
  FirstAid,
  Package,
  Database,
  Cpu,
  Broadcast,
  Car,
  Lightning,
  Buildings,
  Gear,
  WifiHigh,
  Leaf,
  AirplaneTilt,
  X,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { AddEnvironmentCard } from "./AddEnvironmentCard";
import { AddEnvironmentModal, type NewEnvironment } from "./AddEnvironmentModal";

// Icon renderer — maps key string → JSX
const ICON_MAP: Record<string, React.ReactNode> = {
  Factory: <Factory size={32} weight="duotone" />,
  FirstAid: <FirstAid size={32} weight="duotone" />,
  Package: <Package size={32} weight="duotone" />,
  Database: <Database size={32} weight="duotone" />,
  Cpu: <Cpu size={32} weight="duotone" />,
  Broadcast: <Broadcast size={32} weight="duotone" />,
  Car: <Car size={32} weight="duotone" />,
  Lightning: <Lightning size={32} weight="duotone" />,
  Buildings: <Buildings size={32} weight="duotone" />,
  Gear: <Gear size={32} weight="duotone" />,
  WifiHigh: <WifiHigh size={32} weight="duotone" />,
  Leaf: <Leaf size={32} weight="duotone" />,
  AirplaneTilt: <AirplaneTilt size={32} weight="duotone" />,
};

interface Environment {
  id: string;
  name: string;
  description: string;
  iconKey: string;
  status: "live" | "coming-soon";
  href: string;
  isDefault: boolean;
}

const DEFAULT_ENVIRONMENTS: Environment[] = [
  {
    id: "airport-hub",
    name: "Airport Hub",
    description: "Aviation turnaround constraint validation.",
    iconKey: "AirplaneTilt",
    status: "live",
    href: "/playground/airport",
    isDefault: true,
  },
  {
    id: "hospital-er",
    name: "Hospital ER",
    description: "Trauma bay and imaging resource routing.",
    iconKey: "FirstAid",
    status: "live",
    href: "/playground/hospital-er",
    isDefault: true,
  },
  {
    id: "warehouse-hub",
    name: "Warehouse Hub",
    description: "Autonomous bot swarm pathfinding.",
    iconKey: "Package",
    status: "live",
    href: "/playground/warehouse-hub",
    isDefault: true,
  },
];

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

// Individual environment card rendered inside the grid
function EnvironmentCard({ env, onDelete }: { env: Environment; onDelete?: () => void }) {
  const isLive = env.status === "live";
  const icon = ICON_MAP[env.iconKey];

  const cardContent = (
    <div
      className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 group overflow-hidden h-full ${
        isLive
          ? "border-white/10 bg-card/50 hover:bg-card hover:border-primary/50 shadow-neu-inset hover:shadow-[0_0_30px_rgba(108,99,255,0.15)] cursor-pointer"
          : "border-white/5 bg-background/50 opacity-60 cursor-not-allowed"
      }`}
    >
      {/* Glow */}
      {isLive && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors duration-500" />
      )}

      {/* Delete button (custom envs only) */}
      {onDelete && (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
          className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 text-white/30 hover:text-white/70 transition-all z-20"
          title="Remove environment"
        >
          <X size={14} weight="bold" />
        </button>
      )}

      <div className="flex items-center mb-4 relative z-10">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-primary">
          {icon}
        </div>
      </div>

      <h3 className="text-xl font-bold text-foreground mb-2 relative z-10">{env.name}</h3>
      <p className="text-muted-foreground text-sm font-sans mb-6 flex-grow relative z-10">{env.description}</p>

      {isLive && (
        <div className="flex items-center text-sm font-semibold text-primary opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all relative z-10">
          Enter Environment <ArrowRight weight="bold" className="ml-2" />
        </div>
      )}
    </div>
  );

  if (!isLive) return <div className="h-full">{cardContent}</div>;

  return (
    <Link href={env.href} className="block outline-none focus:ring-2 focus:ring-primary rounded-2xl h-full">
      {cardContent}
    </Link>
  );
}

export function EnvironmentGrid() {
  const [environments, setEnvironments] = useState<Environment[]>(DEFAULT_ENVIRONMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdd = (newEnv: NewEnvironment) => {
    const slug = slugify(newEnv.name);
    const env: Environment = {
      id: slug + "-" + Date.now(),
      name: newEnv.name,
      description: newEnv.description,
      iconKey: newEnv.iconKey,
      status: newEnv.status,
      href: `/playground/${slug}`,
      isDefault: false,
    };
    setEnvironments((prev) => [...prev, env]);
  };

  const handleDelete = (id: string) => {
    setEnvironments((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <>
      {/* Environment cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <AnimatePresence mode="popLayout">
          {environments.map((env, i) => (
            <motion.div
              key={env.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.5, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <EnvironmentCard
                env={env}
                onDelete={env.isDefault ? undefined : () => handleDelete(env.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add card — always at the end, staggered after environments */}
        <motion.div 
          layout 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: environments.length * 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <AddEnvironmentCard onClick={() => setIsModalOpen(true)} />
        </motion.div>
      </div>

      {/* Docs section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="mt-16 border-t border-white/[0.06] pt-10"
      >
        <p className="text-xs font-mono uppercase tracking-widest text-white/20 mb-6">How it works</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Select",
              body: "Select an existing environment to view its runtime graph.",
            },
            {
              step: "02",
              title: "Create",
              body: "Click “Add Environment” to configure a new adapter.",
            },
            {
              step: "03",
              title: "Execute",
              body: "Save and enter the environment to begin execution.",
            },
          ].map(({ step, title, body }) => (
            <div key={step} className="flex gap-4">
              <span className="text-xs font-mono text-white/15 mt-0.5 shrink-0 w-6">{step}</span>
              <div>
                <h4 className="text-sm font-semibold text-white/60 mb-1.5 font-sans">{title}</h4>
                <p className="text-sm text-white/25 font-sans leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <AddEnvironmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAdd}
      />
    </>
  );
}
