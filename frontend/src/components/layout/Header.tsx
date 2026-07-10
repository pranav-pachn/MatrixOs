import React from "react";
import Link from "next/link";
import { MatrixLogo } from "@/components/ui/MatrixLogo";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface HeaderProps {
  adapterName: string;
  status: "LIVE" | "SIMULATION" | "OFFLINE";
}

export function Header({ adapterName, status }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="flex items-center space-x-6">
        <MatrixLogo className="scale-75 origin-left" />
        <div className="h-6 w-px bg-border" />
        <div className="flex items-center space-x-2">
          <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
            Adapter:
          </span>
          <span className="px-2 py-0.5 rounded-md bg-muted text-sm font-sans font-medium text-foreground">
            {adapterName}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <StatusBadge status={status === "LIVE" ? "stable" : "preview"} label="Active Environment" />
      </div>
    </header>
  );
}
