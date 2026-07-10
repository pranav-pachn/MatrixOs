import React from "react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { DocsSidebar } from "@/components/documentation/DocsSidebar";
import { TableOfContents } from "@/components/documentation/TableOfContents";

export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] selection:bg-primary/30 font-sans">
      <LandingHeader />
      
      <div className="max-w-[1400px] mx-auto px-6 flex justify-between">
        
        {/* Left Sidebar */}
        <DocsSidebar />

        {/* Center Content (Article) */}
        <main className="flex-1 w-full max-w-[820px] mx-auto px-4 lg:px-12 py-32 docs-content pb-40">
          <article>
            {children}
          </article>
        </main>

        {/* Right Sidebar */}
        <TableOfContents />

      </div>
    </div>
  );
}
