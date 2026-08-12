import React, { useState } from "react";
import {
  HeartPulse,
  Droplet,
  Flame,
  Brain,
  Skull,
  Activity,
  Volume2,
  Globe,
  AlertTriangle,
  Loader2,
  ShieldAlert,
} from "lucide-react";

const EMERGENCIES = [
  {
    id: "bleeding",
    name: "Severe Bleeding",
    icon: Droplet,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    id: "burns",
    name: "Severe Burns",
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    id: "head_injury",
    name: "Head Injury",
    icon: Brain,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    id: "fracture",
    name: "Bone Fracture",
    icon: Activity,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    id: "unconscious",
    name: "Unconscious Victim",
    icon: Skull,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "cardiac",
    name: "Cardiac Arrest (CPR)",
    icon: HeartPulse,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

const LANGUAGES = [
  { code: "en-IN", name: "English" },
  { code: "ta-IN", name: "Tamil (தமிழ்)" },
  { code: "hi-IN", name: "Hindi (हिंदी)" },
  { code: "te-IN", name: "Telugu (తెలుగు)" },
  { code: "kn-IN", name: "Kannada (ಕನ್ನಡ)" },
  { code: "ml-IN", name: "Malayalam (മലയാളം)" },
  { code: "mr-IN", name: "Marathi (मराठी)" },
  { code: "bn-IN", name: "Bengali (বাংলা)" },
];

import { Incident } from "../types";

interface FirstAidResponse {
  title: string;
  instructions: string[];
  voice_prompt: string;
}

interface FirstAidAgentProps {
  currentLang?: string;
  activeIncident?: Incident | null;
}

export default function FirstAidAgent({
  currentLang,
  activeIncident,
}: FirstAidAgentProps) {
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);

  React.useEffect(() => {
    if (currentLang) {
      const matched = LANGUAGES.find((l) => l.code.startsWith(currentLang));
      if (matched) {
        setSelectedLang(matched);
      }
    }
  }, [currentLang]);

  const [activeEmergency, setActiveEmergency] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FirstAidResponse | null>(null);

  // Auto-correlate active incident injuries to first aid protocols
  React.useEffect(() => {
    if (activeIncident) {
      const desc = (activeIncident.description || "").toLowerCase();
      const injuries = (activeIncident.injuryTypes || []).map((i) =>
        i.toLowerCase(),
      );

      let matchedProtocol = "";
      if (
        desc.includes("cpr") ||
        desc.includes("cardiac") ||
        desc.includes("heart") ||
        desc.includes("breath") ||
        desc.includes("arrest") ||
        injuries.some(
          (i) =>
            i.includes("cpr") ||
            i.includes("cardiac") ||
            i.includes("arrest") ||
            i.includes("pulse"),
        )
      ) {
        matchedProtocol = "Cardiac Arrest (CPR)";
      } else if (
        injuries.some(
          (i) =>
            i.includes("bleed") ||
            i.includes("laceration") ||
            i.includes("blood"),
        ) ||
        desc.includes("bleed") ||
        desc.includes("blood")
      ) {
        matchedProtocol = "Severe Bleeding";
      } else if (
        injuries.some(
          (i) =>
            i.includes("head") ||
            i.includes("brain") ||
            i.includes("concussion") ||
            i.includes("spine") ||
            i.includes("neck"),
        ) ||
        desc.includes("head") ||
        desc.includes("brain") ||
        desc.includes("spine") ||
        desc.includes("neck")
      ) {
        matchedProtocol = "Head Injury";
      } else if (
        injuries.some(
          (i) =>
            i.includes("fracture") ||
            i.includes("bone") ||
            i.includes("broken"),
        ) ||
        desc.includes("fracture") ||
        desc.includes("bone") ||
        desc.includes("broken")
      ) {
        matchedProtocol = "Bone Fracture";
      } else if (
        injuries.some(
          (i) =>
            i.includes("burn") || i.includes("fire") || i.includes("smoke"),
        ) ||
        desc.includes("burn") ||
        desc.includes("fire") ||
        desc.includes("smoke")
      ) {
        matchedProtocol = "Severe Burns";
      } else if (
        activeIncident.severity === "Critical" ||
        desc.includes("unconscious") ||
        desc.includes("faint")
      ) {
        matchedProtocol = "Unconscious Victim";
      }

      if (matchedProtocol && matchedProtocol !== activeEmergency) {
        handleEmergencySelect(matchedProtocol);
      }
    }
  }, [activeIncident?.id]);

  const speakText = (text: string, langCode: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.9; // Slightly slower for emergency comprehension
    window.speechSynthesis.speak(utterance);
  };

  const handleEmergencySelect = async (emergencyName: string) => {
    setActiveEmergency(emergencyName);
    setLoading(true);
    setResult(null);
    window.speechSynthesis?.cancel();

    try {
      const res = await fetch("/api/first-aid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          condition: emergencyName,
          language: selectedLang.name,
        }),
      });
      const data: FirstAidResponse = await res.json();
      setResult(data);
      speakText(data.voice_prompt, selectedLang.code);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="firstaid-shell rounded-[2.5rem] p-8 flex flex-col gap-8 h-full min-h-[700px]">
      <div className="glass-reflection" />
      {/* Premium Information Panel / Status Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between breakthrough-card card-rose p-6 relative z-10 shadow-lg border border-pink-500/20 drop-shadow-[0_0_15px_rgba(236,72,153,0.15)]">
        <div>
          <span className="text-[10px] text-pink-400 font-black uppercase tracking-widest block mb-2 drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]">
            AI MEDICAL SURVIVAL CONSOLE
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <HeartPulse className="w-8 h-8 text-pink-500 drop-shadow-[0_0_12px_rgba(236,72,153,0.8)]" />
            accident Classification AI
          </h2>
          <p className="text-xs font-bold text-pink-100/60 mt-2">
            Select trauma type for immediate multilingual AI sorting
            instructions.
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center gap-4">
          <div className="bg-black/60 border border-pink-500/20 rounded-xl p-3 flex items-center gap-3 breakthrough-card card-purple">
            <Globe className="w-5 h-5 text-pink-500 relative z-20 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
            <div className="flex flex-col relative z-20">
              <label className="text-[9px] font-black text-pink-200/50 uppercase tracking-widest leading-none mb-1">
                Active Language
              </label>
              <select
                className="bg-transparent text-white text-xs focus:outline-none focus:ring-0 font-bold cursor-pointer appearance-none outline-none"
                value={selectedLang.code}
                onChange={(e) =>
                  setSelectedLang(
                    LANGUAGES.find((l) => l.code === e.target.value) ||
                      LANGUAGES[0],
                  )
                }
              >
                {LANGUAGES.map((l) => (
                  <option
                    key={l.code}
                    value={l.code}
                    className="bg-slate-900 text-white"
                  >
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-black/60 border border-pink-500/20 rounded-xl p-3 flex flex-col justify-center min-w-[120px] breakthrough-card card-purple">
            <span className="text-[9px] font-black text-pink-200/50 uppercase tracking-widest leading-none mb-1 relative z-20">
              System Status
            </span>
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 object-contain relative z-20 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse drop-shadow-[0_0_8px_rgba(34,211,238,1)]"></span>
              Telemetry Active
            </span>
          </div>
        </div>
      </div>

      {activeIncident && (
        <div className="bg-pink-950/20 border border-pink-500/20 p-4 rounded-3xl relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[9px] bg-pink-500/20 text-pink-300 font-mono font-black uppercase px-2.5 py-1 rounded-md border border-pink-500/30 tracking-widest leading-none">
              🚨 LIVE INCIDENT CORRELATION ACTIVE
            </span>
            <p className="text-xs text-pink-100/90 font-bold mt-2 font-sans">
              Incident ID:{" "}
              <span className="text-white font-mono">{activeIncident.id}</span>{" "}
              | Location:{" "}
              <span className="text-pink-200/70 font-medium">
                {activeIncident.location?.address}
              </span>
            </p>
          </div>
          <div className="text-[10px] uppercase font-mono text-pink-300/80 font-black bg-black/45 px-3 py-2 rounded-xl border border-pink-500/10 whitespace-nowrap">
            Auto-Loaded Protocol:{" "}
            <strong className="text-white font-sans font-bold text-xs uppercase pl-1">
              {activeEmergency || "Scanning description..."}
            </strong>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 relative z-10">
        {/* Left Panel: Emergency Selector */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest block pl-2 drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]">
            Containment Protocols
          </span>
          <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2 pb-4">
            {EMERGENCIES.map((em) => (
              <button
                key={em.id}
                onClick={() => handleEmergencySelect(em.name)}
                className={`breakthrough-card flex items-center gap-4 p-4 text-left group z-10 transition-all cursor-pointer ${
                  activeEmergency === em.name
                    ? "card-rosegold shadow-inner drop-shadow-[0_0_12px_rgba(244,114,182,0.2)]"
                    : "card-indigo border border-white/5 hover:border-purple-500/30"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 relative z-20 overflow-hidden ${activeEmergency === em.name ? "bg-black border border-pink-500/30" : "bg-black/40 border border-white/5 group-hover:border-purple-500/20"}`}
                >
                  {activeEmergency === em.name && (
                    <div className="absolute inset-0 bg-pink-500/20 mix-blend-screen blur-sm animate-pulse pointer-events-none" />
                  )}
                  <em.icon
                    className={`w-5 h-5 relative z-10 ${activeEmergency === em.name ? "text-pink-400 drop-shadow-[0_0_12px_rgba(244,114,182,0.9)]" : em.color}`}
                  />
                </div>
                <div className="relative z-20">
                  <div
                    className={`font-bold text-sm tracking-wide ${activeEmergency === em.name ? "text-white" : "text-purple-100/70 group-hover:text-white"}`}
                  >
                    {em.name}
                  </div>
                  <div
                    className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${activeEmergency === em.name ? "text-pink-300/80 drop-shadow-[0_0_8px_rgba(244,114,182,0.4)]" : "text-purple-200/40 group-hover:text-purple-300/60"}`}
                  >
                    {activeEmergency === em.name
                      ? "Active Protocol"
                      : "Select Protocol"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel: Active Instructions Timeline */}
        <div className="lg:col-span-8 breakthrough-card card-rosegold p-8 flex flex-col relative overflow-hidden shadow-inner border border-pink-500/10 drop-shadow-[0_0_15px_rgba(236,72,153,0.1)]">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-pink-400 space-y-6 relative z-20">
              <Loader2 className="w-12 h-12 animate-spin drop-shadow-[0_0_12px_rgba(244,114,182,0.8)]" />
              <div className="font-mono text-sm tracking-widest animate-pulse font-black uppercase drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]">
                Generating Protocol...
              </div>
            </div>
          ) : result ? (
            <div className="flex-1 flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto custom-scrollbar pr-2 relative z-20">
              <div className="flex items-start justify-between mb-8 pb-6 border-b border-pink-500/20">
                <div className="pr-6">
                  <span className="inline-block px-3 py-1 bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px] font-black uppercase tracking-widest rounded-lg mb-4 drop-shadow-[0_0_8px_rgba(244,114,182,0.4)]">
                    Step-by-Step Guidance
                  </span>
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-[0_0_12px_rgba(244,114,182,0.6)]">
                    {result.title}
                  </h1>
                </div>

                <button
                  onClick={() =>
                    speakText(result.voice_prompt, selectedLang.code)
                  }
                  className="w-14 h-14 bg-black/60 hover:bg-black text-pink-400 border border-pink-500/40 rounded-2xl flex items-center justify-center transition-all duration-300 flex-shrink-0 group shadow-[0_0_20px_rgba(236,72,153,0.3)] relative z-20"
                >
                  <Volume2 className="w-6 h-6 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]" />
                </button>
              </div>

              <div className="space-y-4 flex-1 relative before:absolute before:inset-y-0 before:left-[23px] before:w-px before:bg-gradient-to-b before:from-pink-500/60 before:to-transparent">
                {result.instructions.map((step, index) => (
                  <div
                    key={index}
                    className="relative flex gap-6 pl-[54px] py-2 items-start"
                  >
                    <div className="absolute left-[8px] top-3 w-8 h-8 rounded-full bg-black border border-pink-500/60 flex flex-shrink-0 items-center justify-center text-xs font-black text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.6)] z-10">
                      {index + 1}
                    </div>
                    <div className="breakthrough-card card-rose transition-colors p-5 flex-1 shadow-sm border border-pink-500/20">
                      <p className="text-sm md:text-base text-white/90 leading-relaxed font-bold tracking-wide">
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Survival Recommendations Panel */}
              <div
                id="survival-recommendations"
                className="mt-8 p-6 bg-pink-955/20 border border-pink-500/20 rounded-3xl relative overflow-hidden"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-pink-500" />
                <span className="text-[10px] text-pink-400 font-extrabold uppercase tracking-widest block mb-2 font-mono">
                  🛡️ AI Medical Survival Recommendations
                </span>
                <div className="text-xs text-white/50 block font-black uppercase tracking-wider mb-2">
                  {(() => {
                    const norm = (activeEmergency || "").toLowerCase();
                    if (norm.includes("bleed"))
                      return "CRITICAL HEMORRHAGE EXTREMITY THREAT";
                    if (norm.includes("burn"))
                      return "THERMAL EPIDERMAL DESTRUCTION PROFILE";
                    if (norm.includes("cpr") || norm.includes("cardiac"))
                      return "SUDDEN VENTRICULAR COLLAPSE PROFILE";
                    if (
                      norm.includes("head") ||
                      norm.includes("brain") ||
                      norm.includes("spine")
                    )
                      return "CERVICAL SPINAL MASS TRUNCATION THREAT";
                    if (norm.includes("fracture") || norm.includes("bone"))
                      return "COMPOUND DISLOCATION INTERNAL LERATION THREAT";
                    return "ACUTE NEUROLOGICAL UNRESPONSIVENESS RATING";
                  })()}
                </div>
                <p className="text-xs text-pink-100/90 leading-relaxed font-bold font-sans">
                  {(() => {
                    const norm = (activeEmergency || "").toLowerCase();
                    if (norm.includes("bleed")) {
                      return "Hemorrhage survival is highly time-critical. Maintain continuous, unwavering direct pressure; do not pull away or lift the primary dressing layers to inspect the clotting state, as this will break critical platelet mesh structures.";
                    }
                    if (norm.includes("burn")) {
                      return "Absolutely avoid applying high-impact direct ice, fat, or butter layers, as intense vasoconstriction will aggravate deep dermal tissue death. Cover loosely with sterile film to insulate nerve endings.";
                    }
                    if (norm.includes("cpr") || norm.includes("cardiac")) {
                      return "Chest compressions preserve blood-oxygen saturation. Ensure complete chest physical recoil back to normal height between cycles to maximize cardiac output. Target 100-120 compressions per minute.";
                    }
                    if (
                      norm.includes("head") ||
                      norm.includes("brain") ||
                      norm.includes("spine")
                    ) {
                      return "Always assume extreme chemical hazard. Prevent any physical contact. Manually enforce distance until compliance teams place a barricade.";
                    }
                    if (norm.includes("fracture") || norm.includes("bone")) {
                      return "Never try to pull, realign, or push protruding bone fragments back beneath the skin. Immobilize the limb splint extending past adjacent joint lines to arrest structural articulation and vascular damage.";
                    }
                    return "Place the casualty promptly into the side-lying recovery position to secure the airway from saliva, drainage, or tongue blockage. Keep monitoring chest rise and respiratory rates consistently.";
                  })()}
                </p>
              </div>

              <div className="mt-6 p-5 bg-black/40 text-pink-200 border border-pink-500/20 rounded-xl flex gap-4 items-start shadow-inner">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-pink-400" />
                <p className="leading-relaxed font-bold text-[11px] text-pink-100/70">
                  These instructions are AI-generated for Highway/Police trauma
                  guidance. Do not delay seeking professional hazardous material
                  response. Ensure a smart fleet is dispatched.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center h-full relative z-20">
              <div className="w-24 h-24 rounded-full bg-pink-500/5 border border-pink-500/20 flex items-center justify-center mb-6">
                <ShieldAlert className="w-10 h-10 text-pink-500/40 drop-shadow-[0_0_12px_rgba(236,72,153,0.3)]" />
              </div>
              <p className="text-lg font-black tracking-widest text-white/80 uppercase drop-shadow-[0_0_8px_rgba(244,114,182,0.4)]">
                Awaiting Selection
              </p>
              <p className="text-xs mt-3 text-center max-w-xs font-bold text-pink-200/50 leading-relaxed">
                Select a trauma type from the left to generate segregation
                protocols. The system is standing by.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
