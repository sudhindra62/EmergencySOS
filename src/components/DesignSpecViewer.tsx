/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Palette,
  Layout,
  MousePointerClick,
  Zap,
  Smartphone,
  Map,
  Settings,
  ShieldAlert,
  WifiOff,
  FileText,
  Component,
} from "lucide-react";

interface SpecSection {
  id: string;
  title: string;
  icon: any;
  content: React.ReactNode;
}

export default function DesignSpecViewer() {
  const [activeTab, setActiveTab] = useState<string>("philosophy");

  const sections: SpecSection[] = [
    {
      id: "philosophy",
      title: "Design Philosophy",
      icon: Palette,
      content: (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur">
            <h4 className="text-blue-400 font-bold text-lg mb-2 tracking-tight">
              VISUAL LANGUAGE & AESTHETIC
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Inspired by Apple (Clarity), Tesla (Automotive HUD minimalism),
              Linear (Keyboard-first speed), and Stripe (Precision execution).
              The system utilizes a <strong>Deep Dark Mode</strong> combined
              with <strong>Modern Glassmorphism</strong> (frosted glass panels
              over atmospheric backgrounds) to reduce eye strain for night-shift
              responders while maintaining depth.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-5">
              <div className="p-4 rounded-lg bg-[#0F172A] border border-slate-800 flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full bg-[#0F172A] shadow-[0_0_15px_rgba(15,23,42,0.5)] border border-slate-700 mb-2"></div>
                <span className="text-[10px] font-bold text-white uppercase">
                  Primary Base
                </span>
                <span className="text-[9px] font-mono text-slate-500">
                  #0F172A (Deep Slate)
                </span>
              </div>
              <div className="p-4 rounded-lg bg-[#0F172A] border border-slate-800 flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full bg-[#F43F5E] shadow-[0_0_15px_rgba(244,63,94,0.5)] mb-2"></div>
                <span className="text-[10px] font-bold text-white uppercase">
                  Emergency Accent
                </span>
                <span className="text-[9px] font-mono text-slate-500">
                  #F43F5E (Rose/Red)
                </span>
              </div>
              <div className="p-4 rounded-lg bg-[#0F172A] border border-slate-800 flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full bg-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.5)] mb-2"></div>
                <span className="text-[10px] font-bold text-white uppercase">
                  Triage Success
                </span>
                <span className="text-[9px] font-mono text-slate-500">
                  #10B981 (Emerald)
                </span>
              </div>
              <div className="p-4 rounded-lg bg-[#0F172A] border border-slate-800 flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full bg-[#F59E0B] shadow-[0_0_15px_rgba(245,158,11,0.5)] mb-2"></div>
                <span className="text-[10px] font-bold text-white uppercase">
                  Hazard Indicator
                </span>
                <span className="text-[9px] font-mono text-slate-500">
                  #F59E0B (Amber)
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "landing",
      title: "1. Landing Page",
      icon: Layout,
      content: (
        <div className="space-y-4 text-sm text-slate-300">
          <h4 className="text-white font-bold flex items-center gap-2">
            <Layout className="w-4 h-4 text-blue-400" /> Layout & Components
          </h4>
          <p>
            Full-width cinematic canvas. Minimalist header. Features a hero
            section centering a massive, glass-layered "TRIGGER SOS" button.
          </p>
          <h4 className="text-white font-bold flex items-center gap-2 mt-4">
            <MousePointerClick className="w-4 h-4 text-blue-400" /> UX &
            Microinteractions
          </h4>
          <p>
            <strong>Zero learning curve.</strong> In an emergency, vision
            narrows. The CTA must be unmistakably clear. Hovering on the SOS
            button accelerates a subtle heartbeat pulse animation.
          </p>
          <h4 className="text-white font-bold flex items-center gap-2 mt-4">
            <Zap className="w-4 h-4 text-blue-400" /> User Flow
          </h4>
          <p className="font-mono text-xs bg-slate-900/50 p-2 rounded">
            User lands → Hits SOS → Location captured instantly → Routes to
            Voice AI Assistant.
          </p>
        </div>
      ),
    },
    {
      id: "console",
      title: "2. Emergency Console",
      icon: Component,
      content: (
        <div className="space-y-4 text-sm text-slate-300">
          <h4 className="text-white font-bold flex items-center gap-2">
            <Layout className="w-4 h-4 text-blue-400" /> Layout & Components
          </h4>
          <p>
            Bento-grid dashboard (Linear-inspired). No-scroll viewport. Global
            stat headers, Incident Queue (left), and Active Coordination Hub
            (center).
          </p>
          <h4 className="text-white font-bold flex items-center gap-2 mt-4">
            <MousePointerClick className="w-4 h-4 text-blue-400" /> UX &
            Microinteractions
          </h4>
          <p>
            Dispatchers must consume massive amounts of data concurrently.
            Click-to-copy on GPS coordinates. Progress bars for ambulance ETA
            smooth-fill.
          </p>
        </div>
      ),
    },
    {
      id: "assistant",
      title: "3. AI Assistant (SOS)",
      icon: Smartphone,
      content: (
        <div className="space-y-4 text-sm text-slate-300">
          <h4 className="text-white font-bold flex items-center gap-2">
            <Layout className="w-4 h-4 text-blue-400" /> Layout & Components
          </h4>
          <p>
            Single-column dictation modal. Massive "Voice Dictation" microphone
            orb. Camera drop-zone. Real-time transcription feed.
          </p>
          <h4 className="text-white font-bold flex items-center gap-2 mt-4">
            <MousePointerClick className="w-4 h-4 text-blue-400" /> UX &
            Microinteractions
          </h4>
          <p>
            Typing with shaking hands is difficult. Voice-first design ensures
            fidelity. Audio visualizer waves react to input volume. Text types
            out naturally as AI transcribes.
          </p>
        </div>
      ),
    },
    {
      id: "dashboard",
      title: "4. Live Dashboard",
      icon: ShieldAlert,
      content: (
        <div className="space-y-4 text-sm text-slate-300">
          <h4 className="text-white font-bold flex items-center gap-2">
            <Layout className="w-4 h-4 text-blue-400" /> Layout & Components
          </h4>
          <p>
            Split-screen telemetry. 10-Agent network deliberation graph, map
            overlay, and step-by-step resolution timeline.
          </p>
          <h4 className="text-white font-bold flex items-center gap-2 mt-4">
            <MousePointerClick className="w-4 h-4 text-blue-400" /> UX &
            Microinteractions
          </h4>
          <p>
            Builds trust by exposing the "thought process" structurally. Nodes
            pulse when an agent is processing. Map displays live vehicle
            tracking dynamically.
          </p>
        </div>
      ),
    },
    {
      id: "map",
      title: "5. Risk Prediction Map",
      icon: Map,
      content: (
        <div className="space-y-4 text-sm text-slate-300">
          <h4 className="text-white font-bold flex items-center gap-2">
            <Layout className="w-4 h-4 text-blue-400" /> Layout & Components
          </h4>
          <p>
            Immersive geographic interface. Heatmap layers (Fog, Rain), Black
            Spot index, dynamic sliders for time-of-day predictions.
          </p>
          <h4 className="text-white font-bold flex items-center gap-2 mt-4">
            <MousePointerClick className="w-4 h-4 text-blue-400" /> UX &
            Microinteractions
          </h4>
          <p>
            Enables proactive deployment. Pre-position units near high-risk
            zones based on climate APIs. Fast, rich tooltips fade in on hovering
            zones.
          </p>
        </div>
      ),
    },
    {
      id: "offline",
      title: "9. Offline Mode",
      icon: WifiOff,
      content: (
        <div className="space-y-4 text-sm text-slate-300">
          <h4 className="text-white font-bold flex items-center gap-2">
            <Layout className="w-4 h-4 text-blue-400" /> Layout & Components
          </h4>
          <p>
            Ultra high-contrast, card-based manual. Signal warning indicator.
            Graphic CPR instructions. SMS Telegram payload encoder
            (`RG#SOS...`).
          </p>
          <h4 className="text-white font-bold flex items-center gap-2 mt-4">
            <MousePointerClick className="w-4 h-4 text-blue-400" /> UX Rationale
            & Flow
          </h4>
          <p>
            Relies entirely on cached SVGs and local copy-to-clipboard
            functionality to bridge connection gaps. <br /> <br />
            <span className="font-mono text-xs bg-slate-900/50 p-2 rounded">
              Internet Drops → Detects 0 Network → Routes to Offline Mode →
              Copies SMS Payload to local dialer
            </span>
          </p>
        </div>
      ),
    },
  ];

  const activeSection = sections.find((s) => s.id === activeTab) || sections[0];

  return (
    <div className="flex flex-col lg:flex-row gap-6 bg-[#0B1120] text-slate-100 p-6 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Slide Navigation */}
      <div className="w-full lg:w-1/3 flex flex-col gap-2 relative z-10 border-r border-slate-800/60 pr-4">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-black text-sm tracking-widest">
              UI/UX SPECIFICATION
            </h3>
          </div>
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mt-1">
            RoadGuardian INTERFACE ARCHITECTURE
          </span>
        </div>

        <div className="space-y-1">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = sec.id === activeTab;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveTab(sec.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-blue-500/10 border border-blue-500/30 text-blue-400 shadow-sm"
                    : "border border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-500"}`}
                />
                <span className="font-medium text-xs tracking-wide">
                  {sec.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Content Desk */}
      <div className="flex-1 p-6 rounded-xl bg-slate-900/30 border border-slate-800 relative z-10">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <h2 className="text-white font-extrabold text-lg tracking-tight flex items-center gap-2">
            {React.createElement(activeSection.icon, {
              className: "w-5 h-5 text-blue-400",
            })}
            {activeSection.title}
          </h2>
          <span className="bg-blue-950/60 border border-blue-800/60 text-blue-400 text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded">
            SPEC DOC
          </span>
        </div>

        <div className="flex-1">{activeSection.content}</div>
      </div>
    </div>
  );
}
