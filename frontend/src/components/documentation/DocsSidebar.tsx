"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MagnifyingGlass, Command } from "@phosphor-icons/react/dist/ssr";

const NAV_GROUPS = [
  {
    title: "Overview",
    links: [
      { href: "/documentation/getting-started", label: "Getting Started" },
      { href: "/documentation/core-concepts", label: "Core Concepts" },
    ],
  },
  {
    title: "Architecture",
    links: [
      { href: "/documentation/shared-world-model", label: "Shared World Model" },
      { href: "/documentation/runtime", label: "Runtime" },
      { href: "/documentation/adapters", label: "Adapters" },
    ],
  },
  {
    title: "Intelligence",
    links: [
      { href: "/documentation/planner-agent", label: "Planner Agent" },
      { href: "/documentation/recovery-engine", label: "Recovery Engine" },
      { href: "/documentation/invariants", label: "Invariants" },
    ],
  },
  {
    title: "Reference",
    links: [
      { href: "/documentation/api", label: "API Reference" },
      { href: "/documentation/examples", label: "Examples" },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] flex-shrink-0 pt-32 pb-12 pr-6 h-screen sticky top-0 overflow-y-auto custom-scrollbar hidden lg:block border-r border-white/[0.04]">
      {/* Search Input */}
      <div className="relative mb-8 group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlass size={16} className="text-white/40 group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search documentation..."
          className="w-full bg-white/[0.02] border border-white/10 rounded-lg pl-9 pr-14 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-white/30"
        />
        <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
          <div className="flex items-center gap-1 bg-white/5 rounded border border-white/10 px-1.5 py-0.5">
            <Command size={12} className="text-white/40" />
            <span className="text-[10px] font-mono text-white/40 font-medium">K</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-8">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <h4 className="text-xs font-bold text-white/80 uppercase tracking-widest mb-3">
              {group.title}
            </h4>
            <ul className="space-y-1">
              {group.links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block px-3 py-1.5 rounded-md text-sm transition-colors duration-200 ${
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
