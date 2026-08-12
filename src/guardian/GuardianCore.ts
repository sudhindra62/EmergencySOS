import { create } from "zustand";

export type GuardianState = "idle" | "monitoring" | "checking" | "emergency" | "responding";

interface GuardianStore {
  state: GuardianState;
  countdown: number;
  triggerScore: number;
  impactSensitivity: number; // 1.0 is default, higher = more sensitive
  currentActivityLevel: number; // For visual feedback in settings
  setState: (state: GuardianState) => void;
  setCountdown: (countdown: number) => void;
  addTriggerScore: (score: number) => void;
  setImpactSensitivity: (sensitivity: number) => void;
  setCurrentActivityLevel: (level: number) => void;
  resetGuardian: () => void;
  requestWakeLock: () => Promise<void>;
  wakeLock: any;
}

export const useGuardianCore = create<GuardianStore>((set, get) => ({
  state: "idle",
  countdown: 90,
  triggerScore: 0,
  impactSensitivity: 1.0,
  currentActivityLevel: 0,
  wakeLock: null,
  setState: (state) => set({ state }),
  setCountdown: (countdown) => set({ countdown }),
  addTriggerScore: (score) => set((s) => ({ triggerScore: s.triggerScore + score })),
  setImpactSensitivity: (impactSensitivity) => set({ impactSensitivity }),
  setCurrentActivityLevel: (currentActivityLevel) => set({ currentActivityLevel }),
  resetGuardian: () => set({ state: "idle", countdown: 90, triggerScore: 0 }),
  requestWakeLock: async () => {
     try {
       if ('wakeLock' in navigator && !get().wakeLock) {
         const wakeLock = await (navigator as any).wakeLock.request('screen');
         set({ wakeLock });
       }
     } catch (err) {
       console.warn("Wake Lock error:", err);
     }
  }
}));
