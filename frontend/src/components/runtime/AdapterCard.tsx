"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AdapterBadge } from "./AdapterBadge";

interface AdapterCardProps {
  name: string;
  description: string;
  status: "live" | "coming-soon";
  icon: React.ReactNode;
  href: string;
}

export function AdapterCard({ name, description, status, icon, href }: AdapterCardProps) {
  const isLive = status === "live";

  const content = (
    <motion.div
      whileHover={isLive ? { y: -5 } : {}}
      className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 ${
        isLive
          ? "border-border shadow-neu-raised hover:border-primary/50 cursor-pointer"
          : "border-border/50 bg-card/30 opacity-70 cursor-not-allowed"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${isLive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
          {icon}
        </div>
        <AdapterBadge status={status} />
      </div>

      <h3 className="text-2xl font-bold font-sans text-foreground mb-2">
        {name}
      </h3>
      <p className="text-muted-foreground text-sm font-sans flex-grow">
        {description}
      </p>

      <div className="mt-6 flex items-center text-sm font-mono font-medium">
        {isLive ? (
          <span className="text-primary hover:underline">Launch Runtime →</span>
        ) : (
          <span className="text-muted-foreground">Adapter Uninitialized</span>
        )}
      </div>
    </motion.div>
  );

  if (!isLive) {
    return content;
  }

  return (
    <Link href={href} className="block outline-none focus:ring-2 focus:ring-primary rounded-2xl">
      {content}
    </Link>
  );
}
