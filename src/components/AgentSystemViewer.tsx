import React, { useState, useEffect } from "react";
import {
  Bot,
  BrainCircuit,
  Building2,
  Ambulance,
  ShieldAlert,
  Network,
  Sparkles,
  Terminal,
  Layers,
  Zap,
  Hexagon,
  Activity,
  MapPin,
  GaugeCircle,
  Radar,
  Compass,
  Battery,
  Route,
  Navigation,
  Eye,
  Settings,
  FileCheck,
  Code2,
  Users,
  AlertTriangle,
  ChartLine,
  WifiOff,
  RefreshCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Incident } from "../types";

interface AgentProfile {
  id: number;
  name: string;
  role: string;
  icon: any;
  glowColor: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  tabIcons: {
    telemetry: any;
    neural: any;
    cad: any;
  };
  tabGradients: {
    telemetry: string;
    neural: string;
    cad: string;
  };
  tabGlows: {
    telemetry: string;
    neural: string;
    cad: string;
  };
}

const AGENTS: AgentProfile[] = [
  {
    id: 1,
    name: "Emergency Coordinator Agent",
    role: "The Orchestrator",
    icon: Bot,
    glowColor: "rgba(168,85,247,0.8)",
    bgGradient: "from-[#2e094c] to-[#0b0318]",
    borderColor: "border-purple-500/50",
    textColor: "text-purple-400",
    tabIcons: { telemetry: Activity, neural: Network, cad: Terminal },
    tabGradients: {
      telemetry: "from-purple-500 to-indigo-500",
      neural: "from-fuchsia-500 to-pink-500",
      cad: "from-violet-500 to-purple-600",
    },
    tabGlows: {
      telemetry: "rgba(168,85,247,0.6)",
      neural: "rgba(232,121,249,0.6)",
      cad: "rgba(139,92,246,0.6)",
    },
  },
  {
    id: 2,
    name: "Severity Assessment Agent",
    role: "The Clinician",
    icon: BrainCircuit,
    glowColor: "rgba(244,63,94,0.8)",
    bgGradient: "from-[#4c091f] to-[#180309]",
    borderColor: "border-rose-500/50",
    textColor: "text-rose-400",
    tabIcons: { telemetry: GaugeCircle, neural: Sparkles, cad: Code2 },
    tabGradients: {
      telemetry: "from-rose-500 to-pink-600",
      neural: "from-orange-500 to-rose-500",
      cad: "from-pink-500 to-rose-400",
    },
    tabGlows: {
      telemetry: "rgba(244,63,94,0.6)",
      neural: "rgba(249,115,22,0.6)",
      cad: "rgba(236,72,153,0.6)",
    },
  },
  {
    id: 3,
    name: "Hospital Agent",
    role: "The Bed Finder",
    icon: Building2,
    glowColor: "rgba(59,130,246,0.8)",
    bgGradient: "from-[#09254c] to-[#030a18]",
    borderColor: "border-blue-500/50",
    textColor: "text-blue-400",
    tabIcons: { telemetry: Radar, neural: MapPin, cad: Compass },
    tabGradients: {
      telemetry: "from-blue-500 to-cyan-500",
      neural: "from-indigo-500 to-blue-500",
      cad: "from-cyan-500 to-teal-500",
    },
    tabGlows: {
      telemetry: "rgba(59,130,246,0.6)",
      neural: "rgba(99,102,241,0.6)",
      cad: "rgba(6,182,212,0.6)",
    },
  },
  {
    id: 4,
    name: "Ambulance Agent",
    role: "The Fleet Manager",
    icon: Ambulance,
    glowColor: "rgba(245,158,11,0.8)",
    bgGradient: "from-[#4c3109] to-[#180f03]",
    borderColor: "border-amber-500/50",
    textColor: "text-amber-400",
    tabIcons: { telemetry: Battery, neural: Route, cad: Navigation },
    tabGradients: {
      telemetry: "from-amber-500 to-orange-500",
      neural: "from-yellow-400 to-amber-500",
      cad: "from-orange-400 to-amber-600",
    },
    tabGlows: {
      telemetry: "rgba(245,158,11,0.6)",
      neural: "rgba(250,204,21,0.6)",
      cad: "rgba(251,146,60,0.6)",
    },
  },
  {
    id: 5,
    name: "Police Agent",
    role: "The Law Enforcer",
    icon: ShieldAlert,
    glowColor: "rgba(16,185,129,0.8)",
    bgGradient: "from-[#094c25] to-[#03180b]",
    borderColor: "border-emerald-500/50",
    textColor: "text-emerald-400",
    tabIcons: { telemetry: Eye, neural: Settings, cad: FileCheck },
    tabGradients: {
      telemetry: "from-emerald-500 to-teal-500",
      neural: "from-teal-400 to-emerald-500",
      cad: "from-green-500 to-emerald-600",
    },
    tabGlows: {
      telemetry: "rgba(16,185,129,0.6)",
      neural: "rgba(45,212,191,0.6)",
      cad: "rgba(34,197,94,0.6)",
    },
  },
  {
    id: 6,
    name: "Family Notification Agent",
    role: "The Liaison",
    icon: Users,
    glowColor: "rgba(236,72,153,0.8)",
    bgGradient: "from-[#4c0936] to-[#180311]",
    borderColor: "border-pink-500/50",
    textColor: "text-pink-400",
    tabIcons: { telemetry: Activity, neural: Network, cad: FileCheck },
    tabGradients: {
      telemetry: "from-pink-500 to-rose-500",
      neural: "from-fuchsia-500 to-pink-500",
      cad: "from-rose-500 to-orange-500",
    },
    tabGlows: {
      telemetry: "rgba(236,72,153,0.6)",
      neural: "rgba(217,70,239,0.6)",
      cad: "rgba(244,63,94,0.6)",
    },
  },
  {
    id: 7,
    name: "Route Agent",
    role: "The Navigator",
    icon: MapPin,
    glowColor: "rgba(6,182,212,0.8)",
    bgGradient: "from-[#09414c] to-[#031518]",
    borderColor: "border-cyan-500/50",
    textColor: "text-cyan-400",
    tabIcons: { telemetry: Route, neural: Compass, cad: Navigation },
    tabGradients: {
      telemetry: "from-cyan-500 to-teal-500",
      neural: "from-teal-400 to-cyan-500",
      cad: "from-blue-500 to-cyan-600",
    },
    tabGlows: {
      telemetry: "rgba(6,182,212,0.6)",
      neural: "rgba(45,212,191,0.6)",
      cad: "rgba(59,130,246,0.6)",
    },
  },
  {
    id: 8,
    name: "Bystander Guidance Agent",
    role: "The First-Responder",
    icon: AlertTriangle,
    glowColor: "rgba(234,179,8,0.8)",
    bgGradient: "from-[#4c4209] to-[#181403]",
    borderColor: "border-yellow-500/50",
    textColor: "text-yellow-400",
    tabIcons: { telemetry: Eye, neural: Sparkles, cad: Terminal },
    tabGradients: {
      telemetry: "from-yellow-400 to-amber-500",
      neural: "from-amber-400 to-yellow-500",
      cad: "from-orange-400 to-yellow-600",
    },
    tabGlows: {
      telemetry: "rgba(234,179,8,0.6)",
      neural: "rgba(245,158,11,0.6)",
      cad: "rgba(251,146,60,0.6)",
    },
  },
  {
    id: 9,
    name: "Analytics Agent",
    role: "The Historian",
    icon: ChartLine,
    glowColor: "rgba(99,102,241,0.8)",
    bgGradient: "from-[#1e1e4c] to-[#050518]",
    borderColor: "border-indigo-500/50",
    textColor: "text-indigo-400",
    tabIcons: { telemetry: GaugeCircle, neural: Network, cad: Code2 },
    tabGradients: {
      telemetry: "from-indigo-500 to-purple-500",
      neural: "from-purple-400 to-indigo-500",
      cad: "from-blue-500 to-indigo-600",
    },
    tabGlows: {
      telemetry: "rgba(99,102,241,0.6)",
      neural: "rgba(168,85,247,0.6)",
      cad: "rgba(59,130,246,0.6)",
    },
  },
  {
    id: 10,
    name: "Offline Agent",
    role: "The Cryptographer",
    icon: WifiOff,
    glowColor: "rgba(100,116,139,0.8)",
    bgGradient: "from-[#1e293b] to-[#020617]",
    borderColor: "border-slate-500/50",
    textColor: "text-slate-400",
    tabIcons: { telemetry: Battery, neural: Terminal, cad: ShieldAlert },
    tabGradients: {
      telemetry: "from-slate-500 to-gray-500",
      neural: "from-gray-400 to-slate-500",
      cad: "from-zinc-500 to-slate-600",
    },
    tabGlows: {
      telemetry: "rgba(100,116,139,0.6)",
      neural: "rgba(156,163,175,0.6)",
      cad: "rgba(113,113,122,0.6)",
    },
  },
];

import { ExecutionFabric } from "../agents/ExecutionFabric";
import { DecisionEngine } from "../agents/DecisionEngine";

// ... Inside AgentSystemViewer ...
export default function AgentSystemViewer({
  activeIncident,
  currentLang,
}: {
  activeIncident?: Incident | null;
  currentLang?: string;
}) {
  const [activeTab, setActiveTab] = useState<
    "fabric" | "topology" | "manifesto" | "logic"
  >("fabric");

  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [drawerTab, setDrawerTab] = useState<"neural" | "cad" | "telemetry">(
    "telemetry",
  );

  // Realtime simulation state
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => (p + 1) % 100);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getDynamicContent = (agentId: number, tab: string) => {
    const incidentLoc =
      activeIncident?.location?.address || "Zone A - Industrial Park";
    const incidentSev = activeIncident?.severity || "High risk";

    if (tab === "neural") {
      const prompts = {
        1: `[ORCHESTRATOR_SYSTEM_PROMPT]\nRole: Primary Router\nParameters: Validate incoming accident schemas.\nPriority: Sub-10ms response.\nCurrent Task: Route ${incidentLoc} payload to Severity Assessment node.\nConstraint: Do NOT bypass safety handshakes.\nPrompt Signature: "You are the Chief Coordinator. A high-stress incident has been reported. Parse the raw input, request a Severity Assessment, and upon receiving it, immediately trigger Hospital, Ambulance, and Police agents concurrently. Do not delay."`,
        2: `[SEVERITY_ASSESSMENT_MOD]\nRole: Vision/Text NLP Extraction\nParameters: Determine severity of trauma.\nCurrent Target: Verify ${incidentSev} claims against field data.\nOutput: JSON Triage Assessment.\nFlag: Requires high visual confidence.\nPrompt Signature: "You are an ER Triage Clinician. Extract the primary suspected injuries from this bystander report. Assess consciousness levels. Output a rigid JSON payload containing 'severity_level' and 'medical_justification'."`,
        3: `[FACILITY_LOCATOR_ALGO]\nRole: Spatial PostGIS Query Engine\nParameters: Find nearest trauma center.\nVariables: Location=${incidentLoc}, Min_Level=2\nOptimization: Heavily penalize distance.\nResponse target: GeoJSON coordinate output. Assigned HospitalID, Distance/ETA.`,
        4: `[FLEET_DISPATCHER_LOGIC]\nRole: Autonomous Fleet Director\nParameters: Allocate nearest drone or truck.\nConstraint: Vehicle MUST match payload risk type (${incidentSev}).\nLock: Prevent multiple dispatches to the same node.\nCurrent state: SCANNING ACTIVE VEHICLES. Finds closest ALS/BLS unit.`,
        5: `[COMPLIANCE_PROTOCOL_AGENT]\nRole: Legal & Highway/Police Check\nParameters: Cross-reference jurisdiction maps.\nTrigger: If risk == High -> Alert Regional PCB.\nAction: Establish 50m quarantine.\nStatus: VERIFYING JURISDICTION.`,
        6: `[LIAISON_SYSTEM]\nRole: Securely fetch ICE contacts.\nTrigger: Verify Auth -> Query ICE table -> Twilio SMS\nOutput: SMS Sent Log.`,
        7: `[NAVIGATION_ALGO]\nRole: OpenStreetMap polyline routing.\nOptimization: Green corridor generation bypassing active traffic.\nVariables: Ambulance GPS, Hospital GPS.`,
        8: `[BYSTANDER_UI_AGENT]\nRole: Translate and format First-Aid NLP.\nConstraint: Output bullet points in user locale (${currentLang || "en"}).\nAction: Provide safe, immediate medical guidance.`,
        9: `[ANALYTICS_AGGREGATOR]\nRole: Compare Golden Hour ETA vs Actual.\nTrigger: Incident Closed.\nOutput: Dashboard Metrics, Black Spot Flags.`,
        10: `[OFFLINE_CRYPTOGRAPHY_NODE]\nRole: Device-side string compression.\nAction: Compress JSON state to 160-char SMS hash (RG_SOS#...).`,
      };
      return prompts[agentId as keyof typeof prompts];
    }
    if (tab === "cad") {
      const tools = {
        1: [
          "> trigger_agent()",
          "> broadcast_websocket_event()",
          "> escalate_to_human()",
          "[OK] Orchestration initiated.",
        ],
        2: [
          "> gemini_vision_parse()",
          "> medical_nlp_extractor()",
          `[OK] Severity JSON Generated.`,
        ],
        3: [
          "> postgis_radius_query()",
          "> hospital_api_ping()",
          "[OK] Trauma Center Found.",
        ],
        4: [
          "> fleet_gps_query()",
          "> send_cad_dispatch()",
          "[OK] ALS Unit Dispatched.",
        ],
        5: [
          "> jurisdiction_polygon_check()",
          "> broadcast_nhai_radio()",
          "[OK] Alerted local dispatch.",
        ],
        6: [
          "> fetch_ice_contacts()",
          "> twilio_sms_api()",
          "[OK] Family Notified.",
        ],
        7: [
          "> osm_routing_engine()",
          "> traffic_congestion_api()",
          "[OK] Route optimizing: -3min ETA.",
        ],
        8: [
          "> gemini_localize_prompt()",
          "> first_aid_database_query()",
          `[OK] UI Rendered [${currentLang || "en"}].`,
        ],
        9: [
          "> postgis_cluster_analysis()",
          "> update_dashboard_metrics()",
          "[OK] Logs aggregated.",
        ],
        10: [
          "> compress_payload_b64()",
          "> sms_manager_send()",
          "[OK] String emitted via cellular network.",
        ],
      };
      return tools[agentId as keyof typeof tools];
    }

    // Telemetry
    const telemetry = {
      1: { status: "ORCHESTRATING", mem: "84MB", calls: 142, load: "24%" },
      2: { status: "ANALYZING", mem: "2.1GB", calls: 45, load: "89%" },
      3: {
        status: "QUERYING SPATIAL DB",
        mem: "410MB",
        calls: 890,
        load: "42%",
      },
      4: { status: "TRACKING GPS", mem: "125MB", calls: 4120, load: "67%" },
      5: { status: "VERIFYING LAWS", mem: "64MB", calls: 12, load: "4%" },
      6: { status: "TRANSMITTING DATA", mem: "4MB", calls: 2, load: "1%" },
      7: { status: "CALCULATING POLY", mem: "500MB", calls: 49, load: "80%" },
      8: { status: "GENERATING UI", mem: "300MB", calls: 3, load: "14%" },
      9: { status: "ASLEEP", mem: "0MB", calls: 0, load: "0%" },
      10: { status: "IDLE (ONLINE MODE)", mem: "1MB", calls: 0, load: "0%" },
    };
    return telemetry[agentId as keyof typeof telemetry];
  };

  return (
    <div className="w-full min-h-[80vh] bg-[#020512] rounded-[3rem] p-6 md:p-10 border border-indigo-900/30 relative overflow-hidden flex flex-col font-mono text-white shadow-[0_0_80px_rgba(30,20,60,0.5)]">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-[100%] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-[0_0_30px_rgba(99,102,241,0.4)]">
            <div className="w-full h-full bg-[#030614] rounded-2xl flex items-center justify-center">
              <Network className="w-7 h-7 text-indigo-400" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 drop-shadow-md">
              Enterprise 10-Agent Network
            </h2>
            <div className="text-xs text-indigo-400/80 uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              RoadGuardian AI Active
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 bg-[#050b1f] border border-indigo-500/20 rounded-full p-1.5 shadow-inner">
          <button
            onClick={() => setActiveTab("fabric")}
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${activeTab === "fabric" ? "bg-cyan-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)]" : "text-slate-400 hover:text-white"}`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Neural Fabric
          </button>
          <button
            onClick={() => setActiveTab("topology")}
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${activeTab === "topology" ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)]" : "text-slate-400 hover:text-white"}`}
          >
            <Hexagon className="w-3.5 h-3.5" /> Static Topology
          </button>
          <button
            onClick={() => setActiveTab("manifesto")}
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${activeTab === "manifesto" ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)]" : "text-slate-400 hover:text-white"}`}
          >
            <Layers className="w-3.5 h-3.5" /> Manifesto
          </button>
          <button
            onClick={() => setActiveTab("logic")}
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${activeTab === "logic" ? "bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.5)]" : "text-slate-400 hover:text-white"}`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Security/Logic
          </button>
        </div>
      </div>

      {activeTab === "fabric" && (
        <div className="relative flex-1 w-full h-full z-10 overflow-hidden flex flex-col">
           <div className="flex justify-center mb-2 z-20">
             <button 
               onClick={() => DecisionEngine.runSOSScenario()}
               className="bg-rose-600 text-white px-8 py-3 rounded-full font-black tracking-widest uppercase text-sm shadow-[0_0_30px_rgba(225,29,72,0.6)] hover:scale-105 transition-all"
             >
               Trigger Test SOS Scenario
             </button>
           </div>
           <div className="flex-1 w-full rounded-3xl overflow-hidden border border-indigo-500/20 shadow-2xl relative">
              <ExecutionFabric />
           </div>
        </div>
      )}

      {/* Main Architecture Diagram */}
      {activeTab === "topology" && (
        <div className="relative flex-1 flex flex-col items-center justify-center py-4 w-full z-10 overflow-auto custom-scrollbar">
          <div className="min-w-[1000px] flex flex-col items-center">
            {/* Top Row: Offline/Triggers */}
            <div className="flex items-center gap-8 mb-4">
              <AgentNode
                agent={AGENTS[9]}
                selected={selectedAgent === 10}
                onClick={() =>
                  setSelectedAgent(selectedAgent === 10 ? null : 10)
                }
                size="small"
              />
              <div className="flex flex-col items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest px-4 border border-slate-700/50 rounded-lg bg-black/40 py-2">
                <span>Incident Trigger</span>
                <span className="text-indigo-400">Voice/Text/Offline Hash</span>
              </div>
            </div>

            <FlowArrow />

            {/* Core Row */}
            <div className="flex gap-12 items-center">
              <AgentNode
                agent={AGENTS[0]}
                selected={selectedAgent === 1}
                onClick={() => setSelectedAgent(selectedAgent === 1 ? null : 1)}
                size="large"
              />
              <div className="flex flex-col gap-2 relative">
                <div className="w-12 h-px bg-rose-500/50 absolute top-1/2 -left-12"></div>
                <AgentNode
                  agent={AGENTS[1]}
                  selected={selectedAgent === 2}
                  onClick={() =>
                    setSelectedAgent(selectedAgent === 2 ? null : 2)
                  }
                  size="small"
                />
              </div>
            </div>

            <FlowArrow />

            {/* Middle Row (The Concurrency Mesh) */}
            <div className="w-full relative border-t-2 border-indigo-500/20 pt-8 mt-4 grid grid-cols-5 gap-4 px-10">
              {/* Vertical connector lines */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-[20%] border-l-2 border-indigo-500/20"></div>

              <AgentNode
                agent={AGENTS[2]}
                selected={selectedAgent === 3}
                onClick={() => setSelectedAgent(selectedAgent === 3 ? null : 3)}
                size="small"
              />
              <AgentNode
                agent={AGENTS[3]}
                selected={selectedAgent === 4}
                onClick={() => setSelectedAgent(selectedAgent === 4 ? null : 4)}
                size="small"
              />
              <AgentNode
                agent={AGENTS[4]}
                selected={selectedAgent === 5}
                onClick={() => setSelectedAgent(selectedAgent === 5 ? null : 5)}
                size="small"
              />
              <AgentNode
                agent={AGENTS[5]}
                selected={selectedAgent === 6}
                onClick={() => setSelectedAgent(selectedAgent === 6 ? null : 6)}
                size="small"
              />
              <AgentNode
                agent={AGENTS[6]}
                selected={selectedAgent === 7}
                onClick={() => setSelectedAgent(selectedAgent === 7 ? null : 7)}
                size="small"
              />
            </div>

            {/* Bottom Row */}
            <div className="w-full max-w-2xl mt-8 grid grid-cols-2 gap-8">
              <AgentNode
                agent={AGENTS[7]}
                selected={selectedAgent === 8}
                onClick={() => setSelectedAgent(selectedAgent === 8 ? null : 8)}
                size="small"
              />
              <AgentNode
                agent={AGENTS[8]}
                selected={selectedAgent === 9}
                onClick={() => setSelectedAgent(selectedAgent === 9 ? null : 9)}
                size="small"
              />
            </div>
          </div>
        </div>
      )}

      {/* Manifesto View */}
      {activeTab === "manifesto" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 z-10 overflow-y-auto pr-2 custom-scrollbar"
        >
          {AGENTS.map((agent, idx) => (
            <div
              key={agent.id}
              className={`bg-gradient-to-b ${agent.bgGradient} border ${agent.borderColor} rounded-2xl p-4 relative overflow-hidden group hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(0,0,0,0.5)] cursor-pointer`}
              onClick={() => setSelectedAgent(agent.id)}
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 blur-[40px] opacity-40 transition-opacity group-hover:opacity-80"
                style={{ backgroundColor: agent.glowColor }}
              />
              <div className="flex justify-between items-start mb-3 relative z-10">
                <agent.icon className={`w-6 h-6 ${agent.textColor}`} />
                <span
                  className={`text-[10px] uppercase font-bold text-white/50 bg-black/40 px-2 py-0.5 rounded-full border border-white/10`}
                >
                  Agent {idx + 1}
                </span>
              </div>
              <h3 className="text-white text-sm font-black uppercase tracking-wider mb-0.5 relative z-10">
                {agent.name}
              </h3>
              <div
                className={`text-[10px] ${agent.textColor} uppercase tracking-[0.2em] font-bold mb-3 relative z-10`}
              >
                {agent.role}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Security & Logic View */}
      {activeTab === "logic" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 z-10 max-w-4xl mx-auto w-full"
        >
          <div className="bg-gradient-to-br from-rose-950/40 to-black/80 p-6 border border-rose-500/30 rounded-2xl text-white shadow-2xl">
            <h3 className="flex items-center gap-3 text-rose-400 font-bold uppercase tracking-widest mb-4">
              <AlertTriangle className="w-5 h-5" /> Orchestration & Escalation
              Logic
            </h3>
            <p className="text-sm text-slate-300 mb-6 border-l-2 border-rose-500/50 pl-4 py-1">
              Because this is a life-critical system, AI hallucinations or
              failures must fail-safe to a human operator instantly.
            </p>

            <div className="space-y-4">
              <div className="bg-black/60 border border-white/5 p-5 rounded-xl">
                <h4 className="text-white text-sm font-bold flex items-center gap-2 mb-2">
                  <span className="text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded text-[10px]">
                    LOGIC 1
                  </span>{" "}
                  Confidence Threshold Escalation
                </h4>
                <p className="text-xs text-slate-400">
                  If the <strong>Severity Assessment Agent</strong> returns a
                  confidence score &lt; 85% (e.g., due to garbled audio or
                  conflicting reports), the <strong>Coordinator Agent</strong>{" "}
                  flags{" "}
                  <code className="bg-rose-500/20 text-rose-300 px-1 py-0.5 rounded">
                    requires_human=true
                  </code>{" "}
                  and instantly pings the physical dispatcher dashboard in red.
                </p>
              </div>

              <div className="bg-black/60 border border-white/5 p-5 rounded-xl">
                <h4 className="text-white text-sm font-bold flex items-center gap-2 mb-2">
                  <span className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-[10px]">
                    LOGIC 2
                  </span>{" "}
                  API Timeout Graceful Degradation
                </h4>
                <p className="text-xs text-slate-400">
                  If the{" "}
                  <code className="text-emerald-300 bg-emerald-500/10 px-1 py-0.5 rounded">
                    hospital_api_ping()
                  </code>{" "}
                  fails (hospital server down), the{" "}
                  <strong>Hospital Agent</strong> immediately falls back to a
                  cached PostGIS radius search for the next nearest Level 2
                  center, bypassing real-time bed checks.
                </p>
              </div>

              <div className="bg-black/60 border border-white/5 p-5 rounded-xl">
                <h4 className="text-white text-sm font-bold flex items-center gap-2 mb-2">
                  <span className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded text-[10px]">
                    LOGIC 3
                  </span>{" "}
                  Resource Exhaustion Trigger
                </h4>
                <p className="text-xs text-slate-400">
                  If the <strong>Ambulance Agent</strong> finds 0 available
                  fleet vehicles within 15km, it triggers an{" "}
                  <code className="text-amber-300 bg-amber-500/10 px-1 py-0.5 rounded">
                    ESCALATION_MOU
                  </code>{" "}
                  event, automatically pinging private/corporate hospital fleets
                  nearby via secondary MoU APIs.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/60 p-6 border border-indigo-500/20 rounded-2xl shadow-xl">
              <h3 className="flex items-center gap-3 text-white font-bold uppercase tracking-widest mb-4 text-sm">
                <RefreshCcw className="w-4 h-4 text-indigo-400" /> State Machine
                Resiliency
              </h3>
              <ul className="text-xs text-slate-400 space-y-3 list-disc pl-4">
                <li>
                  <strong>Idempotency:</strong> All tool execution calls (e.g.
                  `dispatch_ambulance`) require an incident UUID to prevent
                  duplicate fleet actions.
                </li>
                <li>
                  <strong>Dead Letter Queue:</strong> Any agent failure pushes
                  the raw input to a DLQ monitored by human orchestrators.
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Elegant Side Drawer (Glassmorphism) */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`absolute top-0 right-0 bottom-0 w-full md:w-[480px] z-50 backdrop-blur-3xl border-l p-8 flex flex-col`}
            style={{
              backgroundColor: "rgba(3, 6, 20, 0.95)",
              borderColor: AGENTS.find((a) => a.id === selectedAgent)
                ?.glowColor,
              boxShadow: `-30px 0 100px ${AGENTS.find((a) => a.id === selectedAgent)?.glowColor.replace("0.8", "0.15")}`,
            }}
          >
            {/* Drawer Header */}
            <div className="flex justify-between items-start mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center bg-black/50 shadow-[0_0_20px_var(--glow)]`}
                  style={
                    {
                      "--glow": AGENTS.find((a) => a.id === selectedAgent)
                        ?.glowColor,
                    } as any
                  }
                >
                  {React.createElement(
                    AGENTS.find((a) => a.id === selectedAgent)?.icon || Bot,
                    {
                      className: `w-6 h-6 ${AGENTS.find((a) => a.id === selectedAgent)?.textColor}`,
                    },
                  )}
                </div>
                <div>
                  <h3 className="text-white font-black text-lg uppercase tracking-wider">
                    {AGENTS.find((a) => a.id === selectedAgent)?.name}
                  </h3>
                  <p
                    className={`text-[10px] uppercase tracking-[0.2em] font-bold ${AGENTS.find((a) => a.id === selectedAgent)?.textColor}`}
                  >
                    {AGENTS.find((a) => a.id === selectedAgent)?.role}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAgent(null)}
                className="text-[10px] uppercase font-black text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors border border-white/10"
              >
                Close
              </button>
            </div>

            {/* Glowing Drawer Tabs */}
            <div className="flex gap-3 p-1.5 bg-[#030614]/80 backdrop-blur-xl border border-white/5 rounded-2xl mb-8 shadow-[inset_0_0_20px_rgba(0,0,0,1)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
              {[
                { id: "neural", label: "Neural Spec" },
                { id: "cad", label: "CAD Terminal" },
                { id: "telemetry", label: "Telemetry" },
              ].map((t) => {
                const agent = AGENTS.find((a) => a.id === selectedAgent)!;
                const Icon =
                  agent?.tabIcons[t.id as keyof typeof agent.tabIcons] ||
                  Activity;
                const isSelected = drawerTab === t.id;
                const activeGradient =
                  agent.tabGradients[t.id as keyof typeof agent.tabGradients];
                const activeGlow =
                  agent.tabGlows[t.id as keyof typeof agent.tabGlows];

                return (
                  <button
                    key={t.id}
                    onClick={() => setDrawerTab(t.id as any)}
                    className={`relative flex-1 py-3.5 flex items-center justify-center gap-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 overflow-hidden group ${
                      isSelected
                        ? `text-white bg-gradient-to-r ${activeGradient} border border-white/20 scale-[1.02]`
                        : "text-slate-500 border border-transparent hover:text-slate-300 hover:bg-white/5"
                    }`}
                    style={
                      isSelected
                        ? {
                            boxShadow: `0 8px 30px ${activeGlow}, inset 0 2px 5px rgba(255,255,255,0.4)`,
                          }
                        : {}
                    }
                  >
                    {isSelected && (
                      <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[url('https://transparenttextures.com/patterns/stardust.png')]" />
                    )}
                    <Icon
                      className={`w-4 h-4 relative z-10 transition-all duration-300 ${isSelected ? "text-white drop-shadow-md" : "text-slate-600 group-hover:text-slate-400 group-hover:scale-110"}`}
                    />
                    <span className="relative z-10 tracking-[0.2em] pt-[1px] text-shadow-sm">
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
              {drawerTab === "telemetry" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="bg-black/60 border border-white/5 rounded-2xl p-5 shadow-inner">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-4">
                      Core Processing State
                    </span>
                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                      <span className="text-white text-xs uppercase tracking-wider font-bold">
                        Pipeline Status
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full animate-pulse`}
                          style={{
                            backgroundColor: AGENTS.find(
                              (a) => a.id === selectedAgent,
                            )?.glowColor,
                          }}
                        />
                        <span className="text-emerald-400 font-bold text-[11px] tracking-widest bg-emerald-400/10 px-2 py-1 rounded">
                          {
                            (
                              getDynamicContent(
                                selectedAgent,
                                "telemetry",
                              ) as any
                            ).status
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/60 border border-white/5 p-5 rounded-2xl shadow-inner">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-2">
                        Memory Load
                      </span>
                      <div className="text-2xl text-white font-light">
                        {
                          (getDynamicContent(selectedAgent, "telemetry") as any)
                            .mem
                        }
                      </div>
                    </div>
                    <div className="bg-black/60 border border-white/5 p-5 rounded-2xl shadow-inner">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-2">
                        CPU Utilization
                      </span>
                      <div className="text-2xl text-white font-light">
                        {
                          (getDynamicContent(selectedAgent, "telemetry") as any)
                            .load
                        }
                      </div>
                    </div>
                  </div>

                  {/* Frequency Wave */}
                  <div className="bg-black/60 border border-white/5 p-5 rounded-2xl h-32 relative overflow-hidden flex items-end justify-between px-2 pb-2">
                    <span className="absolute top-4 left-4 text-[9px] text-slate-500 uppercase tracking-widest">
                      Inference Frequency
                    </span>
                    {Array.from({ length: 24 }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          height: `${Math.max(10, Math.random() * 80)}px`,
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          repeatType: "reverse",
                          delay: i * 0.05,
                        }}
                        className="w-1.5 rounded-t-sm"
                        style={{
                          backgroundColor: AGENTS.find(
                            (a) => a.id === selectedAgent,
                          )?.glowColor,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {drawerTab === "neural" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full"
                >
                  <div className="bg-black/80 border border-white/10 rounded-2xl p-6 h-full font-mono text-[11px] text-slate-300 leading-relaxed shadow-inner overflow-hidden relative group">
                    <div className="text-[9px] text-emerald-500 uppercase tracking-widest mb-4 flex justify-between">
                      <span>Secure Context Loaded</span>
                      <span>ENV: PROD</span>
                    </div>
                    <pre className="whitespace-pre-wrap break-words">
                      {getDynamicContent(selectedAgent, "neural") as string}
                    </pre>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none" />
                  </div>
                </motion.div>
              )}

              {drawerTab === "cad" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="bg-[#050714] border border-blue-900/50 rounded-2xl p-5 shadow-inner">
                    <span className="text-[9px] text-blue-400 uppercase tracking-widest block mb-3 font-black">
                      Live Execution Stream
                    </span>
                    <div className="space-y-3 font-mono text-[10px]">
                      {(
                        getDynamicContent(selectedAgent, "cad") as string[]
                      ).map((log, i) => (
                        <div key={i} className="flex gap-2">
                          <span className="text-slate-600">[{i + 1}]</span>
                          <span
                            className={
                              log.includes("[OK]")
                                ? "text-emerald-400"
                                : "text-slate-300"
                            }
                          >
                            {log}
                          </span>
                        </div>
                      ))}
                      <div className="flex gap-2 opacity-50 animate-pulse">
                        <span className="text-slate-600">[{pulse}]</span>
                        <span className="text-slate-400">
                          Awaiting next instruction...
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Subcomponents for visual cleanliness

function FlowArrow() {
  return (
    <div className="w-px h-6 md:h-10 bg-gradient-to-b from-indigo-500 via-purple-500 to-indigo-500 relative flex items-center justify-center my-1 z-0">
      <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_10px_#a855f7]" />
    </div>
  );
}

function AgentNode({
  agent,
  selected,
  onClick,
  size = "large",
}: {
  agent: AgentProfile;
  selected: boolean;
  onClick: () => void;
  size?: "large" | "small";
}) {
  const isLarge = size === "large";
  return (
    <div
      onClick={onClick}
      className={`relative group cursor-pointer transition-all duration-300 z-10 w-full ${selected ? "scale-105 z-20" : "hover:scale-[1.02]"}`}
      style={isLarge ? { maxWidth: "280px" } : {}}
    >
      <div
        className={`absolute -inset-1 rounded-3xl opacity-30 blur-xl transition-all duration-500 ${selected ? "opacity-80 scale-110" : "group-hover:opacity-60"}`}
        style={{ background: agent.glowColor }}
      />
      <div
        className={`relative bg-[#050818] border ${selected ? agent.borderColor : "border-white/10"} rounded-2xl flex flex-col items-center justify-center text-center shadow-[inset_0_0_20px_rgba(255,255,255,0.02),0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md overflow-hidden ${isLarge ? "w-full p-6" : "w-full px-4 py-4 mx-auto"}`}
      >
        <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div
          className={`${isLarge ? "w-12 h-12" : "w-10 h-10"} rounded-xl bg-gradient-to-br ${agent.bgGradient} p-[1px] mb-3 shadow-[0_0_20px_var(--glow)]`}
          style={{ "--glow": agent.glowColor.replace("0.8", "0.3") } as any}
        >
          <div className="w-full h-full bg-[#050818] rounded-xl flex items-center justify-center">
            <agent.icon
              className={`${isLarge ? "w-6 h-6" : "w-5 h-5"} ${agent.textColor}`}
            />
          </div>
        </div>

        <h4
          className={`text-white font-black uppercase tracking-widest mb-1 shadow-black text-shadow-sm ${isLarge ? "text-sm" : "text-[10px]"}`}
        >
          {agent.name}
        </h4>
        <div
          className={`text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] opacity-80 ${agent.textColor} mb-3`}
        >
          {agent.role}
        </div>

        <div className="flex items-center gap-2 bg-black/40 border border-white/5 px-3 py-1.5 rounded-full shadow-inner">
          <span
            className={`w-1.5 h-1.5 rounded-full animate-pulse`}
            style={{
              backgroundColor:
                agent.textColor.replace(
                  "text-",
                  "",
                ) /* Hacky but works for generic tailwind */ || "white",
            }}
          />
          <span className="text-[8px] uppercase tracking-widest text-slate-400">
            System Ready
          </span>
        </div>
      </div>
    </div>
  );
}
