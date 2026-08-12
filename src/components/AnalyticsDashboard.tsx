/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { Activity, Clock, ShieldAlert, HeartPulse } from "lucide-react";

const RESPONSE_DATA = [
  { name: "Mon", target: 15, actual: 12 },
  { name: "Tue", target: 15, actual: 14 },
  { name: "Wed", target: 15, actual: 11 },
  { name: "Thu", target: 15, actual: 9 },
  { name: "Fri", target: 15, actual: 16 },
  { name: "Sat", target: 15, actual: 18 },
  { name: "Sun", target: 15, actual: 13 },
];

const SEVERITY_DATA = [
  { name: "Jan", critical: 40, severe: 24, moderate: 24, minor: 100 },
  { name: "Feb", critical: 30, severe: 13, moderate: 22, minor: 90 },
  { name: "Mar", critical: 20, severe: 45, moderate: 22, minor: 120 },
  { name: "Apr", critical: 27, severe: 39, moderate: 20, minor: 150 },
  { name: "May", critical: 18, severe: 48, moderate: 21, minor: 110 },
  { name: "Jun", critical: 23, severe: 38, moderate: 25, minor: 130 },
];

import { Incident } from "../types";

export default function AnalyticsDashboard({
  incidents = [],
}: {
  incidents?: Incident[];
}) {
  const activeCount = incidents.length;
  const criticalCount = incidents.filter(
    (ins) => ins.severity === "Critical",
  ).length;

  return (
    <div className="premium-panel card-amber-center p-8 md:p-12 mb-12 h-auto min-h-[80vh] flex flex-col relative overflow-hidden group/dash">
      <div className="glass-reflection" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 border-b border-white/20 pb-6 relative z-10 transition-transform duration-500 group-hover/dash:-translate-y-1">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center rounded-[2rem] shadow-[0_0_30px_rgba(255,154,0,0.5)] border border-white/30 cursor-pointer hover:rotate-12 transition-transform duration-500">
            <Activity className="w-8 h-8 icon-glow" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-2 drop-shadow-md">
              <Activity className="w-8 h-8 text-amber-400" />
              AMBER INTELLIGENCE CENTER
            </h2>
            <p className="text-sm text-amber-200/80 uppercase tracking-[0.2em] mt-1.5 font-bold">
              Global Incident Telemetry & Analytics
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 mt-8">
        <div
          className="premium-card p-6 h-full flex flex-col justify-between group"
          style={
            {
              "--glow-color": "rgba(255,154,0,0.35)",
              "--glow-rgb": "255,154,0",
            } as React.CSSProperties
          }
        >
          <div className="glass-reflection" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h4 className="text-amber-100/70 text-xs font-black uppercase tracking-widest">
              Avg Response
            </h4>
            <Clock className="w-5 h-5 text-amber-500 icon-glow transition-transform" />
          </div>
          <div className="text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] relative z-10">
            12.4 <span className="text-2xl text-amber-500/80">min</span>
          </div>
          <div className="text-[11px] text-amber-500 mt-2 font-bold tracking-wide relative z-10">
            ↓ 2.1m from last month
          </div>
        </div>

        <div
          className="premium-card p-6 h-full flex flex-col justify-between group"
          style={
            {
              "--glow-color": "rgba(255,154,0,0.35)",
              "--glow-rgb": "255,154,0",
            } as React.CSSProperties
          }
        >
          <div className="glass-reflection" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h4 className="text-amber-100/70 text-xs font-black uppercase tracking-widest">
              Total Active
            </h4>
            <Activity className="w-5 h-5 text-amber-500 icon-glow transition-transform" />
          </div>
          <div className="text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] relative z-10">
            {activeCount}
          </div>
          <div className="text-[11px] text-amber-200/60 mt-2 font-bold tracking-wide relative z-10">
            Live tracking incidents
          </div>
        </div>

        <div
          className="premium-card p-6 h-full flex flex-col justify-between group"
          style={
            {
              "--glow-color": "rgba(255,154,0,0.35)",
              "--glow-rgb": "255,154,0",
            } as React.CSSProperties
          }
        >
          <div className="glass-reflection" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h4 className="text-amber-100/70 text-xs font-black uppercase tracking-widest">
              Critical Cases
            </h4>
            <ShieldAlert className="w-5 h-5 text-amber-500 icon-glow transition-transform" />
          </div>
          <div className="text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] relative z-10">
            {criticalCount}
          </div>
          <div className="text-[11px] text-amber-500 mt-2 font-bold tracking-wide relative z-10">
            Requires immediate ICU
          </div>
        </div>

        <div
          className="premium-card p-6 h-full flex flex-col justify-between group"
          style={
            {
              "--glow-color": "rgba(255,154,0,0.35)",
              "--glow-rgb": "255,154,0",
            } as React.CSSProperties
          }
        >
          <div className="glass-reflection" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h4 className="text-amber-100/70 text-xs font-black uppercase tracking-widest">
              AI Confidence
            </h4>
            <HeartPulse className="w-5 h-5 text-amber-500 icon-glow transition-transform" />
          </div>
          <div className="text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] relative z-10">
            98.2<span className="text-2xl text-amber-500/80">%</span>
          </div>
          <div className="text-[11px] text-amber-300 mt-2 font-bold tracking-wide relative z-10">
            Triage accuracy rate
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10 mt-10">
        {/* Response Time Chart */}
        <div className="premium-panel card-amber-center p-8 border border-white/20 rounded-[3rem] shadow-[0_0_30px_rgba(0,0,0,0.2)]">
          <div className="glass-reflection" />
          <h3 className="text-white font-black text-lg mb-6 uppercase tracking-widest flex justify-between items-center drop-shadow-md relative z-10">
            Response Time (Minutes)
            <span className="text-[10px] bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-3 py-1.5 rounded-xl border border-amber-500/40 text-amber-200">
              TARGET: 15 MIN
            </span>
          </h3>
          <div className="h-72 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={RESPONSE_DATA}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="rgba(255,255,255,0.5)"
                  tick={{
                    fontSize: 12,
                    fontWeight: 700,
                    fill: "rgba(255,255,255,0.7)",
                  }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  tick={{
                    fontSize: 12,
                    fontWeight: 700,
                    fill: "rgba(255,255,255,0.7)",
                  }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    borderColor: "rgba(255,255,255,0.2)",
                    borderRadius: "16px",
                    backdropFilter: "blur(10px)",
                  }}
                  itemStyle={{ fontSize: "14px", fontWeight: "bold" }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px", fontWeight: "bold" }}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Actual ETA"
                  stroke="#FF9A00"
                  strokeWidth={5}
                  dot={{
                    r: 6,
                    fill: "#FF9A00",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{
                    r: 8,
                    fill: "#fff",
                    stroke: "#FF9A00",
                    strokeWidth: 3,
                  }}
                />
                <Line
                  type="step"
                  dataKey="target"
                  name="Golden Hour Target"
                  stroke="#FFC247"
                  strokeWidth={2}
                  strokeDasharray="8 8"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution Chart */}
        <div className="premium-panel card-amber-center p-8 border border-white/20 rounded-[3rem] shadow-[0_0_30px_rgba(0,0,0,0.2)]">
          <div className="glass-reflection" />
          <h3 className="text-white font-black text-lg mb-6 uppercase tracking-widest flex justify-between items-center drop-shadow-md relative z-10">
            Incident Severity Over Time
            <span className="text-[10px] bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 text-white/80">
              6 MONTHS
            </span>
          </h3>
          <div className="h-72 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SEVERITY_DATA}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="rgba(255,255,255,0.5)"
                  tick={{
                    fontSize: 12,
                    fontWeight: 700,
                    fill: "rgba(255,255,255,0.7)",
                  }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  tick={{
                    fontSize: 12,
                    fontWeight: 700,
                    fill: "rgba(255,255,255,0.7)",
                  }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    borderColor: "rgba(255,255,255,0.2)",
                    borderRadius: "16px",
                    backdropFilter: "blur(10px)",
                  }}
                  itemStyle={{ fontSize: "14px", fontWeight: "bold" }}
                />
                <Area
                  type="monotone"
                  dataKey="critical"
                  stackId="1"
                  stroke="#FF6A00"
                  fill="url(#colorCritical)"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="severe"
                  stackId="1"
                  stroke="#FF9A00"
                  fill="url(#colorSevere)"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="moderate"
                  stackId="1"
                  stroke="#FFC247"
                  fill="url(#colorModerate)"
                  strokeWidth={3}
                />

                {/* Gradients for AreaChart */}
                <defs>
                  <linearGradient
                    id="colorCritical"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#FF6A00" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FF6A00" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="colorSevere" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF9A00" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FF9A00" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient
                    id="colorModerate"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#FFC247" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FFC247" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
