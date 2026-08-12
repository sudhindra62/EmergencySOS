/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Settings,
  Shield,
  Globe,
  Lock,
  Key,
  Smartphone,
  HardDrive,
  TestTube,
  CheckCircle,
  Activity
} from "lucide-react";
import { useGuardianCore } from "../guardian/GuardianCore";

export default function SettingsPanel() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaved, setIsSaved] = useState(false);
  const { impactSensitivity, setImpactSensitivity, currentActivityLevel } = useGuardianCore();

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="breakthrough-shell large-panel rounded-[3.5rem] flex flex-col pt-10">
      {/* Sidebar Navigation - Hidden per user request but kept in project */}
      <div className="hidden">
        <button
          onClick={() => setActiveTab("general")}
          className={`settings-nav-item flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold tracking-wide ${activeTab === "general" ? "active text-white" : "text-purple-200/50 hover:text-white"}`}
        >
          <Settings
            className={`w-5 h-5 ${activeTab === "general" ? "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" : ""}`}
          />{" "}
          System General
        </button>
        <button
          onClick={() => setActiveTab("routing")}
          className={`settings-nav-item flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold tracking-wide ${activeTab === "routing" ? "active text-white" : "text-purple-200/50 hover:text-white"}`}
        >
          <Globe
            className={`w-5 h-5 ${activeTab === "routing" ? "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" : ""}`}
          />{" "}
          Triage & Routing
        </button>
        <button
          onClick={() => setActiveTab("integrations")}
          className={`settings-nav-item flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold tracking-wide ${activeTab === "integrations" ? "active text-white" : "text-purple-200/50 hover:text-white"}`}
        >
          <HardDrive
            className={`w-5 h-5 ${activeTab === "integrations" ? "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" : ""}`}
          />{" "}
          Integrations API
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative z-10 breakthrough-card card-gold p-8 md:p-12 shadow-inner !rounded-[2.5rem]">
        {activeTab === "general" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h3 className="text-2xl font-black text-amber-500 mb-2 tracking-tight drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                General Platform Settings
              </h3>
              <p className="text-sm text-amber-200/60 font-medium">
                Configure global parameters for the dispatch console.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest pl-1">
                  Platform Locale
                </label>
                <select className="w-full bg-black/80 border border-amber-500/20 rounded-2xl px-6 py-4 text-sm font-bold text-amber-100 focus:outline-none focus:border-amber-500 shadow-inner appearance-none cursor-pointer hover:border-amber-500/50 transition-colors">
                  <option>English (IN)</option>
                  <option>Hindi / हिंदी</option>
                  <option>Tamil / தமிழ்</option>
                  <option>Kannada / ಕನ್ನಡ</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest pl-1">
                  Theme Mode
                </label>
                <select className="w-full bg-black/80 border border-amber-500/20 rounded-2xl px-6 py-4 text-sm font-bold text-amber-100 focus:outline-none focus:border-amber-500 shadow-inner appearance-none cursor-pointer hover:border-amber-500/50 transition-colors">
                  <option>System Default</option>
                  <option>Dark Console (Active)</option>
                  <option>High Contrast Kiosk</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-6 breakthrough-card card-gold z-10 transition-colors">
                <div>
                  <h4 className="text-amber-400 font-bold text-base drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]">
                    Offline First Analytics
                  </h4>
                  <p className="text-xs text-amber-200/50 mt-1 font-medium">
                    Collect anonymous data during offline SMS hash syncing.
                  </p>
                </div>
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input
                    type="checkbox"
                    name="toggle"
                    id="toggle1"
                    defaultChecked
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-black border-4 border-slate-900 appearance-none cursor-pointer checked:right-0 checked:border-amber-500 checked:bg-amber-400 transition-all z-10 top-0 left-0"
                  />
                  <label
                    htmlFor="toggle1"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-black border border-amber-500/20 cursor-pointer"
                  ></label>
                </div>
              </div>

              <div className="p-6 breakthrough-card card-gold z-10 transition-colors flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-amber-400 font-bold text-base drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]">
                      Impact Sensor Sensitivity
                    </h4>
                    <p className="text-xs text-amber-200/50 mt-1 font-medium max-w-[80%]">
                      Adjust G-Force response threshold. Lower is less sensitive (requires harder impact).
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-black/40 border border-amber-500/10">
                    <Activity className={`w-5 h-5 ${currentActivityLevel > 95 ? 'text-red-500 max-animate-shake' : 'text-amber-400/50'}`} />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-amber-500/40 uppercase tracking-widest">Low</span>
                  <input
                    type="range"
                    min="0.2"
                    max="3.0"
                    step="0.1"
                    value={impactSensitivity}
                    onChange={(e) => setImpactSensitivity(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-black/80 rounded-lg appearance-none cursor-pointer accent-amber-500 border border-amber-500/20"
                  />
                  <span className="text-[10px] font-black text-amber-500/40 uppercase tracking-widest">High</span>
                </div>

                {/* Real-time Activity Meter */}
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between w-full">
                    <span className="text-[9px] font-bold text-amber-200/40 uppercase tracking-widest">Live Sensor Output</span>
                    <span className="text-[9px] font-bold text-red-400/80 uppercase tracking-widest">Crash Threshold</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden relative border border-white/5">
                    {/* Activity Bar Fill */}
                    <div 
                      className={`h-full transition-all duration-100 ${currentActivityLevel >= 100 ? 'bg-red-500' : 'bg-amber-400/40'}`}
                      style={{ width: `${Math.min(100, currentActivityLevel)}%` }}
                    />
                    {/* Exceeding Bar Fill (if over 100%) */}
                    {currentActivityLevel > 100 && (
                      <div 
                        className="absolute top-0 left-0 h-full bg-red-400 animate-pulse"
                        style={{ width: `${Math.min(100, currentActivityLevel - 100)}%` }}
                      />
                    )}
                    {/* The 100% Threshold Line */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                      <div className="absolute right-0 top-0 h-full w-[2px] bg-red-500/80" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "routing" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
                Triage & Routing configuration
              </h3>
              <p className="text-sm text-purple-200/60 font-medium">
                Manage rules for hospital bed discoveries and fleet dispatch
                overrides.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-purple-200/40 uppercase tracking-widest pl-1">
                  Base Radius Range (km)
                </label>
                <input
                  type="number"
                  defaultValue="15"
                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-cyan-400 shadow-inner hover:border-purple-500/30 transition-colors"
                />
              </div>

              <div className="flex items-center justify-between p-6 breakthrough-card card-indigo z-10 transition-colors">
                <div>
                  <h4 className="text-white font-bold text-base">
                    Escalation Bypass (Private Fleet)
                  </h4>
                  <p className="text-xs text-purple-200/50 mt-1 font-medium">
                    Auto-ping corporate hospitals if no Gov ALS units available.
                  </p>
                </div>
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input
                    type="checkbox"
                    name="toggle"
                    id="toggle2"
                    defaultChecked
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-slate-900 appearance-none cursor-pointer checked:right-0 checked:border-cyan-400 transition-all z-10 top-0 left-0"
                  />
                  <label
                    htmlFor="toggle2"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-black border border-white/10 cursor-pointer"
                  ></label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Similar tabs for Security / Integrations can be fleshed out quickly */}
        {activeTab === "integrations" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
                Service API Integrations
              </h3>
              <p className="text-sm text-purple-200/60 font-medium">
                Manage 3rd party connections (Twilio, Firebase, PostGIS).
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-6 breakthrough-card card-rose z-10 space-y-4 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <Key className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />{" "}
                  <span className="font-black text-sm text-white uppercase tracking-widest">
                    Gemini AI Key
                  </span>
                </div>
                <input
                  type="password"
                  defaultValue="*************************"
                  className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white opacity-50 cursor-not-allowed"
                  disabled
                />
                <button className="text-xs text-cyan-400 font-bold uppercase tracking-widest hover:text-cyan-300 transition-colors">
                  Rotate Key
                </button>
              </div>

              <div className="p-6 breakthrough-card card-rose z-10 space-y-4 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <Smartphone className="w-5 h-5 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />{" "}
                  <span className="font-black text-sm text-white uppercase tracking-widest">
                    Twilio SMS Webhook
                  </span>
                </div>
                <input
                  type="text"
                  defaultValue="https://api.RoadGuardian.in/v1/sms/callback"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-purple-300 focus:outline-none focus:border-cyan-400 shadow-inner"
                />
                <button className="text-[11px] bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg flex w-fit items-center gap-2 font-bold text-white transition-colors">
                  <TestTube className="w-3.5 h-3.5 text-purple-400" /> Test
                  Connection
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-end gap-4 relative z-10">
          <button className="px-6 py-3.5 border border-white/10 text-white text-sm font-bold rounded-xl hover:bg-white/5 transition-colors tracking-wide">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-900 border border-amber-400 text-sm font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2"
          >
            {isSaved ? (
              <>
                <CheckCircle className="w-5 h-5" /> Saved
              </>
            ) : (
              "Save Configuration"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
