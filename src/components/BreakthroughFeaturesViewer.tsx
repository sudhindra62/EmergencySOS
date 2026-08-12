/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Sparkles,
  Trophy,
  Target,
  Zap,
  Activity,
  Shield,
  Navigation,
  Brain,
  Video,
  FileCheck,
  Map,
  Users,
  Eye,
  Rocket,
} from "lucide-react";

const FEATURES = [
  {
    id: 1,
    title: "AI Golden Hour Optimizer",
    desc: "Predictive deployment model staging ambulances near dynamic risk-zones based on time, weather, and historical telemetry.",
    impl: "PostGIS clustering + Prophet time-series forecasting.",
    demo: "Show a map shifting ambulance staging coordinates dynamically as a 'rainstorm' weather event is simulated.",
    impact: 9.8,
    icon: Target,
    color: "emerald",
  },
  {
    id: 2,
    title: "Smart Bystander Coach",
    desc: "Real-time voice-guided first-aid dynamically translated into regional languages based on device locale.",
    impl: "Gemini Live API + Text-to-Speech (TTS) sync.",
    demo: "User initiates SOS; UI instantly speaks CPR instructions in Tamil using TTS, matching the detected location.",
    impact: 9.5,
    icon: Brain,
    color: "blue",
  },
  {
    id: 3,
    title: "Emergency Digital Twin",
    desc: "Maintains a real-time 3D simulation of the accident grid to identify bottlenecks and test routing algorithms before dispatch.",
    impl: "React Three Fiber + WebSockets synced to PostGIS state.",
    demo: "Toggle to 'Twin' view showing moving ambulances and traffic nodes reacting to simulated road closures.",
    impact: 9.7,
    icon: Map,
    color: "indigo",
  },
  {
    id: 4,
    title: "AI Rescue Planner",
    desc: "Generates step-by-step extraction blueprints for trapped passengers based on the vehicle make and model detected in photos.",
    impl: "Gemini 1.5 Pro Vision + VAHAN DB heuristics.",
    demo: "Upload photo of a crashed EV; UI outputs battery isolation steps and safest Jaws-of-Life hydraulic cut points.",
    impact: 9.9,
    icon: Zap,
    color: "amber",
  },
  {
    id: 5,
    title: "Zero-Click Acoustic SOS",
    desc: "Background edge-ML model detects acoustic signatures of tire screeches and impact to auto-trigger SOS without user input.",
    impl: "TensorFlow Lite audio classification on edge device.",
    demo: "Play a crash sound near the microphone; app auto-transitions to SOS countdown screen without touch.",
    impact: 9.6,
    icon: Activity,
    color: "rose",
  },
  {
    id: 6,
    title: "Hyper-Compressed Edge Telemetry",
    desc: "Compresses GPS and trauma severity into a 160-char base64 SMS string when 4G/5G drops on rural highways.",
    impl: "LZMA string compression + sms:// URI gateway protocol.",
    demo: "Toggle 'Offline Mode'; app generates a dense crypto-string and opens the native SMS app pre-filled to Dispatch.",
    impact: 10.0,
    icon: Zap,
    color: "emerald",
  },
  {
    id: 7,
    title: "Code-Switched Triage NLP",
    desc: "NLP agent parses Hinglish/Tanglish mixed language bystander reports into standard medical dispatch codes.",
    impl: "Whisper ASR + Gemini Entity Extraction pipeline.",
    demo: "Speak 'Rendu perukku blood varuthu, head injury' - System parses as '2 Casualties, Suspected Traumatic Brain Injury'.",
    impact: 9.4,
    icon: Shield,
    color: "teal",
  },
  {
    id: 8,
    title: "V2X Green Corridor Pathfinder",
    desc: "Integrates with Smart City systems to route ambulances through synchronized green lights, adjusting ETAs instantly.",
    impl: "OpenStreetMap (OSM) routing with active traffic constraints.",
    demo: "Dispatch map shows a dynamic green polyline that redraws itself around a newly reported traffic jam.",
    impact: 9.1,
    icon: Navigation,
    color: "emerald",
  },
  {
    id: 9,
    title: "Live Trauma Bed Handshake",
    desc: "Programmatically reserves a trauma bed via API before the ambulance arrives to prevent ER rejections and delays.",
    impl: "FastAPI WebHook handshakes + Hospital EMR mock APIs.",
    demo: "Show a pending request switch to 'Confirmed' with Apollo Hospital, reserving 'ICU Bed 4' before arrival.",
    impact: 9.3,
    icon: Activity,
    color: "amber",
  },
  {
    id: 10,
    title: "Mass-Casualty Load Balancer",
    desc: "Automatically distributes accident intake across multiple facilities during major incidents to prevent overflow.",
    impl: "Graph-based capacity distribution algorithms.",
    demo: "Specify 15 victims; UI routes 5 to Level-1, 10 to Level-2 hospitals avoiding single-facility collapse.",
    impact: 9.8,
    icon: Users,
    color: "rose",
  },
  {
    id: 11,
    title: "Drone-First Inspection Vanguard",
    desc: "Dispatches drones with optical sensors to stream the site while the physical fleet navigates traffic.",
    impl: "API integration with drone logistics platforms + WebRTC.",
    demo: "Click 'Deploy Drone'; a mock video feed pops up confirming fuel spill risks before the ambulance arrives.",
    impact: 9.2,
    icon: Video,
    color: "indigo",
  },
  {
    id: 12,
    title: "Blood Bank Radial Ping",
    desc: "Alerts nearest blood banks to prep O-negative supplies based on incoming trauma severity scores.",
    impl: "Geospatial ST_DWithin radius queries in PostGIS.",
    demo: "Trigger a 'Critical' trauma; dashboard shows 3 nearby blood banks transitioning to 'Alert State'.",
    impact: 8.9,
    icon: Shield,
    color: "rose",
  },
  {
    id: 13,
    title: "Immutable Legal Ledger",
    desc: "Cryptographically signs SOS and dispatch timestamps for tamper-proof police, court, and insurance records.",
    impl: "SHA-256 hash chaining of incident state transitions.",
    demo: "View an incident report; UI displays verifiable cryptographic hashes for every dispatch event timestamp.",
    impact: 8.6,
    icon: FileCheck,
    color: "emerald",
  },
  {
    id: 14,
    title: "Good Samaritan Digital Incentive",
    desc: "Gamifies bravery by issuing verified certificates via DigiLocker, protecting reporters against legal harassment.",
    impl: "DigiLocker Mock APIs + Good Samaritan Law verification.",
    demo: "After an incident resolves, the bystander's profile levels up and generates a verified 'First Responder' badge.",
    impact: 9.5,
    icon: Trophy,
    color: "amber",
  },
  {
    id: 15,
    title: "Dashcam Traffic Analyzer",
    desc: "Adjusts hospital ETAs dynamically by analyzing incoming ambulance dashcam feeds for visual road density.",
    impl: "Simulated edge-video frame analysis + ETA modifiers.",
    demo: "Simulate a dashcam feed showing heavy rain; routing algorithm updates ETA from 8 mins to 14 mins instantly.",
    impact: 9.0,
    icon: Video,
    color: "blue",
  },
  {
    id: 16,
    title: "Predictive Black-Spot Heatmap",
    desc: "Dynamic geographic heatmap highlighting sections becoming high-risk under transient conditions (e.g., fog + night).",
    impl: "Multi-variate spatial aggregation on Mapbox/Leaflet.",
    demo: "Toggle 'Night Mode'; the map highlights unlit curve sections in red based on historical accident aggregation.",
    impact: 9.2,
    icon: Map,
    color: "indigo",
  },
  {
    id: 17,
    title: "Zero-Latency WebSocket Mesh",
    desc: "Ensures bystander, ambulance, and receiving ER share a sub-100ms synchronized grid state with no refresh needed.",
    impl: "Redis Pub/Sub backplane with FastAPI WebSockets.",
    demo: "Ambulance icon moves smoothly on the dispatcher's screen reacting to simulated telemetry streams in real-time.",
    impact: 8.8,
    icon: Zap,
    color: "teal",
  },
  {
    id: 18,
    title: "Driver Fatigue Pre-Alert",
    desc: "Flags highway sectors if commercial fleet telematics detect high levels of driver drowsiness nearby.",
    impl: "Ingestion webhooks from mock third-party truck telematics.",
    demo: "Dashboard flags 'NH-45' with a warning triangle; hovering shows '3 fleet drivers exhibiting microsleep'.",
    impact: 8.7,
    icon: Eye,
    color: "amber",
  },
  {
    id: 19,
    title: "NLP Post-Crash Storyteller",
    desc: "Generates human-readable weekly newsletters summarizing municipal grid performance and lives saved.",
    impl: "Gemini narrative generation over PostgreSQL aggregates.",
    demo: "Click 'Generate Report'; AI writes a compelling PR summary of the week's lowered response times.",
    impact: 8.4,
    icon: Brain,
    color: "emerald",
  },
  {
    id: 20,
    title: "Family ICE Whisperer",
    desc: "Secure Liaison Agent automatically sends gentle, calming SMS updates to emergency contacts to prevent panic.",
    impl: "Twilio API integration with empathetic prompt tuning.",
    demo: "Trigger dispatch; UI shows a mock SMS being sent: 'Your loved one is safe & en route to Apollo ER'.",
    impact: 9.3,
    icon: Users,
    color: "blue",
  },
];

const COLOR_CYCLE = [
  "card-rose text-rose-400",
  "card-purple text-purple-400",
  "card-gold text-amber-400",
  "card-emerald text-emerald-400",
  "card-orange text-orange-400",
  "card-cyan text-cyan-400",
  "card-royal text-indigo-400",
  "card-rosegold text-pink-400",
  "card-mint text-emerald-300",
  "card-indigo text-indigo-500",
];

export default function BreakthroughFeaturesViewer() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const getImpactColor = (score: number) => {
    if (score >= 9.8) return "text-rose-400";
    if (score >= 9.5) return "text-amber-400";
    if (score >= 9.0) return "text-emerald-400";
    return "text-cyan-400";
  };

  return (
    <div className="breakthrough-shell rounded-[2.5rem] relative min-h-[85vh] flex flex-col">
      <div className="pt-10 px-10 pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-4 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <Trophy className="w-8 h-8 text-amber-400 drop-shadow-[0_0_15px_rgba(255,190,0,0.6)]" />
            Breakthrough Innovations
          </h2>
          <p className="text-sm text-white/50 font-medium tracking-wide mt-3 text-shadow-sm">
            20 Disrptive Technical Features Designed for the Golden Hour
            Challenge.
          </p>
        </div>
        <div className="impact-badge flex items-center gap-3 px-5 py-3 rounded-full relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] animate-[shimmer_2.5s_infinite]"></div>
          <Sparkles className="w-4 h-4 text-amber-400 drop-shadow-[0_0_8px_rgba(255,190,0,0.8)]" />
          <span className="text-xs font-black font-mono text-white tracking-widest uppercase relative z-10">
            JUDGE_IMPACT_SORTED
          </span>
        </div>
      </div>

      <div className="px-10 pb-10 flex-1 overflow-y-auto custom-scrollbar relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {FEATURES.sort((a, b) => b.impact - a.impact).map((feature, idx) => {
            const Icon = feature.icon;
            const cycleClass = COLOR_CYCLE[idx % 10];
            const isHovered = hoveredId === feature.id;

            return (
              <div
                key={feature.id}
                onMouseEnter={() => setHoveredId(feature.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`breakthrough-card p-7 ${cycleClass.split(" ")[0]} ${isHovered ? "z-20 scale-[1.02] transition-transform shadow-[0_0_30px_rgba(0,0,0,0.5)]" : "z-10 transition-transform"}`}
              >
                <div className="absolute top-5 right-5 flex flex-col items-end z-10">
                  <span
                    className={`text-xl font-black font-mono leading-none drop-shadow-md ${getImpactColor(feature.impact)}`}
                  >
                    {feature.impact.toFixed(1)}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-white/30 tracking-widest mt-1.5">
                    Impact Score
                  </span>
                </div>

                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-white/5 border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] relative z-10`}
                >
                  <Icon
                    className={`w-6 h-6 feature-icon ${cycleClass.split(" ")[1]}`}
                  />
                </div>

                <h3 className="text-white font-bold text-lg mb-3 pr-12 leading-snug relative z-10">
                  <span className="text-white/20 mr-2 text-xs font-mono font-black">
                    {String(idx + 1).padStart(2, "0")}.
                  </span>
                  {feature.title}
                </h3>

                <p className="text-sm text-white/60 leading-relaxed mb-4 font-medium relative z-10 min-h-[60px]">
                  {feature.desc}
                </p>

                <div className="space-y-4 relative z-10 pt-4 border-t border-white/10">
                  <div>
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block mb-2 flex items-center gap-1">
                      <Rocket className="w-3 h-3" /> Demo Flow
                    </span>
                    <p className="text-xs font-sans text-cyan-100/80 leading-relaxed bg-cyan-950/30 p-3 rounded-lg border border-cyan-500/20">
                      {feature.demo}
                    </p>
                  </div>

                  <div>
                    <span className="text-[9px] font-black text-emerald-400/50 uppercase tracking-widest block mb-2">
                      Technical Implementation
                    </span>
                    <p className="text-[11px] font-mono text-emerald-300/80 px-3 py-2 bg-black/40 rounded-lg border border-emerald-500/10 shadow-inner break-words">
                      {feature.impl}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
