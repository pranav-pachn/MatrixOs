"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { MatrixLogo } from "@/components/ui/MatrixLogo";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function LandingFooter() {
  return (
    <footer className="w-full bg-[#000000] text-white pt-32 pb-8 px-6 relative z-10 border-t border-white/[0.04]">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Section 1: Closing CTA */}
        <div className="flex flex-col items-center text-center mb-32">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Ready to build your operational runtime?
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            Provision an environment and experience autonomous planning, execution, and recovery in a unified runtime.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link
              href="/hub"
              className="group relative overflow-hidden bg-white text-black px-8 py-3.5 rounded-xl text-[15px] font-bold tracking-wide hover:-translate-y-[1px] hover:shadow-[0_4px_20px_rgba(122,60,249,0.35)] transition-all duration-[250ms] ease-out flex items-center gap-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-[250ms]" />
              <span className="relative z-10">Launch MatrixOS</span>
              <ArrowRight weight="bold" size={18} className="relative z-10 group-hover:translate-x-0.5 transition-transform duration-[250ms]" />
            </Link>
            <Link
              href="/documentation/getting-started"
              className="text-white/60 hover:text-white text-[15px] font-medium transition-colors duration-[200ms] relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-[200ms]"
            >
              Read Documentation
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/[0.04] mb-20" />

        {/* Section 2: Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-20 mb-20">
          
          {/* Left: Brand */}
          <div className="md:col-span-1 flex flex-col items-start">
            <div className="group mb-6 inline-block">
              <div className="transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(108,99,255,0.4)]">
                <MatrixLogo className="scale-90 origin-left" />
              </div>
            </div>
            <p className="text-[15px] text-white/50 leading-relaxed font-sans mb-4">
              The operational runtime for real-world systems.
            </p>
            <p className="text-[14px] text-white/30 leading-relaxed font-sans">
              Built for autonomous operational intelligence.
            </p>
          </div>

          {/* Center: Product */}
          <div className="flex flex-col">
            <h4 className="text-white font-semibold mb-6 tracking-wide">Product</h4>
            <ul className="space-y-4">
              {['Runtime', 'Methodology', 'Documentation', 'Roadmap', 'Changelog'].map((item) => (
                <li key={item}>
                  <Link 
                    href={item === 'Documentation' ? '/documentation/getting-started' : item === 'Methodology' ? '/#methodology' : '#'} 
                    className="text-white/50 hover:text-white text-[15px] transition-colors duration-[200ms] relative inline-block after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-[200ms]"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Center Right: Developers */}
          <div className="flex flex-col">
            <h4 className="text-white font-semibold mb-6 tracking-wide">Developers</h4>
            <ul className="space-y-4">
              {['API', 'Examples', 'GitHub', 'Architecture', 'Status'].map((item) => (
                <li key={item}>
                  <Link 
                    href="#" 
                    className="text-white/50 hover:text-white text-[15px] transition-colors duration-[200ms] relative inline-block after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-[200ms]"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Connect */}
          <div className="flex flex-col">
            <h4 className="text-white font-semibold mb-6 tracking-wide">Connect</h4>
            <ul className="space-y-4">
              {['Twitter/X', 'Discord', 'LinkedIn', 'Email'].map((item) => (
                <li key={item}>
                  <Link 
                    href="#" 
                    className="text-white/50 hover:text-white text-[15px] transition-colors duration-[200ms] relative inline-block after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-[200ms]"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Optional Status Indicators */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-6 border-t border-white/[0.04]">
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-white/40 mb-4 md:mb-0">
            <StatusBadge status="online" label="Status: Online" />
            <span>Version 1.0.0</span>
            <span className="hidden sm:inline">•</span>
            <span>Rendered in real time</span>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-white/30 font-sans">
            <span>© 2026 MatrixOS</span>
            <span className="hidden sm:inline">Made for autonomous operational systems.</span>
            <div className="flex items-center gap-6 text-white/40">
              <Link href="#" className="hover:text-white transition-colors duration-[200ms]">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors duration-[200ms]">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors duration-[200ms]">License</Link>
              <Link href="#" className="hover:text-white transition-colors duration-[200ms]">Status</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
