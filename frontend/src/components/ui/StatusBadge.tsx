import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type StatusBadgeType = 
  | "preview"
  | "online"
  | "runtime"
  | "docs"
  | "beta"
  | "experimental"
  | "stable";

interface StatusBadgeProps {
  status: StatusBadgeType;
  label: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  // Determine dot color based on status
  const getDotColor = () => {
    switch (status) {
      case "preview":
      case "docs":
        return "bg-[#6D5DF6]"; // MatrixOS Purple
      case "online":
      case "stable":
        return "bg-[#00D084]"; // Green
      case "runtime":
        return "bg-[#29B6F6]"; // Blue
      case "beta":
        return "bg-[#F5A623]"; // Orange
      case "experimental":
        return "bg-[#FF4D4D]"; // Red
      default:
        return "bg-[#6D5DF6]";
    }
  };

  // Determine dot glow based on status
  const getDotGlow = () => {
    switch (status) {
      case "preview":
      case "docs":
        return "group-hover:shadow-[0_0_8px_rgba(109,93,246,0.5)]";
      case "online":
      case "stable":
        return "group-hover:shadow-[0_0_8px_rgba(0,208,132,0.5)]";
      case "runtime":
        return "group-hover:shadow-[0_0_8px_rgba(41,182,246,0.5)]";
      case "beta":
        return "group-hover:shadow-[0_0_8px_rgba(245,166,35,0.5)]";
      case "experimental":
        return "group-hover:shadow-[0_0_8px_rgba(255,77,77,0.5)]";
      default:
        return "group-hover:shadow-[0_0_8px_rgba(109,93,246,0.5)]";
    }
  };

  return (
    <div
      className={cn(
        "group inline-flex items-center justify-center h-8 px-4",
        "bg-[#0F0F12] border border-white/[0.08] rounded-full",
        "shadow-sm transition-colors duration-200",
        "hover:bg-[#16161A] hover:border-white/[0.15]",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span 
          className={cn(
            "w-1.5 h-1.5 rounded-full animate-pulse transition-shadow duration-200",
            getDotColor(),
            getDotGlow()
          )} 
        />
        <span className="text-[11px] font-mono font-medium tracking-[0.18em] text-white/75 uppercase pt-[1px]">
          {label}
        </span>
      </div>
    </div>
  );
}
