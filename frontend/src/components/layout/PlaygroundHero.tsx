import React from "react";

export function PlaygroundHero() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4 py-16">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground font-sans">
        Matrix<span className="text-primary">OS</span>
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground font-sans max-w-2xl">
        A runtime platform for dynamic operational systems.
      </p>
      <div className="flex items-center space-x-2 mt-2">
        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
        <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
          Kernel Active
        </span>
      </div>
    </div>
  );
}
