import React from "react";

interface DocsPageHeaderProps {
  title: string;
  summary: string;
  readingTime: string;
  lastUpdated: string;
  version: string;
}

export function DocsPageHeader({
  title,
  summary,
  readingTime,
  lastUpdated,
  version,
}: DocsPageHeaderProps) {
  return (
    <div className="mb-16">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-6">
        {title}
      </h1>
      
      <p className="text-xl text-white/70 leading-relaxed font-sans mb-10">
        {summary}
      </p>
      
      <div className="flex flex-wrap items-center gap-6 text-sm font-mono text-white/40 border-y border-white/[0.04] py-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/80" />
          {readingTime} read
        </div>
        <div className="flex items-center gap-2">
          <span>Updated {lastUpdated}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
            Version {version}
          </span>
        </div>
      </div>
    </div>
  );
}
