"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import {
  Factory,
  FirstAid,
  Package,
  Database,
  Cpu,
  Broadcast,
  Car,
  Lightning,
  Buildings,
  Gear,
  WifiHigh,
  Leaf,
} from "@phosphor-icons/react/dist/ssr";

const ICON_OPTIONS = [
  { key: "Factory", label: "Factory", icon: <Factory size={24} weight="duotone" /> },
  { key: "FirstAid", label: "Medical", icon: <FirstAid size={24} weight="duotone" /> },
  { key: "Package", label: "Logistics", icon: <Package size={24} weight="duotone" /> },
  { key: "Database", label: "Data", icon: <Database size={24} weight="duotone" /> },
  { key: "Cpu", label: "Computing", icon: <Cpu size={24} weight="duotone" /> },
  { key: "Broadcast", label: "Network", icon: <Broadcast size={24} weight="duotone" /> },
  { key: "Car", label: "Transport", icon: <Car size={24} weight="duotone" /> },
  { key: "Lightning", label: "Energy", icon: <Lightning size={24} weight="duotone" /> },
  { key: "Buildings", label: "Urban", icon: <Buildings size={24} weight="duotone" /> },
  { key: "Gear", label: "Operations", icon: <Gear size={24} weight="duotone" /> },
  { key: "WifiHigh", label: "IoT", icon: <WifiHigh size={24} weight="duotone" /> },
  { key: "Leaf", label: "Sustainability", icon: <Leaf size={24} weight="duotone" /> },
];

export interface NewEnvironment {
  name: string;
  description: string;
  iconKey: string;
  status: "live" | "coming-soon";
}

interface AddEnvironmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (env: NewEnvironment) => void;
}

export function AddEnvironmentModal({ isOpen, onClose, onAdd }: AddEnvironmentModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Factory");
  const [status, setStatus] = useState<"live" | "coming-soon">("live");
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  const validate = () => {
    const newErrors: { name?: string; description?: string } = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onAdd({ name: name.trim(), description: description.trim(), iconKey: selectedIcon, status });
    handleClose();
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setSelectedIcon("Factory");
    setStatus("live");
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg bg-[#0A0A0C] border border-white/10 rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
                <div>
                  <h2 className="text-lg font-bold text-white font-sans">New Environment</h2>
                  <p className="text-xs text-white/40 mt-0.5 font-sans">Configure your operational adapter</p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2 font-sans">
                    Environment Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. City Transit Grid"
                    className={`w-full bg-white/[0.04] border rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans ${
                      errors.name ? "border-red-500/50" : "border-white/10 focus:border-primary/40"
                    }`}
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2 font-sans">
                    Description
                    <span className="ml-2 normal-case tracking-normal font-normal text-white/20">
                      ({description.length}/100)
                    </span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value.slice(0, 100))}
                    placeholder="Brief description of what this environment manages..."
                    rows={2}
                    className={`w-full bg-white/[0.04] border rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans resize-none ${
                      errors.description ? "border-red-500/50" : "border-white/10 focus:border-primary/40"
                    }`}
                  />
                  {errors.description && <p className="text-red-400 text-xs mt-1.5">{errors.description}</p>}
                </div>

                {/* Icon Picker */}
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2 font-sans">
                    Icon
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {ICON_OPTIONS.map(({ key, label, icon }) => (
                      <button
                        key={key}
                        type="button"
                        title={label}
                        onClick={() => setSelectedIcon(key)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all duration-150 ${
                          selectedIcon === key
                            ? "border-primary bg-primary/15 text-primary"
                            : "border-white/10 bg-white/[0.03] text-white/40 hover:border-white/20 hover:text-white/70"
                        }`}
                      >
                        {icon}
                        {selectedIcon === key && (
                          <CheckCircle size={10} weight="fill" className="mt-1 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Toggle */}
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2 font-sans">
                    Status
                  </label>
                  <div className="flex gap-3">
                    {(["live", "coming-soon"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatus(s)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all font-sans ${
                          status === s
                            ? s === "live"
                              ? "bg-primary/15 border-primary/40 text-primary"
                              : "bg-white/10 border-white/20 text-white"
                            : "bg-transparent border-white/10 text-white/30 hover:text-white/50"
                        }`}
                      >
                        {s === "live" ? "🟢 Live" : "⏳ Coming Soon"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-white/50 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors font-sans"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl text-sm font-semibold bg-white text-black hover:bg-white/90 transition-colors font-sans"
                  >
                    Add Environment
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
