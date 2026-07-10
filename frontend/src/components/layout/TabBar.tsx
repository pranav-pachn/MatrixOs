"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TabBar({ adapter }: { adapter: string }) {
  const pathname = usePathname();
  
  const tabs = [
    { name: "Dashboard", href: `/playground/${adapter}` },
    { name: "Events & Triggers", href: `/playground/${adapter}/events` },
    { name: "Memory", href: `/playground/${adapter}/memory` },
    { name: "Recovery Pipeline", href: `/playground/${adapter}/recovery` },
  ];

  return (
    <div className="flex items-center space-x-1 px-6 border-b border-border bg-card/20 backdrop-blur-md">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`px-4 py-3 text-sm font-medium font-sans border-b-2 transition-colors ${
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
