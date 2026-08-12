/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Shield,
  Target,
  Users,
  Landmark,
  TrendingUp,
  Sparkles,
  Server,
  Zap,
  HelpCircle,
} from "lucide-react";

interface PRDSection {
  id: string;
  title: string;
  icon: any;
  content: React.ReactNode;
}

export default function PRDViewer() {
  const [activeTab, setActiveTab] = useState<string>("personas");

  const sections: PRDSection[] = [
    {
      id: "personas",
      title: "User Personas & Journeys",
      icon: Users,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 breakthrough-card card-emerald z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                <span className="text-amber-400 drop-shadow-[0_0_8px_rgba(255,176,0,0.8)] font-bold text-sm">
                  PERSONA 1: Aditya (Citizen Reporter)
                </span>
              </div>
              <p className="text-amber-50/80 text-xs italic mb-2">
                "I was walking near the riverbank when I saw a massive pile of
                leaking battery accident. I didn't know who to call or how
                dangerous it was."
              </p>
              <p className="text-amber-200/50 text-xs leading-relaxed">
                <strong className="text-white">Journey:</strong> Reports trauma
                via voice on RoadGuardian applet 👉 AI extracts real physical
                coordinates, evaluates chemical risks, and triggers a reassuring
                voice instruction 👉 Delivers simple instructions to clear the
                area safely and avoid fumes.
              </p>
            </div>

            <div className="p-4 breakthrough-card card-emerald z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-amber-400 drop-shadow-[0_0_8px_rgba(255,176,0,0.8)] font-bold text-sm">
                  PERSONA 2: Ravi (Hazmat Fleet Manager)
                </span>
              </div>
              <p className="text-amber-50/80 text-xs italic mb-2">
                "We usually react days after illegal dumping happens. If we knew
                about severe chemical leakage right away, we could isolate it
                before groundwater trauma."
              </p>
              <p className="text-amber-200/50 text-xs leading-relaxed">
                <strong className="text-white">Journey:</strong> Receives
                agentic pre-alert via RoadGuardian Management API 👉 Direct
                dashboard showing risk levels and estimated volume 👉
                Containment team dispatched, protective gear optimized, and
                disposal cells prepped before arrival.
              </p>
            </div>
          </div>

          <div className="p-4 breakthrough-card card-orange z-10">
            <h5 className="text-amber-400 font-semibold text-xs uppercase tracking-wider mb-2">
              CRITICAL CONTAINMENT JOURNEY
            </h5>
            <ol className="text-xs text-amber-50/80 list-decimal pl-4 space-y-2">
              <li>
                <strong>T-0 Mins:</strong> Detection triggers system report
                (Text, image, or hands-free voice description).
              </li>
              <li>
                <strong>T+10 Secs:</strong> trauma assessment agent classifies
                case; locks appropriate hazardous processing center.
              </li>
              <li>
                <strong>T+20 Secs:</strong> Green corridor route generated; CAD
                unit transmits digital dispatch signals directly to municipal
                dispatch and compliance petrols.
              </li>
              <li>
                <strong>T+1 Min:</strong> Nearby citizens alerted;
                Highway/Police agencies dispatched automated SMS with live
                chemical spread tracker.
              </li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: "architecture",
      title: "Multi-Agent Specs",
      icon: Sparkles,
      content: (
        <div className="space-y-6">
          <div className="p-4 breakthrough-card card-purple z-10">
            <h4 className="text-amber-400 drop-shadow-[0_0_8px_rgba(255,176,0,0.8)] font-bold text-sm mb-3">
              5-AGENT SYNCHRONOUS COLLABORATION STACK
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 breakthrough-card card-indigo z-10">
                <strong className="text-white text-xs block mb-1">
                  1. accident Intake Coordinator
                </strong>
                <p className="text-amber-200/50 text-xs">
                  Primary orchestrator. Governs session states, coordinates
                  telemetry pipelines, and syncs downstream agencies.
                </p>
              </div>
              <div className="p-3.5 breakthrough-card card-indigo z-10">
                <strong className="text-white text-xs block mb-1">
                  2. trauma Assessment Engine
                </strong>
                <p className="text-amber-200/50 text-xs">
                  Translates sensory reports, images, and descriptors into risk
                  triage ratings: Minor, Moderate, Severe, or Critical.
                </p>
              </div>
              <div className="p-3.5 breakthrough-card card-indigo z-10">
                <strong className="text-white text-xs block mb-1">
                  3. Facility Routing Agent
                </strong>
                <p className="text-amber-200/50 text-xs">
                  Scans global municipal accident processing database. Filters
                  specialty (e.g. bio-hazard, e-accident, organic).
                </p>
              </div>
              <div className="p-3.5 breakthrough-card card-indigo z-10">
                <strong className="text-white text-xs block mb-1">
                  4. Smart Fleet Dispatch
                </strong>
                <p className="text-amber-200/50 text-xs">
                  Matches responder dispatch: locks heavy duty (with containment
                  suits/cranes) or standard sorting units based on triage.
                </p>
              </div>
              <div className="p-3.5 breakthrough-card card-indigo z-10">
                <strong className="text-white text-xs block mb-1">
                  5. Highway Police Liaison Agent
                </strong>
                <p className="text-amber-200/50 text-xs">
                  Orders Highway/Police boards to deploy barricades, issue
                  fatalities fines, or manage secure green containment
                  corridors.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "metrics",
      title: "Success & Advantages",
      icon: TrendingUp,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-amber-400 font-bold text-sm uppercase">
              INVESTOR KEY SUCCESS METRICS
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 breakthrough-card card-emerald z-10">
                <span className="text-2xl font-bold text-white block">73%</span>
                <span className="text-[10px] text-amber-200/50">
                  Leakage Impact Reduction
                </span>
              </div>
              <div className="p-4 breakthrough-card card-emerald z-10">
                <span className="text-2xl font-bold text-white block">
                  &lt; 15s
                </span>
                <span className="text-[10px] text-amber-200/50">
                  Autonomous Fleet Dispatch
                </span>
              </div>
              <div className="p-4 breakthrough-card card-emerald z-10">
                <span className="text-2xl font-bold text-white block">
                  98.4%
                </span>
                <span className="text-[10px] text-amber-200/50">
                  Material Segregation Accuracy
                </span>
              </div>
              <div className="p-4 breakthrough-card card-emerald z-10">
                <span className="text-2xl font-bold text-white block">
                  100%
                </span>
                <span className="text-[10px] text-amber-200/50">
                  Offline Logging Delivery
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-amber-400 font-bold text-sm">
              ROADGUARDIAN VS LEGACY ACCIDENT MANAGEMENT
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-white/5 rounded-lg">
                <thead>
                  <tr className="bg-black/40 border-b border-white/5">
                    <th className="p-2 text-amber-50/80 font-semibold">
                      Feature Dimension
                    </th>
                    <th className="p-2 text-amber-200/50 font-semibold">
                      Legacy 108 System
                    </th>
                    <th className="p-2 text-amber-400 font-semibold">
                      RoadGuardian AI EOS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-black/20 text-amber-50/80">
                  <tr>
                    <td className="p-2 font-semibold">Addressing Reports</td>
                    <td className="p-2 text-amber-200/50">
                      Slow manual tickets, vague descriptors
                    </td>
                    <td className="p-2 text-amber-300">
                      Multi-modal pipeline (Voice transcription + Vision
                      Analysis)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Facility Coordination</td>
                    <td className="p-2 text-amber-200/50">
                      Generic trips leading to mixed dumping
                    </td>
                    <td className="p-2 text-amber-300">
                      Instant matching, specialized processing slot reservation
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Citizen Support</td>
                    <td className="p-2 text-amber-200/50">
                      None or confusing signs
                    </td>
                    <td className="p-2 text-amber-300">
                      Step-by-step contextual segregation guidance
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Network Fail-Safe</td>
                    <td className="p-2 text-amber-200/50">
                      Manual complaints drop locally
                    </td>
                    <td className="p-2 text-amber-300">
                      Offline Incident logging + compressed bulk delivery
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "govtech",
      title: "Stack & Future",
      icon: Server,
      content: (
        <div className="space-y-6">
          <div className="p-4 breakthrough-card card-emerald z-10">
            <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-amber-400" />
              CIVIC-READY & SCALABLE INFRASTRUCTURE
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-amber-50/80">
              <div className="space-y-2">
                <span className="text-white font-semibold">
                  National fatalities Control Board Binding
                </span>
                <p className="text-amber-200/50">
                  Matches Highway/Police safety standards and regional smart
                  city management grids directly handling public API queries.
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-white font-semibold">
                  API Gateways for independent fleets
                </span>
                <p className="text-amber-200/50">
                  Extensible SDKs allowing Ramky, Antony accident, and municipal
                  vehicles to securely pull cleanup payloads.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 breakthrough-card card-purple z-10">
            <h4 className="text-violet-400 font-bold text-sm mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              FUTURE PRODUCT PIPELINE
            </h4>
            <ul className="text-xs text-amber-50/80 list-disc pl-4 space-y-1">
              <li>
                <strong>In-Vehicle IoT Scales:</strong> Telematics weight
                measurement arrays inside traditional ambulances.
              </li>
              <li>
                <strong>Drone Assessment Swarms:</strong> Deploy Highway/Police
                assessment drones to scan massive landfills and detect methane
                spikes.
              </li>
              <li>
                <strong>Edge AI on City Cameras:</strong> Detect dumping
                patterns instantaneously to penalize illegal acts heavily.
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "vision",
      title: "Vision & Problem",
      icon: Target,
      content: (
        <div className="space-y-6">
          <div className="p-5 breakthrough-card card-gold z-10">
            <h4 className="text-amber-400 font-bold text-lg mb-2">
              RoadGuardian AI VISION
            </h4>
            <p className="text-amber-50/80 text-sm leading-relaxed">
              To establish the world's first **Agentic AI Highway/Police
              Operating System (EOS)** for municipal transit networks. By
              automating multi-agency coordination During critical highway
              emergencies, RoadGuardian AI aims to scale down response times and
              average fatalities cleanup times from{" "}
              <span className="font-semibold text-white">
                45+ days to under 12 hours
              </span>
              , safeguarding local ecosystems through deep intelligence.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-amber-400 font-bold text-md">
              THE CRITICAL PROBLEM STATEMENT
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 breakthrough-card card-cyan z-10">
                <span className="text-white font-bold text-sm block mb-1">
                  Reactive Segregation
                </span>
                <p className="text-amber-200/50 text-xs">
                  Cleaners suffer with poorly sorted heaps. Critical hours are
                  squandered inspecting mixed hazards manually.
                </p>
              </div>
              <div className="p-4 breakthrough-card card-cyan z-10">
                <span className="text-white font-bold text-sm block mb-1">
                  Fragmented Handling
                </span>
                <p className="text-amber-200/50 text-xs">
                  Recycling plants, municipal trucks, and compliance agencies
                  are siloed. Facility capacity is invisible to collectors.
                </p>
              </div>
              <div className="p-4 breakthrough-card card-cyan z-10">
                <span className="text-white font-bold text-sm block mb-1">
                  The trauma Gap
                </span>
                <p className="text-amber-200/50 text-xs">
                  Citizens fail to comprehend trauma protocols. by leaking
                  alkaline batteries, ruining the payload value.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const activeSection = sections.find((s) => s.id === activeTab) || sections[0];

  return (
    <div className="breakthrough-shell large-panel rounded-[3.5rem] flex flex-col md:flex-row gap-10">
      {/* Slide Navigation */}
      <div className="w-full lg:w-1/4 flex flex-col gap-2 relative z-10 shrink-0">
        <div className="mb-6 pl-2">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-500 drop-shadow-[0_0_8px_rgba(255,176,0,0.8)]" />
            <h3 className="text-white font-black tracking-widest text-base">
              RoadGuardian AI
            </h3>
          </div>
          <span className="text-[10px] text-amber-200/50 font-black uppercase tracking-widest block mt-2">
            MISSION & IMPACT
          </span>
        </div>

        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = sec.id === activeTab;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveTab(sec.id)}
              className={`prd-nav-item flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold tracking-wide ${
                isActive
                  ? "active text-white"
                  : "text-amber-100/60 hover:text-white"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "text-amber-400 drop-shadow-[0_0_8px_rgba(255,176,0,0.8)]" : ""}`}
              />
              <span className="font-bold text-sm tracking-wide">
                {sec.title}
              </span>
            </button>
          );
        })}

        <div className="mt-auto pt-8 p-4 bg-black/40 rounded-2xl border border-white/5 text-[10px] text-amber-100/40 leading-relaxed font-medium">
          <span className="text-amber-400 font-bold">Pitch Highlights:</span>{" "}
          Redefining municipal distress structures. Built as an autonomous
          multi-agent fail-safe system with high-speed trauma routing.
        </div>
      </div>

      {/* Active Content Desk */}
      <div className="flex-1 rounded-[2.5rem] breakthrough-card card-cyan shadow-inner relative z-10 flex flex-col p-8 md:p-12 min-h-[600px] overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-8">
          <h2 className="text-white font-black text-2xl tracking-tight flex items-center gap-3">
            {React.createElement(activeSection.icon, {
              className:
                "w-6 h-6 text-amber-400 drop-shadow-[0_0_8px_rgba(255,176,0,0.8)]",
            })}
            {activeSection.title}
          </h2>
          <span className="bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] uppercase tracking-widest font-black px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(255,176,0,0.2)]">
            INVESTOR PRD
          </span>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar animate-in fade-in duration-500">
          {activeSection.content}
        </div>
      </div>
    </div>
  );
}
