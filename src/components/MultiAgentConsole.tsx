/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Shield,
  Brain,
  Hospital,
  Truck,
  Users,
  MapPin,
  Eye,
  Info,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  MessageSquareCode,
  Languages,
  FileText,
  Activity,
} from "lucide-react";
import { Incident } from "../types";

interface MultiAgentConsoleProps {
  activeIncident: Incident | null;
}

const AGENT_COLORS: Record<
  string,
  {
    bg: string;
    border: string;
    text: string;
    shadow: string;
    from: string;
    to: string;
    glow: string;
    tab: string;
    ring: string;
  }
> = {
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    shadow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    from: "from-blue-500/20",
    to: "to-blue-500/0",
    glow: "drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]",
    tab: "bg-blue-500/10 border-blue-500/40 text-blue-100",
    ring: "ring-blue-500/50",
  },
  purple: {
    bg: "bg-fuchsia-500/10",
    border: "border-fuchsia-500/30",
    text: "text-fuchsia-400",
    shadow: "shadow-[0_0_20px_rgba(217,70,239,0.3)]",
    from: "from-fuchsia-500/20",
    to: "to-fuchsia-500/0",
    glow: "drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]",
    tab: "bg-fuchsia-500/10 border-fuchsia-500/40 text-fuchsia-100",
    ring: "ring-fuchsia-500/50",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    shadow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",
    from: "from-emerald-500/20",
    to: "to-emerald-500/0",
    glow: "drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]",
    tab: "bg-emerald-500/10 border-emerald-500/40 text-emerald-100",
    ring: "ring-emerald-500/50",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    shadow: "shadow-[0_0_20px_rgba(6,182,212,0.3)]",
    from: "from-cyan-500/20",
    to: "to-cyan-500/0",
    glow: "drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]",
    tab: "bg-cyan-500/10 border-cyan-500/40 text-cyan-100",
    ring: "ring-cyan-500/50",
  },
  rose: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-400",
    shadow: "shadow-[0_0_20px_rgba(244,63,94,0.3)]",
    from: "from-rose-500/20",
    to: "to-rose-500/0",
    glow: "drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]",
    tab: "bg-rose-500/10 border-rose-500/40 text-rose-100",
    ring: "ring-rose-500/50",
  },
  teal: {
    bg: "bg-teal-500/10",
    border: "border-teal-500/30",
    text: "text-teal-400",
    shadow: "shadow-[0_0_20px_rgba(20,184,166,0.3)]",
    from: "from-teal-500/20",
    to: "to-teal-500/0",
    glow: "drop-shadow-[0_0_8px_rgba(20,184,166,0.8)]",
    tab: "bg-teal-500/10 border-teal-500/40 text-teal-100",
    ring: "ring-teal-500/50",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    shadow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]",
    from: "from-amber-500/20",
    to: "to-amber-500/0",
    glow: "drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]",
    tab: "bg-amber-500/10 border-amber-500/40 text-amber-100",
    ring: "ring-amber-500/50",
  },
  sky: {
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
    text: "text-sky-400",
    shadow: "shadow-[0_0_20px_rgba(14,165,233,0.3)]",
    from: "from-sky-500/20",
    to: "to-sky-500/0",
    glow: "drop-shadow-[0_0_8px_rgba(14,165,233,0.8)]",
    tab: "bg-sky-500/10 border-sky-500/40 text-sky-100",
    ring: "ring-sky-500/50",
  },
  indigo: {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
    text: "text-indigo-400",
    shadow: "shadow-[0_0_20px_rgba(99,102,241,0.3)]",
    from: "from-indigo-500/20",
    to: "to-indigo-500/0",
    glow: "drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]",
    tab: "bg-indigo-500/10 border-indigo-500/40 text-indigo-100",
    ring: "ring-indigo-500/50",
  },
  pink: {
    bg: "bg-pink-500/10",
    border: "border-pink-500/30",
    text: "text-pink-400",
    shadow: "shadow-[0_0_20px_rgba(236,72,153,0.3)]",
    from: "from-pink-500/20",
    to: "to-pink-500/0",
    glow: "drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]",
    tab: "bg-pink-500/10 border-pink-500/40 text-pink-100",
    ring: "ring-pink-500/50",
  },
};

// Agent static definitions
const AGENT_BIOS = [
  {
    name: "accident Intake Coordinator",
    icon: Shield,
    theme: "amber",
    role: "Core orchestrator. Governs session states, manages multi-agency telemetry, and syncs downstream agencies.",
  },
  {
    name: "Severity Analysis Agent",
    icon: Brain,
    theme: "cyan",
    role: "Deciphers telemetry data, voice tenses, and trauma inputs into immediate GCS triaging ratings.",
  },
  {
    name: "Hospital Discovery Agent",
    icon: Hospital,
    theme: "emerald",
    role: "Indexes real-time provincial trauma care registries to find closest specialized bed capacity.",
  },
  {
    name: "Ambulance Dispatch Agent",
    icon: Truck,
    theme: "rose",
    role: "Coordinates ALS/BLS vehicle fleets, dispatches telemetry briefs to paramedics en-route.",
  },
  {
    name: "Police Coordination Agent",
    icon: Shield,
    theme: "blue",
    role: "Alerts local Highway Patrol units for immediate traffic pacing, blockades, or towing dispatch.",
  },
  {
    name: "Family Notification Agent",
    icon: Users,
    theme: "purple",
    role: "Constructs secure, low-anxiety SMS templates to bridge event status to relatives instantly.",
  },
  {
    name: "Route Optimization Agent",
    icon: MapPin,
    theme: "teal",
    role: "Generates ultra-efficient cleanup routing vectors and manages fleet logistics.",
  },
  {
    name: "Bystander Guidance Agent",
    icon: Eye,
    theme: "sky",
    role: "Serves first-aid instructions contextually to bystanders on site, focusing on airway stabilization.",
  },
  {
    name: "Language Translation Agent",
    icon: Languages,
    theme: "indigo",
    role: "Real-time multilingual translation for bystander inputs and first-aid voice synthesis.",
  },
  {
    name: "Government Reporting Agent",
    icon: FileText,
    theme: "pink",
    role: "Formats structured evidence payloads for NHAI frameworks and MoRTH compliance registries.",
  },
];

function MultiAgentConsoleInner({ activeIncident }: MultiAgentConsoleProps) {
  const [selectedAgentTab, setSelectedAgentTab] = useState<string>(
    "accident Intake Coordinator",
  );

  const activeLogs = activeIncident?.agentsLog || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-emerald-400 font-bold tracking-wider">
              SUCCESS
            </span>
          </div>
        );
      case "warning":
        return (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-amber-500 font-bold tracking-wider">
              WARNING
            </span>
          </div>
        );
      case "working":
        return (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <span className="text-[10px] text-cyan-400 font-bold tracking-wider">
              WORKING
            </span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold tracking-wider">
              READY
            </span>
          </div>
        );
    }
  };

  const selectedAgentBio =
    AGENT_BIOS.find((b) => b.name === selectedAgentTab) || AGENT_BIOS[0];
  const matchingLog = activeLogs.find((l) => l.agentName === selectedAgentTab);

  const activeTheme = AGENT_COLORS[selectedAgentBio.theme || "cyan"];

  return (
    <section className="mt-[32px] premium-panel multi-agent-center p-6 min-h-[600px] overflow-hidden relative">
      <div className="glass-reflection"></div>
      <div
        className={`absolute -top-[100px] -right-[100px] w-[500px] h-[500px] rounded-full blur-[100px] ${activeTheme.bg} opacity-50 mix-blend-screen transition-all duration-700 pointer-events-none`}
      ></div>
      <div
        className={`absolute -bottom-[100px] -left-[100px] w-[400px] h-[400px] rounded-full blur-[100px] ${activeTheme.bg} opacity-40 mix-blend-screen transition-all duration-700 pointer-events-none`}
      ></div>

      <div className="flex justify-between items-start md:items-center mb-5 relative z-10 border-b border-white/5 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center shrink-0 shadow-xl overflow-hidden relative group">
            <div
              className={`absolute inset-0 max-w-full ${activeTheme.bg} opacity-20 group-hover:opacity-40 transition-opacity`}
            ></div>
            <Brain
              className={`w-6 h-6 ${activeTheme.text} animate-pulse relative z-10 ${activeTheme.glow}`}
            />
          </div>
          <div>
            <h2 className="text-white font-extrabold text-sm tracking-wide uppercase drop-shadow-sm flex items-center gap-2">
              MULTI-AGENT COGNITIVE OPERATING CENTER
            </h2>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
              SYNCHRONOUS CONSENSUS AND ACTION PIPELINES FOR ACTIVE trauma
              INCIDENTS
            </p>
          </div>
        </div>
        <div className="px-5 py-2.5 rounded-xl bg-black border border-white/5 flex items-center gap-2.5 shadow-xl whitespace-nowrap mt-4 md:mt-0 relative overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-r ${activeTheme.from} ${activeTheme.to} opacity-10 pointer-events-none`}
          ></div>
          <span
            className={`w-2 h-2 rounded-full bg-current ${activeTheme.text} ${activeTheme.glow} animate-pulse`}
          ></span>
          <span
            className={`text-[10px] ${activeTheme.text} font-mono tracking-widest uppercase font-black`}
          >
            Consensus State: Validated (10 Agents)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[38%_62%] gap-6 mt-6 relative z-10">
        {/* LEFT PANEL - Agent List */}
        <div className="max-h-[560px] overflow-y-auto pr-3 custom-scrollbar flex flex-col gap-2 relative">
          {AGENT_BIOS.map((ag) => {
            const Icon = ag.icon;
            const isSelected = ag.name === selectedAgentTab;
            const logItem = activeLogs.find(
              (l) =>
                l.agentName === ag.name ||
                (l.agentName.includes("Police") &&
                  ag.name.includes("Police")) ||
                (l.agentName.includes("Ambulance") &&
                  ag.name.includes("Ambulance")),
            );
            const status = logItem ? logItem.status : "idle";
            const rowTheme = AGENT_COLORS[ag.theme || "cyan"];

            return (
              <button
                key={ag.name}
                onClick={() => setSelectedAgentTab(ag.name)}
                className={`w-full p-4 rounded-[14px] text-left flex items-center justify-between cursor-pointer relative overflow-hidden transition-all duration-300 ${
                  isSelected
                    ? `bg-black/60 border ${rowTheme.border} ${rowTheme.shadow}`
                    : `bg-black/20 border border-white/5 hover:border-white/10 hover:bg-black/40`
                }`}
              >
                {isSelected && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${rowTheme.from} ${rowTheme.to} opacity-20 mix-blend-screen pointer-events-none`}
                  ></div>
                )}
                <div className="flex items-center gap-3 min-w-0 relative z-10">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 ${isSelected ? `bg-black/80 ${rowTheme.border} ${rowTheme.text} ${rowTheme.shadow}` : "bg-black/40 border-white/5 text-slate-500"}`}
                  >
                    <Icon
                      className={`w-4 h-4 ${isSelected ? rowTheme.glow : ""}`}
                    />
                  </div>
                  <div className="min-w-0 text-left">
                    <span
                      className={`font-black text-[11px] uppercase tracking-wider block truncate transition-colors duration-300 ${isSelected ? "text-white drop-shadow-md" : "text-slate-400"}`}
                    >
                      {ag.name}
                    </span>
                    <span
                      className={`text-[9px] block mt-0.5 font-mono ${isSelected ? rowTheme.text : "text-slate-600"}`}
                    >
                      {isSelected ? "ACTIVE STREAM" : "SYSTEM STANDBY"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-end shrink-0 pl-2 relative z-10">
                  {getStatusIcon(status)}
                </div>
              </button>
            );
          })}
        </div>

        {/* RIGHT PANEL - Agent Details */}
        <div
          className={`min-h-[560px] premium-panel p-8 flex flex-col justify-between transition-all duration-500 ${activeTheme.shadow}`}
        >
          <div className="glass-reflection"></div>
          <div
            className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-current to-transparent opacity-50 ${activeTheme.text}`}
          ></div>

          <div className="space-y-8 relative z-10">
            <div className="flex items-start gap-4">
              <div
                className={`w-14 h-14 rounded-2xl bg-black border ${activeTheme.border} flex items-center justify-center shrink-0 relative overflow-hidden group`}
              >
                <div
                  className={`absolute inset-0 ${activeTheme.bg} opacity-20`}
                ></div>
                {React.createElement(selectedAgentBio.icon, {
                  className: `w-7 h-7 relative z-10 ${activeTheme.text} ${activeTheme.glow}`,
                })}
              </div>
              <div>
                <h3 className="text-white font-black text-xl tracking-wide mb-1 drop-shadow-md">
                  {selectedAgentBio.name}
                </h3>
                <p
                  className={`text-xs ${activeTheme.text} font-black uppercase tracking-widest opacity-70`}
                >
                  Autonomous Sub-Routine Core
                </p>
              </div>
            </div>

            <div>
              <span
                className={`text-[10px] ${activeTheme.text} font-black uppercase tracking-widest block mb-3 border-b border-white/5 pb-2 drop-shadow-md`}
              >
                Operational Scope
              </span>
              <p className="text-[13px] text-white/80 leading-relaxed font-bold tracking-wide bg-black/60 p-5 rounded-2xl border border-white/5 shadow-inner">
                {selectedAgentBio.role}
              </p>
            </div>

            <div className="flex-1">
              <span
                className={`text-[10px] ${activeTheme.text} font-black uppercase tracking-widest block mb-3 border-b border-white/5 pb-2 drop-shadow-md`}
              >
                Live Activity Feed & Latest Transaction Log
              </span>
              {matchingLog ? (
                <div className="bg-black/60 border border-white/10 p-6 rounded-2xl flex flex-col gap-3 relative overflow-hidden shadow-inner">
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-[4px] bg-current ${activeTheme.text} ${activeTheme.glow} z-10`}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                  <div className="flex items-center justify-between pl-3 relative z-10 border-b border-white/5 pb-3">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-widest ${activeTheme.tab} px-2 py-1 rounded-md`}
                    >
                      TS: {new Date().toISOString().substring(11, 19)}{" "}
                      {matchingLog.timestamp
                        ? `OFFSET +${matchingLog.timestamp}`
                        : ""}
                    </span>
                    {getStatusIcon(matchingLog.status)}
                  </div>
                  <p className="text-[13px] text-slate-200 font-mono font-medium leading-relaxed pl-3 relative z-10 mt-2">
                    {matchingLog.message}
                  </p>
                </div>
              ) : (
                <div
                  className={`bg-black/40 p-8 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden`}
                >
                  <div
                    className={`absolute inset-0 ${activeTheme.bg} opacity-5 mix-blend-screen`}
                  ></div>
                  <Activity
                    className={`w-8 h-8 ${activeTheme.text} opacity-40`}
                  />
                  <p className="text-xs text-slate-400 font-bold tracking-wide max-w-[250px] leading-relaxed relative z-10">
                    Agent monitoring sensor buses. Submit a trauma report to
                    trigger dynamic server-side consensus deliberation!
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono font-bold tracking-wider relative z-10">
            <span className="flex items-center gap-2">
              <Shield
                className={`w-3.5 h-3.5 ${activeTheme.text} opacity-80`}
              />
              AGENT AUTH HASH:
              <span
                className={`px-2 py-0.5 bg-black rounded border border-white/5 ${activeTheme.text}`}
              >
                RG2546-{selectedAgentBio.name.charAt(0).toUpperCase()}
              </span>
            </span>
            <span className="flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full ${activeTheme.bg.replace("/10", "/80")} ${activeTheme.glow}`}
              ></span>
              SECURE CLOUD SANDBOX
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

const MultiAgentConsole = React.memo(
  MultiAgentConsoleInner,
  (prevProps, nextProps) => {
    if (prevProps.activeIncident === nextProps.activeIncident) return true;
    if (!prevProps.activeIncident || !nextProps.activeIncident) return false;

    return (
      prevProps.activeIncident.id === nextProps.activeIncident.id &&
      prevProps.activeIncident.status === nextProps.activeIncident.status &&
      (prevProps.activeIncident.agentsLog || []).length ===
        (nextProps.activeIncident.agentsLog || []).length
    );
  },
);

MultiAgentConsole.displayName = "MultiAgentConsole";

export default MultiAgentConsole;
