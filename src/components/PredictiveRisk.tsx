/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  ShieldCheck,
  CloudLightning,
  ShieldAlert,
  Thermometer,
  User,
  Navigation,
  Eye,
  CheckCircle,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import { INITIAL_BLACK_SPOTS } from "../mockData";
import { Incident } from "../types";

export default function PredictiveRisk({
  activeIncident,
}: {
  activeIncident?: Incident | null;
}) {
  const [weatherInput, setWeatherInput] = useState<string>("fog");
  const [trafficInput, setTrafficInput] = useState<string>("peak flex");
  const [timeInput, setTimeInput] = useState<string>("early dawn");

  // Dynamic deterministic formula evaluating safety, weather effects, road impacts, and response complexity
  const calculateDynamicRisk = () => {
    let baseScore = 25;
    let weatherScore = 0;
    let roadScore = 0;
    let timeScore = 0;

    // 1. Analyze active incident context
    if (activeIncident) {
      if (activeIncident.severity === "Critical") baseScore = 55;
      else if (activeIncident.severity === "Severe") baseScore = 40;
      else if (activeIncident.severity === "Moderate") baseScore = 25;
      else baseScore = 15;

      if (activeIncident.hazmat) baseScore += 15;
      const vc = activeIncident.victimsCount || activeIncident.victimCount || 0;
      if (vc > 1) {
        baseScore += Math.min(15, vc * 4);
      }
    }

    // 2. Weather effect
    let weatherEffectText =
      "Optimal dry surface traction. Visual range is peak (~1.2 km). Minimal Highway threat.";
    if (weatherInput === "rain") {
      weatherScore = 20;
      weatherEffectText =
        "High risk of hydroplaning. Friction coefficient reduced to 0.35. Braking distances multiplied by 1.8x.";
    } else if (weatherInput === "fog") {
      weatherScore = 30;
      weatherEffectText =
        "Thick radiation fog limits visibility under 20m. Drivers suffer severe target fascination and high braking latency.";
    }

    // 3. Traffic / Road condition impact
    let roadConditionText =
      "Standard night density. Speeds are highly fluid and above standard benchmarks.";
    let roadConditionLabel = "Low Traffic Friction";
    if (trafficInput === "peak flex") {
      roadScore = 20;
      roadConditionText =
        "Critical shockwave queues on highway joints. Extreme vehicle speed variance and blind-spot friction.";
      roadConditionLabel = "Dynamic Congestion Jam";
    } else if (trafficInput === "medium") {
      roadScore = 10;
      roadConditionText =
        "Fluid commuter density with localized bottlenecking near toll plazas and approach routes.";
      roadConditionLabel = "Moderate Commuter Load";
    }

    // 4. Time transit bracket
    if (timeInput === "early dawn") {
      timeScore = 15;
    } else if (timeInput === "midnight") {
      timeScore = 10;
    }

    // 5. Total Score calculation
    const totalScore = Math.min(
      100,
      Math.max(10, baseScore + weatherScore + roadScore + timeScore),
    );

    // 6. Danger Level categorization
    let dangerText = "STABLE HIGHWAY STATUS";
    let colorClass =
      "text-emerald-400 premium-panel card-nhai-bridge border-emerald-500/20";
    let helperText =
      "Standard highway driving speeds. Highway/Police risk index is within nominal thresholds.";

    if (totalScore >= 40 && totalScore < 70) {
      dangerText = "ELEVATED ROAD RISK";
      colorClass =
        "text-amber-400 premium-panel card-amber-center border-amber-500/20";
      helperText =
        "Highway/Police alerts active. Advisory speed reduced by 15 km/h on digital display gantries.";
    } else if (totalScore >= 70) {
      dangerText = "CRITICAL HAZARD ZONE";
      colorClass =
        "text-pink-500 premium-panel card-risk-score animate-pulse-slow border-pink-500/30";
      helperText =
        "Critical hazard probability flagged. High risks of multi-vehicle pileups. Coordinated alerts broadcasted.";
    }

    // 7. Response Complexity calculation
    let complexityLevel = "Level 1: Routine Local Response";
    let complexityDesc =
      "Unified local police patrol and basic life support unit handling is sufficient.";

    const severityVal = activeIncident ? activeIncident.severity : "Moderate";
    const hasHazmat = activeIncident ? activeIncident.hazmat : false;
    const vc = activeIncident
      ? activeIncident.victimsCount || activeIncident.victimCount || 0
      : 1;

    if (severityVal === "Critical" || hasHazmat || vc >= 3) {
      complexityLevel = "Level 4: Maximum Coordinated Complexity";
      complexityDesc =
        "Requires immediate green-corridor priority, trauma team standby, Hazmat isolation, and triple-agency CAD logging.";
    } else if (severityVal === "Severe" || vc >= 2) {
      complexityLevel = "Level 3: Urgent Multi-Unit Dispatch";
      complexityDesc =
        "Pre-alerts active for nearest Level-1 trauma suite alongside active local interceptors.";
    } else if (severityVal === "Moderate") {
      complexityLevel = "Level 2: Balanced Inter-Hospital Route";
      complexityDesc =
        "Routine paramedic team supported by single district highway security escort.";
    }

    return {
      score: totalScore,
      dangerText,
      colorClass,
      helperText,
      weatherEffect: weatherEffectText,
      roadImpact: roadConditionText,
      roadLabel: roadConditionLabel,
      complexity: complexityLevel,
      complexityDesc,
    };
  };

  const {
    score,
    dangerText,
    colorClass,
    helperText,
    weatherEffect,
    roadImpact,
    roadLabel,
    complexity,
    complexityDesc,
  } = calculateDynamicRisk();

  return (
    <div className="premium-panel card-predictive p-[32px] mb-8 relative">
      <div className="glass-reflection" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-6 mb-8 relative z-10">
        <div>
          <h4 className="text-white font-black text-2xl tracking-wider flex items-center gap-3 drop-shadow-md">
            <CloudLightning className="w-8 h-8 text-purple-400 icon-glow" />
            PREDICTIVE RISK SAFETY INTELLIGENCE & HEATMAPS
          </h4>
          <p className="text-sm text-blue-200/60 mt-1 font-bold">
            Government-ready NHAI risk radar with Highway/Police correlation and
            black spot index.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl text-xs text-blue-100/70 font-mono border border-white/5 shadow-inner font-bold">
          <span>NHAI Integration Hub: Active CAD node</span>
        </div>
      </div>

      {activeIncident && (
        <div className="mb-8 p-5 rounded-3xl bg-purple-950/20 border border-purple-500/20 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[9px] bg-purple-500/20 text-purple-300 font-mono font-black uppercase px-2.5 py-1 rounded-md border border-purple-500/30 tracking-widest leading-none">
              🚨 LIVE HAZARD CORRELATION ENGINE
            </span>
            <p className="text-xs text-purple-100/90 font-bold mt-2 font-sans">
              Incident ID:{" "}
              <span className="text-white font-mono">{activeIncident.id}</span>{" "}
              | Severity:{" "}
              <span className="text-rose-450 font-bold">
                {activeIncident.severity}
              </span>{" "}
              | Type:{" "}
              <span className="text-purple-200">
                {activeIncident.vehicleInfo || "Expressway collision"}
              </span>
            </p>
          </div>
          <div className="text-[10px] uppercase font-mono text-purple-300/80 font-black bg-black/45 px-3 py-2 rounded-xl border border-purple-500/10 flex items-center gap-3">
            <span>EV / HAZMAT Danger:</span>
            <span
              className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wider ${activeIncident.hazmat ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"}`}
            >
              {activeIncident.hazmat
                ? "CRITICAL HAZARD DETECTED"
                : "STANDARD PRECAUTIONS"}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Left: Risk Inputs */}
        <div className="premium-panel card-Highway p-6 flex flex-col h-full">
          <div className="glass-reflection" />
          <span className="text-xs text-cyan-200/80 font-black uppercase tracking-widest block drop-shadow-sm mb-6 border-b border-white/10 pb-4 relative z-10">
            <Thermometer className="w-4 h-4 inline mr-2 text-cyan-400 icon-glow" />{" "}
            Highway SENSOR INPUTS
          </span>
          <div className="space-y-6 text-sm font-bold flex-1 relative z-10">
            <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
              <label className="text-blue-200/60 block mb-3 text-xs uppercase tracking-wider">
                Select Weather Condition
              </label>
              <select
                value={weatherInput}
                onChange={(e) => setWeatherInput(e.target.value)}
                className="w-full bg-black/60 border border-cyan-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 appearance-none shadow-inner"
              >
                <option value="clear">Clear Skies (Dry surface)</option>
                <option value="rain">
                  Torrential Heavy Rain (Hydroplaning risk)
                </option>
                <option value="fog">
                  Dense Fog / Smog (Visibility &lt; 20 meters)
                </option>
              </select>
            </div>

            <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
              <label className="text-blue-200/60 block mb-3 text-xs uppercase tracking-wider">
                Highway Congestion Index
              </label>
              <select
                value={trafficInput}
                onChange={(e) => setTrafficInput(e.target.value)}
                className="w-full bg-black/60 border border-cyan-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 appearance-none shadow-inner"
              >
                <option value="peak flex">
                  Peak Rush Congestion (Speed differentials)
                </option>
                <option value="medium">Medium Commuter Density</option>
                <option value="normal">Low Night Flow</option>
              </select>
            </div>

            <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
              <label className="text-blue-200/60 block mb-3 text-xs uppercase tracking-wider">
                Time Transit Bracket
              </label>
              <select
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                className="w-full bg-black/60 border border-cyan-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 appearance-none shadow-inner"
              >
                <option value="early dawn">
                  Early Dawn (4 AM - 7 AM, Sleep)
                </option>
                <option value="noon">High Noon (Visibility peak)</option>
                <option value="midnight">Midnight (Low light speeds)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Center: Heatmap / Black Spots */}
        <div className="premium-panel card-blackspot p-6 flex flex-col h-full overflow-hidden">
          <div className="glass-reflection" />
          <span className="text-xs text-pink-400 font-black uppercase tracking-widest block mb-6 border-b border-white/10 pb-4 relative z-10">
            <Navigation className="w-4 h-4 inline mr-2 text-pink-400 icon-glow" />{" "}
            REGISTERED NHAI BLACK SPOT INDEX
          </span>
          <div className="grid grid-cols-1 gap-4 overflow-y-auto custom-scrollbar flex-1 pr-2 relative z-10">
            {INITIAL_BLACK_SPOTS.map((bs) => (
              <div
                key={bs.id}
                className="p-5 rounded-2xl border border-white/5 bg-black/30 hover:bg-black/50 transition-colors flex flex-col gap-3 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/20 group-hover:bg-rose-500/20 transition-colors">
                      <ShieldAlert className="w-5 h-5 text-rose-500" />
                    </div>
                    <span className="text-sm font-bold text-white truncate max-w-[150px]">
                      {bs.highway}
                    </span>
                  </div>
                  <span className="bg-gradient-to-r from-rose-900/60 to-rose-950 border border-rose-900 border-b-rose-800 text-rose-450 font-mono text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-inner">
                    {bs.dangerLevel}
                  </span>
                </div>
                <p className="text-xs text-blue-200/60 italic font-sans leading-relaxed border-l-2 border-white/10 pl-3">
                  {bs.primaryRiskFactor}
                </p>
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-blue-200/40 font-bold uppercase tracking-widest">
                  <span className="bg-black/40 px-2 py-1 rounded">
                    Freq:{" "}
                    <strong className="text-rose-400 text-xs">
                      {bs.recentAccidents}/yr
                    </strong>
                  </span>
                  <span className="bg-black/40 px-2 py-1 rounded">
                    GPS: {bs.coordinates.lat.toFixed(2)},{" "}
                    {bs.coordinates.lng.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI Risk Analysis */}
        <div className="flex flex-col gap-6 h-full">
          {/* 1 & 2. Risk Score & Danger Level */}
          <div
            className={`p-6 rounded-[2rem] flex flex-col justify-center items-center text-center transition-all duration-500 relative overflow-hidden ${colorClass}`}
          >
            <div className="glass-reflection" />
            <span className="text-[10px] uppercase font-black tracking-widest opacity-80 mb-2 relative z-10">
              Agentic Risk Score
            </span>
            <span className="text-6xl font-black block font-mono tracking-tighter drop-shadow-xl relative z-10 mb-2">
              {score}%
            </span>
            <span
              id="danger-level"
              className="text-sm font-black uppercase tracking-widest block mb-4 border-b border-current/20 pb-4 relative z-10 w-full animate-pulse"
            >
              {dangerText}
            </span>
            <p className="text-xs mt-2 leading-relaxed font-bold font-sans opacity-90 relative z-10 max-w-sm">
              {helperText}
            </p>
          </div>

          {/* 3. Weather Effect */}
          <div
            id="weather-effect"
            className="bg-black/40 border border-cyan-500/10 p-5 rounded-3xl relative overflow-hidden"
          >
            <div className="absolute inset-y-0 left-0 w-1 bg-cyan-400" />
            <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest block mb-2 font-mono">
              ☀️ 🌧️ Weather Effect Impact
            </span>
            <div className="text-xs text-slate-100/90 leading-relaxed font-bold">
              {weatherEffect}
            </div>
          </div>

          {/* 4. Road Condition Impact */}
          <div
            id="road-condition-impact"
            className="bg-black/40 border border-purple-500/10 p-5 rounded-3xl relative overflow-hidden"
          >
            <div className="absolute inset-y-0 left-0 w-1 bg-purple-450" />
            <span className="text-[10px] text-purple-300 font-extrabold uppercase tracking-widest block mb-2 font-mono">
              🚗 🛣️ Road Condition Impact
            </span>
            <div className="text-xs text-purple-200/50 block font-black uppercase tracking-wider mb-1">
              {roadLabel}
            </div>
            <div className="text-xs text-slate-100/90 leading-relaxed font-bold">
              {roadImpact}
            </div>
          </div>

          {/* 5. Response Complexity */}
          <div
            id="response-complexity"
            className="bg-pink-950/20 border border-pink-500/20 p-5 rounded-3xl relative overflow-hidden"
          >
            <div className="absolute inset-y-0 left-0 w-1 bg-pink-500" />
            <span className="text-[10px] text-pink-400 font-extrabold uppercase tracking-widest block mb-2 font-mono">
              ⚡ Response Complexity Rating
            </span>
            <div className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-pink-500 animate-pulse" />
              {complexity}
            </div>
            <div className="text-xs text-pink-100/80 leading-relaxed font-semibold">
              {complexityDesc}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
