import React from "react";
import Link from "next/link";

interface HeaderProps {
  adapterName: string;
  status: "LIVE" | "SIMULATION" | "OFFLINE";
}

export function Header({ adapterName, status }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="flex items-center space-x-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight text-foreground font-sans">
            Matrix<span className="text-primary">OS</span>
          </span>
        </Link>
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
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full border border-border/50 bg-card/30">
          <span className="relative flex h-2 w-2">
            {status === "LIVE" && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chart-4 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${status === "LIVE" ? "bg-chart-4" : "bg-muted-foreground"
                }`}
            ></span>
          </span>
          <span className="text-xs font-mono uppercase tracking-widest text-foreground">
            {status}
          </span>
        </div>
      </div>
    </header>
  );
}
