import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useGuardianCore } from "./GuardianCore";
import { TriangleAlert, CheckCircle2, ShieldAlert } from "lucide-react";
import { DecisionEngine } from "../agents/DecisionEngine";
import { EmergencyVoice } from "./EmergencyVoice";

export const EmergencyVerifier = () => {
  const { state, countdown, setCountdown, setState, resetGuardian } = useGuardianCore();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state === "checking") {
      timer = setInterval(() => {
        setCountdown(useGuardianCore.getState().countdown - 1);
        if (useGuardianCore.getState().countdown <= 0) {
          clearInterval(timer);
          triggerEmergency();
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [state]);

  const triggerEmergency = () => {
    setState("emergency");
    EmergencyVoice.speak("No response received. Initiating RoadGuardian autonomous rescue.");
    
    // Dispatch a global event so the App can create a real incident
    window.dispatchEvent(new CustomEvent('guardian_trigger_sos'));

    DecisionEngine.runSOSScenario();
    setTimeout(() => {
      setState("responding");
    }, 2000);
  };

  const handleSafe = () => {
    resetGuardian();
    EmergencyVoice.speak("Safety confirmed. Monitoring resumed.");
  };

  return (
    <AnimatePresence>
      {state === "checking" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
             <motion.div 
               animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-red-600/30 rounded-full blur-[100px]"
             />
          </div>

          <div className="bg-slate-900 border border-red-500/50 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(239,68,68,0.3)] text-center relative overflow-hidden">
            <motion.div
               animate={{ opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 1, repeat: Infinity }}
               className="mx-auto w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6 border border-red-500"
            >
               <TriangleAlert className="w-10 h-10 text-red-500" />
            </motion.div>
            
            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Are you safe?</h2>
            <p className="text-slate-400 text-sm mb-8 font-medium">Strong impact and stillness detected. Autonomous rescue will activate automatically if no response is received.</p>
            
            <div className="relative w-40 h-40 mx-auto mb-8 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="80" cy="80" r="76" fill="transparent" stroke="rgba(239,68,68,0.2)" strokeWidth="8" />
                <motion.circle 
                  cx="80" cy="80" r="76" 
                  fill="transparent" 
                  stroke="#ef4444" 
                  strokeWidth="8" 
                  strokeDasharray="477"
                  animate={{ strokeDashoffset: 477 - (477 * (countdown / 90)) }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </svg>
              <div className="text-5xl font-black text-red-500 tabular-nums">
                {countdown}
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleSafe}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl border border-slate-700 transition-colors uppercase tracking-wider text-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> I'm Safe
              </button>
              <button 
                onClick={triggerEmergency}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-colors uppercase tracking-wider text-sm flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-5 h-5 text-white" /> Need Help
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
