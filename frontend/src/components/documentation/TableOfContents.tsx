"use client";

import React, { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // We assume the article content is wrapped in an element with class "docs-content"
    const content = document.querySelector(".docs-content");
    if (!content) return;

    const elements = Array.from(content.querySelectorAll("h2, h3"));
    
    // Auto-generate IDs and build TOC list
    const headingData = elements.map((el) => {
      const text = el.textContent || "";
      let id = el.id;
      if (!id) {
        id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        el.id = id;
      }
      return {
        id,
        text,
        level: el.tagName === "H3" ? 3 : 2,
      };
    });

    setHeadings(headingData);

    // Setup Intersection Observer to track active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -66% 0px" } // Trigger when heading passes top 100px
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <aside className="w-[240px] flex-shrink-0 pt-32 pb-12 pl-6 h-screen sticky top-0 overflow-y-auto custom-scrollbar hidden xl:block border-l border-white/[0.04]">
      <h4 className="text-xs font-bold text-white/80 uppercase tracking-widest mb-4">
        Table of Contents
      </h4>
      <ul className="space-y-3">
        {headings.map((h) => (
          <li
            key={h.id}
            style={{ paddingLeft: h.level === 3 ? "1rem" : "0" }}
          >
            <a
              href={`#${h.id}`}
              className={`block text-[13px] leading-snug transition-colors duration-200 hover:text-white ${
                activeId === h.id ? "text-primary font-medium" : "text-white/40"
              }`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                setActiveId(h.id);
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
