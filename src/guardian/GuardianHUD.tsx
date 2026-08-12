import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useGuardianCore } from "./GuardianCore";
import { Shield, ShieldAlert, ShieldCheck, Activity, BrainCircuit } from "lucide-react";
import { ImpactDetector } from "./ImpactDetector";

export const GuardianHUD = () => {
  const { state } = useGuardianCore();

  const getConfig = () => {
    switch (state) {
      case "idle": return { icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Protected" };
      case "monitoring": return { icon: Activity, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/50", label: "Monitoring" };
      case "checking": return { icon: ShieldAlert, color: "text-red-500", bg: "bg-red-500/20", border: "border-red-500", label: "Verifying" };
      case "emergency": return { icon: BrainCircuit, color: "text-rose-500", bg: "bg-rose-500/20", border: "border-rose-500", label: "AI Waking" };
      case "responding": return { icon: Shield, color: "text-cyan-400", bg: "bg-cyan-500/20", border: "border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]", label: "Agents Active" };
      default: return { icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Protected" };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <motion.div 
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-3 backdrop-blur-md px-4 py-2 rounded-full border ${config.bg} ${config.border} transition-all duration-500 cursor-pointer hover:scale-105`}
      onClick={() => {
        // Dev trigger: Click HUD when idle to simulate crash
        if (state === "idle" || state === "monitoring") {
           ImpactDetector.forceTrigger();
        }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="relative">
        {state === "checking" || state === "emergency" ? (
           <motion.div 
             className={`absolute inset-0 rounded-full ${config.bg} blur-md`}
             animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
             transition={{ duration: 1, repeat: Infinity }}
           />
        ) : null}
        <Icon className={`w-5 h-5 ${config.color} relative z-10`} />
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold leading-none">Guardian</span>
        <AnimatePresence mode="wait">
          <motion.span 
            key={state}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className={`text-xs font-black uppercase tracking-wider ${config.color} leading-tight`}
          >
            {config.label}
          </motion.span>
        </AnimatePresence>
      </div>

      {(state === "idle" || state === "monitoring") && (
        <button
           onClick={(e) => {
             e.stopPropagation();
             ImpactDetector.forceTrigger();
           }}
           className="ml-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors uppercase tracking-wider border border-red-500 shadow-md"
           title="Simulate Crash for Testing"
        >
          Simulate Shake
        </button>
      )}
    </motion.div>
  );
};
