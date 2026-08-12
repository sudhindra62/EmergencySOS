/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Shield,
  MessageSquare,
  Copy,
  ClipboardCheck,
  Phone,
  Signal,
  SignalZero,
  Eye,
  HeartPulse,
  Activity,
  Bone,
  Info,
} from "lucide-react";
import { OFFLINE_FIRST_AID_TOPICS } from "../mockData";
import { Incident } from "../types";

export default function OfflineEmergencyKit({
  activeIncident,
}: {
  activeIncident?: Incident | null;
}) {
  const [activeTopicId, setActiveTopicId] = useState<string>("fa-bleeding");
  const [offlineSeverity, setOfflineSeverity] = useState<string>("Critical");
  const [offlineVictims, setOfflineVictims] = useState<number>(2);
  const [offlineHazmat, setOfflineHazmat] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Generate dynamic coordinates simulating standard highway milestone GPS
  const [gpsMock, setGpsMock] = useState({ lat: "13.0382", lng: "80.1544" });

  React.useEffect(() => {
    if (activeIncident) {
      setOfflineSeverity(activeIncident.severity || "Critical");
      setOfflineVictims(activeIncident.victimsCount || 1);
      setOfflineHazmat(activeIncident.hazmat || false);
      if (activeIncident.location) {
        setGpsMock({
          lat: activeIncident.location.lat.toFixed(4),
          lng: activeIncident.location.lng.toFixed(4),
        });
      }

      const injuries = (activeIncident.injuryTypes || []).map((i) =>
        i.toLowerCase(),
      );
      const desc = (activeIncident.description || "").toLowerCase();
      if (
        injuries.some((i) => i.includes("bleed") || i.includes("laceration")) ||
        desc.includes("bleed")
      ) {
        setActiveTopicId("fa-bleeding");
      } else if (
        injuries.some(
          (i) =>
            i.includes("unconscious") ||
            i.includes("breath") ||
            i.includes("cpr"),
        ) ||
        desc.includes("unconscious") ||
        desc.includes("pulse")
      ) {
        setActiveTopicId("fa-unconscious");
      } else if (
        injuries.some(
          (i) =>
            i.includes("spine") || i.includes("neck") || i.includes("back"),
        ) ||
        desc.includes("spine") ||
        desc.includes("motorcycle")
      ) {
        setActiveTopicId("fa-spine");
      }
    }
  }, [activeIncident?.id]);

  const activeTopic =
    OFFLINE_FIRST_AID_TOPICS.find((t) => t.id === activeTopicId) ||
    OFFLINE_FIRST_AID_TOPICS[0];

  // Logic to synthesize the high-density lowbandwidth SMS telemetry string
  const generateSmsCompressWord = () => {
    const sevCode = offlineSeverity.charAt(0).toUpperCase(); // C, S, M, M
    const hazCode = offlineHazmat ? "1" : "0";
    const cleanLat = parseFloat(gpsMock.lat).toFixed(4);
    const cleanLng = parseFloat(gpsMock.lng).toFixed(4);

    // Structure: ECO_SOS#<SEV>|<VICTIMS_COUNT>|<HAZMAT_FLAG>|<LAT>,<LNG>
    return `ECO_SOS#${sevCode}|V${offlineVictims}|H${hazCode}|L${cleanLat},${cleanLng}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateSmsCompressWord());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case "HeartPulse":
        return <HeartPulse className="w-5 h-5 text-rose-500" />;
      case "Activity":
        return <Activity className="w-5 h-5 text-amber-500" />;
      case "Bone":
        return <Bone className="w-5 h-5 text-amber-600" />;
      default:
        return <Shield className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="offline-shell large-panel rounded-[3.5rem] mb-8 group/offline">
      <div className="glass-reflection" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-6 mb-8 relative z-10">
        <div>
          <h3 className="text-white font-black text-2xl tracking-wider flex items-center gap-3 drop-shadow-md">
            <SignalZero className="w-8 h-8 text-amber-500 animate-pulse drop-shadow-[0_0_15px_rgba(255,176,0,0.6)]" />
            OFFLINE accident PROTOCOLS CORE
          </h3>
          <p className="text-sm text-amber-100/60 mt-1 font-bold">
            Local browser accident management indexing and ultra-compact SMS
            telemetry synthesis for cellular deadzones.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2 bg-orange-950/20 border border-orange-500/30 px-4 py-2 rounded-xl text-xs text-orange-200 shadow-inner">
          <Signal className="w-4 h-4 animate-pulse text-amber-400" />
          <span className="font-bold">
            Active Connection: Cellular Black-out
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-0 relative z-10 bg-black/20 border border-white/5 rounded-[2.5rem] overflow-hidden">
        {/* Left: Offline Protocol Guides Selector */}
        <div className="lg:w-[380px] border-r border-white/5 bg-black/40 flex flex-col h-[700px]">
          <div className="p-6 border-b border-white/5">
            <span className="text-xs text-amber-200/80 font-black uppercase tracking-widest block drop-shadow-sm">
              🚑 LOCAL DIGITAL MANUAL INDEX
            </span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {OFFLINE_FIRST_AID_TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setActiveTopicId(topic.id)}
                className={`w-full p-6 border-b border-white/5 text-left transition-all duration-300 flex flex-col gap-3 cursor-pointer relative group ${
                  activeTopicId === topic.id
                    ? "bg-gradient-to-r from-amber-500/10 to-transparent"
                    : "hover:bg-white/5"
                }`}
              >
                {activeTopicId === topic.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 shadow-[0_0_15px_rgba(255,176,0,0.8)]"></div>
                )}
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2.5 rounded-xl border ${activeTopicId === topic.id ? "bg-black/50 border-amber-500/30 text-amber-400" : "bg-black/40 border-white/10 group-hover:border-amber-400/20 text-amber-200/50"}`}
                  >
                    {getTopicIcon(topic.icon)}
                  </div>
                  <h5
                    className={`font-bold text-sm tracking-wide ${activeTopicId === topic.id ? "text-white" : "text-amber-100/70"}`}
                  >
                    {topic.title}
                  </h5>
                </div>
                <p className="text-xs text-amber-200/50 font-medium leading-relaxed pl-[3.25rem]">
                  {topic.description}
                </p>
              </button>
            ))}
          </div>
          <div className="p-6 bg-black/50 border-t border-white/5">
            <h4 className="text-white text-xs font-black flex items-center gap-2 mb-2 uppercase tracking-widest drop-shadow-sm">
              <Info className="w-4 h-4 text-amber-400" />
              About Offgrid Manuals
            </h4>
            <p className="text-[10px] text-amber-200/50 leading-relaxed font-bold">
              Compiled statically on local state. Fully interactive without
              network connectivity.
            </p>
          </div>
        </div>

        {/* Right: Selected Offline Topic details & Compact SMS Desk */}
        <div className="flex-1 flex flex-col h-[700px] overflow-y-auto custom-scrollbar">
          {/* Active Topic Detail Pane */}
          <div className="p-8 md:p-12 border-b border-white/5">
            <div className="mb-10">
              <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest rounded-lg mb-4">
                Offline Triage Protocol
              </span>
              <h4 className="text-white font-black text-3xl md:text-4xl tracking-tight drop-shadow-md">
                {activeTopic.title}
              </h4>
            </div>

            <div className="space-y-6 max-w-3xl offline-instruction-panel p-6 rounded-2xl border border-amber-500/10">
              {activeTopic.steps.map((st, sIdx) => (
                <div key={sIdx} className="flex gap-6 group">
                  <span className="offline-step-indicator shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center font-black font-mono text-sm group-hover:border-amber-400/50 transition-colors">
                    {sIdx + 1}
                  </span>
                  <p className="text-amber-50/90 font-medium text-lg leading-relaxed pt-1.5">
                    {st}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Compressed SMS Tool block */}
          <div className="p-8 md:p-12 bg-black/20">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              <h4 className="text-white font-black text-sm uppercase tracking-widest drop-shadow-sm">
                HIGH-COMPRESSION TELEMETRY SMS ENCODER
              </h4>
            </div>

            <p className="text-sm text-amber-200/60 leading-relaxed mb-8 font-medium max-w-3xl">
              Encode vital parameters into a short micro-telegram. Transmit as a
              standard SMS to <strong className="text-white">112</strong> if
              internet is down.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mb-8">
              <div>
                <span className="text-xs text-amber-200/50 block mb-2 uppercase font-black tracking-wider">
                  Severity
                </span>
                <select
                  value={offlineSeverity}
                  onChange={(e) => setOfflineSeverity(e.target.value)}
                  className="w-full text-sm font-bold bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 text-white shadow-inner appearance-none"
                >
                  <option value="Critical">Critical</option>
                  <option value="Severe">Severe</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Minor">Minor</option>
                </select>
              </div>

              <div>
                <span className="text-xs text-amber-200/50 block mb-2 uppercase font-black tracking-wider">
                  Victims
                </span>
                <input
                  type="number"
                  value={offlineVictims}
                  onChange={(e) =>
                    setOfflineVictims(
                      Math.max(1, parseInt(e.target.value) || 1),
                    )
                  }
                  className="w-full text-sm font-bold bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 text-white shadow-inner font-mono text-center"
                  min="1"
                />
              </div>

              <div>
                <span className="text-xs text-amber-200/50 block mb-2 uppercase font-black tracking-wider">
                  Hazmat
                </span>
                <select
                  value={offlineHazmat ? "1" : "0"}
                  onChange={(e) => setOfflineHazmat(e.target.value === "1")}
                  className="w-full text-sm font-bold bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 text-white shadow-inner appearance-none"
                >
                  <option value="1">Hazardous / EV</option>
                  <option value="0">Standard Crash</option>
                </select>
              </div>

              <div>
                <span className="text-xs text-amber-200/50 block mb-2 uppercase font-black tracking-wider">
                  Milestone GPS
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={gpsMock.lat}
                    onChange={(e) =>
                      setGpsMock((prev) => ({ ...prev, lat: e.target.value }))
                    }
                    className="w-1/2 text-xs font-bold bg-black/50 border border-white/10 rounded-xl px-2 py-3 text-center text-white focus:outline-none focus:border-amber-400 shadow-inner font-mono"
                    placeholder="Lat"
                  />
                  <input
                    type="text"
                    value={gpsMock.lng}
                    onChange={(e) =>
                      setGpsMock((prev) => ({ ...prev, lng: e.target.value }))
                    }
                    className="w-1/2 text-xs font-bold bg-black/50 border border-white/10 rounded-xl px-2 py-3 text-center text-white focus:outline-none focus:border-amber-400 shadow-inner font-mono"
                    placeholder="Lng"
                  />
                </div>
              </div>
            </div>

            {/* Generated Code Block */}
            <div className="flex flex-col sm:flex-row items-center justify-between bg-black/60 border border-white/5 p-5 rounded-2xl max-w-4xl gap-6">
              <div className="min-w-0 w-full overflow-hidden">
                <span className="text-[10px] font-mono text-amber-200/40 block font-black mb-2 uppercase tracking-widest">
                  GSM PAYLOAD
                </span>
                <p className="text-xl font-mono text-amber-400 truncate tracking-widest font-black drop-shadow-sm">
                  {generateSmsCompressWord()}
                </p>
              </div>
              <button
                onClick={copyToClipboard}
                className={`shrink-0 px-8 py-3.5 rounded-xl text-sm font-bold font-mono transition-all duration-300 flex items-center justify-center gap-3 uppercase cursor-pointer ${
                  copied
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-white/10 hover:bg-amber-500/20 text-white hover:text-amber-400 border border-white/10 hover:border-amber-500/30"
                }`}
              >
                {copied ? (
                  <>
                    <ClipboardCheck className="w-5 h-5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 text-amber-400" /> Copy Code
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
