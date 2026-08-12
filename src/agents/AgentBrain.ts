import { create } from "zustand";

export type AgentState = "idle" | "thinking" | "negotiating" | "busy" | "executing" | "completed" | "failed" | "recovering";

export interface AIEntity {
  id: string;
  name: string;
  role: string;
  state: AgentState;
  color: string;
  confidence: number;
  lastDecision: string;
  priority: number;
  latency: number;
  successRate: number;
}

export interface WireState {
  source: string;
  target: string;
  state: "idle" | "flow" | "thinking" | "negotiation" | "execution" | "failed";
}

interface AgentStore {
  agents: Record<string, AIEntity>;
  wires: WireState[];
  setAgentState: (id: string, state: AgentState) => void;
  updateAgentMemory: (id: string, updates: Partial<AIEntity>) => void;
  setWireState: (source: string, target: string, state: WireState["state"]) => void;
  resetFabric: () => void;
}

export const useAgentBrain = create<AgentStore>((set) => ({
  agents: {
    "coord": { id: "coord", name: "Coordinator", role: "Orchestrator", state: "idle", color: "#a855f7", confidence: 99, lastDecision: "None", priority: 1, latency: 4, successRate: 99.9 },
    "severity": { id: "severity", name: "Severity", role: "Clinician", state: "idle", color: "#f43f5e", confidence: 92, lastDecision: "None", priority: 2, latency: 12, successRate: 94.2 },
    "hospital": { id: "hospital", name: "Hospital", role: "Bed Finder", state: "idle", color: "#3b82f6", confidence: 95, lastDecision: "None", priority: 3, latency: 45, successRate: 88.5 },
    "fleet": { id: "fleet", name: "Fleet", role: "Dispatcher", state: "idle", color: "#f59e0b", confidence: 88, lastDecision: "None", priority: 4, latency: 18, successRate: 91.0 },
    "route": { id: "route", name: "Route", role: "Navigator", state: "idle", color: "#06b6d4", confidence: 98, lastDecision: "None", priority: 5, latency: 8, successRate: 97.4 },
    "police": { id: "police", name: "Police", role: "Enforcer", state: "idle", color: "#10b981", confidence: 100, lastDecision: "None", priority: 6, latency: 2, successRate: 100 },
    "family": { id: "family", name: "Family", role: "Liaison", state: "idle", color: "#ec4899", confidence: 100, lastDecision: "None", priority: 7, latency: 5, successRate: 99.1 },
    "voice": { id: "voice", name: "Voice", role: "Assistant", state: "idle", color: "#eab308", confidence: 85, lastDecision: "None", priority: 8, latency: 20, successRate: 90.0 },
    "analytics": { id: "analytics", name: "Analytics", role: "Historian", state: "idle", color: "#6366f1", confidence: 100, lastDecision: "None", priority: 9, latency: 50, successRate: 100 },
    "offline": { id: "offline", name: "Offline", role: "Cryptographer", state: "idle", color: "#64748b", confidence: 100, lastDecision: "None", priority: 10, latency: 1, successRate: 100 },
    "prediction": { id: "prediction", name: "Prediction", role: "Forecaster", state: "idle", color: "#14b8a6", confidence: 88, lastDecision: "None", priority: 11, latency: 45, successRate: 92.1 },
  },
  wires: [
    { source: "coord", target: "severity", state: "idle" },
    { source: "coord", target: "hospital", state: "idle" },
    { source: "coord", target: "fleet", state: "idle" },
    { source: "coord", target: "police", state: "idle" },
    { source: "coord", target: "family", state: "idle" },
    { source: "hospital", target: "route", state: "idle" },
    { source: "fleet", target: "route", state: "idle" },
    { source: "coord", target: "voice", state: "idle" },
    { source: "route", target: "analytics", state: "idle" },
    { source: "analytics", target: "prediction", state: "idle" },
    { source: "coord", target: "prediction", state: "idle" },
  ],
  setAgentState: (id, state) => set((s) => ({
    agents: { ...s.agents, [id]: { ...s.agents[id], state } }
  })),
  updateAgentMemory: (id, updates) => set((s) => ({
    agents: { ...s.agents, [id]: { ...s.agents[id], ...updates } }
  })),
  setWireState: (source, target, state) => set((s) => ({
    wires: s.wires.map(w => (w.source === source && w.target === target ? { ...w, state } : w))
  })),
  resetFabric: () => set((s) => {
    const newAgents = { ...s.agents };
    Object.keys(newAgents).forEach(k => newAgents[k].state = "idle");
    const newWires = s.wires.map(w => ({ ...w, state: "idle" as const }));
    return { agents: newAgents, wires: newWires };
  })
}));
