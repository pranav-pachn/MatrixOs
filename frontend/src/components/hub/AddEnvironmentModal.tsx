"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Factory,
  Stethoscope,
  Package,
  Database,
  Cpu,
  Radio,
  Car,
  Zap,
  Building2,
  Settings,
  Wifi,
  Leaf,
  Loader2,
} from "lucide-react";

const ICON_OPTIONS = [
  { key: "Factory", label: "Factory", icon: <Factory size={22} strokeWidth={1.5} /> },
  { key: "FirstAid", label: "Medical", icon: <Stethoscope size={22} strokeWidth={1.5} /> },
  { key: "Package", label: "Logistics", icon: <Package size={22} strokeWidth={1.5} /> },
  { key: "Database", label: "Data", icon: <Database size={22} strokeWidth={1.5} /> },
  { key: "Cpu", label: "Computing", icon: <Cpu size={22} strokeWidth={1.5} /> },
  { key: "Broadcast", label: "Network", icon: <Radio size={22} strokeWidth={1.5} /> },
  { key: "Car", label: "Transport", icon: <Car size={22} strokeWidth={1.5} /> },
  { key: "Lightning", label: "Energy", icon: <Zap size={22} strokeWidth={1.5} /> },
  { key: "Buildings", label: "Urban", icon: <Building2 size={22} strokeWidth={1.5} /> },
  { key: "Gear", label: "Operations", icon: <Settings size={22} strokeWidth={1.5} /> },
  { key: "WifiHigh", label: "IoT", icon: <Wifi size={22} strokeWidth={1.5} /> },
  { key: "Leaf", label: "Eco", icon: <Leaf size={22} strokeWidth={1.5} /> },
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setName("");
      setDescription("");
      setSelectedIcon("Factory");
      setStatus("live");
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors: { name?: string; description?: string } = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    // Simulate network delay for cinematic effect
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    onAdd({ name: name.trim(), description: description.trim(), iconKey: selectedIcon, status });
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
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={!isSubmitting ? onClose : undefined}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <div className="w-full max-w-xl relative overflow-hidden bg-[#050505]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-[0_0_100px_rgba(82,39,255,0.1)]">
              
              {/* Subtle top gradient line */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

              {/* Header */}
              <div className="flex items-center justify-between px-7 py-6 border-b border-white/[0.04]">
                <div>
                  <h2 className="text-xl font-medium tracking-tight text-white font-sans">
                    New Environment
                  </h2>
                  <p className="text-sm text-white/40 mt-1 font-sans">
                    Configure your operational adapter and metadata.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="p-2 -mr-2 rounded-lg text-white/40 hover:bg-white/5 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-7 py-6 space-y-6">
                
                {/* Inputs Group */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-2.5 font-sans">
                      Environment Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="e.g. Traffic Control Grid"
                      className={`w-full bg-black/40 border rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 transition-all font-sans outline-none disabled:opacity-50
                        ${errors.name 
                          ? "border-red-500/40 focus:border-red-500/60 focus:ring-4 focus:ring-red-500/10" 
                          : "border-white/10 hover:border-white/20 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                        }`}
                    />
                    {errors.name && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-2 font-medium">
                        {errors.name}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2.5">
                      <label className="block text-xs font-medium text-white/50 uppercase tracking-widest font-sans">
                        Description
                      </label>
                      <span className="text-xs text-white/20 font-mono">
                        {description.length}/100
                      </span>
                    </div>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value.slice(0, 100))}
                      disabled={isSubmitting}
                      placeholder="Brief description of what this environment manages..."
                      rows={2}
                      className={`w-full bg-black/40 border rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 transition-all font-sans outline-none resize-none disabled:opacity-50
                        ${errors.description 
                          ? "border-red-500/40 focus:border-red-500/60 focus:ring-4 focus:ring-red-500/10" 
                          : "border-white/10 hover:border-white/20 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                        }`}
                    />
                    {errors.description && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-2 font-medium">
                        {errors.description}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Icon Picker */}
                <div>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-3 font-sans">
                    Adapter Icon
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {ICON_OPTIONS.map(({ key, label, icon }) => {
                      const isSelected = selectedIcon === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          title={label}
                          disabled={isSubmitting}
                          onClick={() => setSelectedIcon(key)}
                          className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50
                            ${isSelected
                              ? "border-primary/40 bg-primary/10 text-primary shadow-[0_0_15px_rgba(82,39,255,0.15)]"
                              : "border-white/5 bg-white/[0.02] text-white/40 hover:border-white/15 hover:bg-white/[0.04] hover:text-white/80"
                            }`}
                        >
                          {icon}
                          {isSelected && (
                            <motion.div 
                              layoutId="icon-check"
                              className="absolute -top-1.5 -right-1.5 bg-primary rounded-full p-0.5 border-2 border-[#050505]"
                            >
                              <Check size={10} className="text-white" strokeWidth={3} />
                            </motion.div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Status Toggle */}
                <div>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-3 font-sans">
                    Initial Status
                  </label>
                  <div className="flex gap-3 bg-black/40 p-1.5 rounded-xl border border-white/5">
                    {(["live", "coming-soon"] as const).map((s) => {
                      const isSelected = status === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => setStatus(s)}
                          className={`relative flex-1 py-2.5 rounded-lg text-sm font-medium transition-all font-sans outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 z-10
                            ${isSelected ? "text-white" : "text-white/40 hover:text-white/70"}
                          `}
                        >
                          {isSelected && (
                            <motion.div
                              layoutId="status-bg"
                              className={`absolute inset-0 rounded-lg -z-10 ${
                                s === "live" ? "bg-primary/20 border border-primary/30" : "bg-white/10 border border-white/10"
                              }`}
                            />
                          )}
                          <span className="relative z-20 flex items-center justify-center gap-2">
                            {s === "live" ? (
                              <><span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" /> Live</>
                            ) : (
                              <><span className="w-2 h-2 rounded-full bg-white/20" /> Coming Soon</>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-white/[0.04]">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 rounded-xl text-sm font-medium text-white/50 bg-white/5 hover:bg-white/10 transition-colors font-sans outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative overflow-hidden flex-1 py-3.5 rounded-xl text-sm font-semibold bg-white text-black hover:bg-gray-100 transition-colors font-sans outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-90 flex items-center justify-center gap-2 group"
                  >
                    <AnimatePresence mode="wait">
                      {isSubmitting ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2"
                        >
                          <Loader2 size={16} className="animate-spin opacity-70" />
                          <span>Initializing...</span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="ready"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2"
                        >
                          Create Environment
                          <motion.span
                            className="text-primary group-hover:translate-x-1 transition-transform"
                            initial={false}
                          >
                            →
                          </motion.span>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
