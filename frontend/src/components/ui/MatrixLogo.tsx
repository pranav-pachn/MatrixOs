"use client";

import React from "react";
import Link from "next/link";

interface MatrixLogoProps {
  className?: string;
  href?: string;
}

export function MatrixLogo({ className = "", href = "/" }: MatrixLogoProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 font-sans group transition-all duration-200 hover:scale-[1.02] hover:drop-shadow-[0_0_12px_rgba(108,99,255,0.3)] ${className}`}
    >
      {/* Icon */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-[10px] bg-gradient-to-br from-[#7e41ff] to-[#4500d4] overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
        {/* Subtle noise / lines */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_49%,rgba(255,255,255,0.1)_50%,transparent_51%)] bg-[length:100%_4px]"></div>
        
        {/* "M" Icon */}
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          <path
            d="M4 18V8C4 7.5 4.5 7 5 7L11.5 10C11.8 10.1 12.2 10.1 12.5 10L19 7C19.5 7 20 7.5 20 8V18"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 8L12 11.5L20 8"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Text wordmark */}
      <div className="flex items-center text-[22px] tracking-tight pt-1">
        <span className="font-semibold text-[#8e8d99]">matrix</span>
        <span className="font-bold text-[#8a2be2]">OS</span>
      </div>
    </Link>
  );
}
