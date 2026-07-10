"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

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
    <div
      className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 group overflow-hidden ${
        isLive
          ? "border-white/10 bg-card/50 hover:bg-card hover:border-primary/50 shadow-neu-inset hover:shadow-[0_0_30px_rgba(108,99,255,0.15)] cursor-pointer"
          : "border-white/5 bg-background/50 opacity-60 cursor-not-allowed"
      }`}
    >
      {/* Background glow effect on hover */}
      {isLive && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors duration-500" />
      )}

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-primary">
          {icon}
        </div>
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
            isLive
              ? "bg-primary/10 text-primary border border-primary/20"
              : "bg-white/5 text-white/40 border border-white/10"
          }`}
        >
          {status === "live" ? "Live" : "Coming Soon"}
        </span>
      </div>

      <h3 className="text-xl font-bold text-foreground mb-2 relative z-10">
        {name}
      </h3>
      <p className="text-muted-foreground text-sm font-sans mb-6 flex-grow relative z-10">
        {description}
      </p>

      {isLive && (
        <div className="flex items-center text-sm font-semibold text-primary opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all relative z-10">
          Enter Environment <ArrowRight weight="bold" className="ml-2" />
        </div>
      )}
    </div>
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
