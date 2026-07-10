"use client";

import React from "react";
import { motion } from "framer-motion";

const stats = [
  { value: "3", label: "Live Environments" },
  { value: "<100ms", label: "Recovery Latency" },
  { value: "100%", label: "Constraint Coverage" },
  { value: "Zero", label: "Downtime Deployments" },
];

export function LogoStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full border-y border-white/[0.06] py-10 bg-white/[0.02] backdrop-blur-sm"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-white/10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center px-6"
            >
              <span className="text-3xl md:text-4xl font-bold tracking-tight text-white font-sans mb-1">
                {stat.value}
              </span>
              <span className="text-sm text-white/40 font-sans uppercase tracking-widest">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
