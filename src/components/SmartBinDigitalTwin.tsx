import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Activity,
  Cpu,
  Camera,
  Scale,
  ShieldCheck,
  Database,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function SmartBinDigitalTwin({
  wasteType,
  initialDelay = 1000,
}: {
  wasteType: string;
  initialDelay?: number;
}) {
  const [stage, setStage] = useState<number>(0);

  // Stages:
  // 0: Idle
  // 1: Object Dropped (Hits Holding Tray)
  // 2: Scanner & Scale Active
  // 3: AI Inference
  // 4: Tray Mechanism Rotates
  // 5: Object Falls to Storage
  // 6: Storage Capacity Update

  const [fillLevel, setFillLevel] = useState(45);

  const playSequence = () => {
    setStage(0);
    setTimeout(() => setStage(1), initialDelay);
    setTimeout(() => setStage(2), initialDelay + 1000);
    setTimeout(() => setStage(3), initialDelay + 3000);
    setTimeout(() => setStage(4), initialDelay + 4500);
    setTimeout(() => setStage(5), initialDelay + 5500);
    setTimeout(() => setStage(6), initialDelay + 6500);
  };

  useEffect(() => {
    playSequence();
  }, [wasteType, initialDelay]);

  useEffect(() => {
    if (stage === 6) {
      setFillLevel((prev) => Math.min(100, prev + 15));
    }
  }, [stage]);

  const isScanning = stage === 2;
  const isAnalyzing = stage === 3;
  const isSorting = stage === 4 || stage === 5;
  const trayRotated = stage === 4 || stage === 5 || stage === 6;

  // Color System
  let binType = "general";
  let targetColorHex = "#00FFB2"; // Emerald

  const typeLower = wasteType.toLowerCase();
  if (
    typeLower.includes("medical") ||
    typeLower.includes("syringe") ||
    typeLower.includes("blood")
  ) {
    binType = "medical";
    targetColorHex = "#FF2965"; // Crimson
  } else if (typeLower.includes("battery") || typeLower.includes("chemical")) {
    binType = "battery";
    targetColorHex = "#FFB100"; // Gold Orange
  } else if (typeLower.includes("plastic") || typeLower.includes("bottle")) {
    binType = "plastic";
    targetColorHex = "#3A78FF"; // Blue
  } else if (typeLower.includes("metal") || typeLower.includes("can")) {
    binType = "metal";
    targetColorHex = "#14B8A6"; // Teal
  }

  const isHazardous = binType === "medical" || binType === "battery";

  return (
    <div className="bg-[#020612]/80 rounded-[2.5rem] p-6 lg:p-10 border border-cyan-500/20 shadow-[0_0_120px_rgba(0,230,255,0.1),inset_0_0_50px_rgba(0,230,255,0.05)] relative overflow-hidden font-mono group transition-colors duration-1000 w-full flex-1 flex flex-col min-h-[600px]">
      {/* Global Visual Engine: Deep Space Navy Gradient & Noise */}
      {/* Global Visual Engine */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_0%,#041128_0%,#020612_80%)]"></div>
      {/* Elegance Glow Layer (like the second image) */}
      <div className="absolute top-0 right-0 w-[80%] h-full bg-[radial-gradient(ellipse_at_right_center,rgba(0,230,255,0.08)_0%,transparent_70%)] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,255,178,0.05)_0%,transparent_60%)] pointer-events-none z-0"></div>
      <div
        className="absolute inset-0 z-0 opacity-20 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')",
        }}
      ></div>

      {/* Blueprint Grid Background */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#00E6FF 1px, transparent 1px), linear-gradient(90deg, #00E6FF 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-[#07182D]/80 to-transparent z-0"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-10 relative z-10 w-full px-2">
        <div>
          <h4 className="text-xl lg:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200 flex items-center gap-3 drop-shadow-[0_0_15px_rgba(0,230,255,0.5)] tracking-widest uppercase">
            <Layers className="w-8 h-8 lg:w-10 lg:h-10 text-cyan-400 drop-shadow-[0_0_10px_rgba(0,230,255,0.8)]" />
            AI Smart Bin — Internal Digital Twin
          </h4>
          <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] ml-8 flex items-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E6FF] shadow-[0_0_5px_#00E6FF]"></span>
            Autonomous Mechanical View
          </span>
        </div>
        {stage >= 6 && (
          <button
            onClick={playSequence}
            className="flex items-center gap-2 text-xs font-bold text-white/70 bg-[#07182D]/50 hover:bg-[#07182D] hover:text-white px-4 py-2 rounded-xl border border-white/5 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] group/btn z-50 cursor-pointer pointer-events-auto"
          >
            <RefreshCw className="w-5 h-5 group-hover/btn:rotate-180 transition-transform duration-500" />{" "}
            RESTART TWIN
          </button>
        )}
      </div>

      <div className="relative flex-1 w-full flex items-center justify-center z-10 py-6">
        {/* Core Hardware Chassis Blueprint */}
        <div className="relative w-full max-w-[800px] flex-1 border border-[#07182D]/80 rounded-t-[3rem] rounded-b-xl backdrop-blur-md shadow-[inset_0_0_80px_rgba(0,0,0,0.8),0_0_80px_rgba(0,230,255,0.1)] flex flex-col justify-between overflow-hidden mx-auto">
          <div className="absolute inset-0 bg-[#020612]/60 rounded-t-3xl rounded-b-lg"></div>

          {/* Glass Panels Refraction Layer */}
          <div className="absolute inset-0 rounded-t-3xl rounded-b-lg shadow-[inset_0_2px_15px_rgba(255,255,255,0.02)] pointer-events-none mix-blend-screen"></div>

          {/* Internal Chamber UI Overlays */}
          <div className="absolute top-6 left-4 flex flex-col gap-3 z-30">
            {/* Material Sensor Array (Chips) */}
            <div
              className={`p-2 rounded-xl backdrop-blur-md transition-all duration-700 border ${isScanning ? "bg-[radial-gradient(circle_at_50%,#00E6FF_0%,transparent_100%)] border-[#00E6FF]/50 shadow-[0_0_25px_rgba(0,230,255,0.3)] text-[#00E6FF]" : "bg-[#041128]/40 border-white/5 text-slate-700"}`}
            >
              <Camera className="w-5 h-5" />
            </div>
            <div
              className={`p-2 rounded-xl backdrop-blur-md transition-all duration-700 border ${isAnalyzing ? "bg-[radial-gradient(circle_at_50%,#7A5FFF_0%,transparent_100%)] border-[#7A5FFF]/50 shadow-[0_0_25px_rgba(122,95,255,0.3)] text-[#7A5FFF]" : "bg-[#041128]/40 border-white/5 text-slate-700"}`}
            >
              <Cpu className="w-5 h-5" />
            </div>
            <div
              className={`p-2 rounded-xl backdrop-blur-md transition-all duration-700 border ${stage >= 2 && stage <= 4 ? "bg-[radial-gradient(circle_at_50%,#FFB300_0%,transparent_100%)] border-[#FFB300]/50 shadow-[0_0_25px_rgba(255,179,0,0.3)] text-[#FFB300]" : "bg-[#041128]/40 border-white/5 text-slate-700"}`}
            >
              <Scale className="w-5 h-5" />
            </div>
          </div>

          <div className="absolute top-6 right-5 flex flex-col items-end gap-1.5 text-[8px] uppercase tracking-[0.2em] text-[#00E6FF]/40 text-right z-30 font-bold">
            <div className="flex items-center gap-1.5 opacity-60">
              <span>Chassis Temp</span> <span className="text-white">24°C</span>
            </div>
            <div className="flex items-center gap-1.5 opacity-60">
              <span>Torque</span>{" "}
              <span
                className={`${stage === 4 ? "text-[#FF8A00]" : "text-white"}`}
              >
                {stage === 4 ? "MAX" : "NORM"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 opacity-60">
              <span>Link</span> <span className="text-[#00FFB2]">SECURE</span>
            </div>
          </div>

          {/* Top Funnel / Entrance */}
          <div className="w-56 h-12 border-b border-[#07182D] absolute top-0 left-1/2 -translate-x-1/2 flex justify-center items-end pb-1.5 z-20">
            <div className="w-32 h-0.5 bg-[radial-gradient(circle_at_50%,rgba(0,230,255,0.5),transparent_70%)]"></div>
          </div>

          {/* Dual Camera Module Structure */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
            <div
              className={`w-3 h-3 rounded-full border transition-all duration-300 ${isScanning ? "bg-[radial-gradient(circle_at_50%_50%,#00E6FF_0%,transparent_60%)] border-[#00E6FF]/80 shadow-[0_0_15px_#00E6FF,inset_0_0_5px_#fff]" : "bg-[#020612] border-slate-800"}`}
            ></div>
            <div
              className={`w-3 h-3 rounded-full border transition-all duration-300 ${isScanning ? "bg-[radial-gradient(circle_at_50%_50%,#00E6FF_0%,transparent_60%)] border-[#00E6FF]/80 shadow-[0_0_15px_#00E6FF,inset_0_0_5px_#fff]" : "bg-[#020612] border-slate-800"}`}
            ></div>
          </div>

          {/* Active Object Simulation */}
          <AnimatePresence>
            {stage >= 1 && stage <= 5 && (
              <motion.div
                initial={{ y: -60, opacity: 0, scale: 0.5, rotate: 0 }}
                animate={{
                  y: stage === 1 ? 40 : stage >= 4 ? 60 : 40,
                  opacity: stage === 5 ? 0 : 1,
                  scale: 1,
                  rotate: stage >= 4 ? (isHazardous ? 90 : -90) : 0,
                  x: stage === 5 ? (isHazardous ? "200%" : "-300%") : "-50%",
                }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="absolute top-[5%] left-1/2 z-40 block"
              >
                <div
                  className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl border flex items-center justify-center shadow-lg bg-[#020612]/90 backdrop-blur-md transition-colors duration-500 relative overflow-hidden"
                  style={{
                    borderColor: stage >= 3 ? `${targetColorHex}80` : "#1e293b",
                    color: stage >= 3 ? targetColorHex : "#475569",
                    boxShadow:
                      stage >= 3
                        ? `0 0 20px ${targetColorHex}40, inset 0 0 10px ${targetColorHex}20`
                        : "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <ShieldCheck className="w-9 h-9 lg:w-11 lg:h-11 relative z-10" />
                  {stage >= 3 && (
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,currentColor_0%,transparent_70%)] mix-blend-screen"></div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Holographic Scan VFX (Volumetric Light) */}
          <AnimatePresence>
            {isScanning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 160 }}
                exit={{ opacity: 0 }}
                className="absolute top-[15%] left-1/2 -translate-x-1/2 w-48 bg-gradient-to-b from-[#00E6FF]/20 via-[#00E6FF]/5 to-transparent z-20 pointer-events-none"
                style={{
                  clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
                }}
              >
                {/* Horizontal Scanning Beam Pulse */}
                <motion.div
                  animate={{ y: [0, 160, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-full h-[2px] bg-[#00E6FF] shadow-[0_0_15px_#00E6FF]"
                ></motion.div>

                {/* Micro Particles in the beam */}
                <motion.div
                  animate={{ y: [-10, -50], opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  className="absolute left-[30%] w-0.5 h-0.5 bg-white rounded-full blur-[0.5px]"
                ></motion.div>
                <motion.div
                  animate={{ y: [100, 50], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.5 }}
                  className="absolute left-[60%] w-1 h-0.5 bg-[#00E6FF] blur-[0.5px]"
                ></motion.div>
              </motion.div>
            )}

            {/* AI Crystal Core VFX (Glass Core Neural Pulses) */}
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                className="absolute top-[20%] left-1/2 -translate-x-1/2 w-32 h-32 flex items-center justify-center z-10 pointer-events-none"
              >
                <div className="absolute inset-0 bg-[#7A5FFF]/10 rounded-full blur-2xl animate-pulse"></div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 rounded-full border border-dashed border-[#7A5FFF]/50 shadow-[0_0_20px_rgba(122,95,255,0.2)]"
                ></motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="absolute w-16 h-16 rounded-full border-2 border-[#7A5FFF]/30 border-t-[#7A5FFF]/80"
                ></motion.div>
                <div className="w-8 h-8 lg:w-10 lg:h-10 rotate-45 bg-[#7A5FFF] blur-md absolute"></div>
                <div className="w-8 h-8 rotate-45 border border-[#7A5FFF] shadow-[0_0_20px_#7A5FFF,inset_0_0_10px_#7A5FFF] bg-[#020612]/50 backdrop-blur-sm"></div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Holding Tray (Middle Layer Platform / Yellow Slide) */}
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[85%] h-16 z-20 perspective-1000">
            <motion.div
              animate={{ rotateZ: trayRotated ? (isHazardous ? 35 : -35) : 0 }}
              transition={{ type: "spring", stiffness: 50, damping: 10 }}
              className="w-full h-4 rounded-full mx-auto origin-center shadow-[0_10px_40px_rgba(0,0,0,0.95)] z-20 flex justify-center overflow-hidden"
              style={{
                background:
                  stage >= 4
                    ? "linear-gradient(90deg, rgba(255,179,0,0.1) 0%, rgba(255,179,0,0.85) 50%, rgba(255,179,0,0.1) 100%)"
                    : "linear-gradient(90deg, rgba(7,24,45,0.8), rgba(7,24,45,1), rgba(7,24,45,0.8))",
                borderTop: "1px solid",
                borderColor: stage >= 4 ? "#FFB300" : "rgba(255,255,255,0.05)",
                boxShadow:
                  stage >= 4
                    ? "0 0 35px rgba(255,179,0,0.8), inset 0 0 15px rgba(255,179,0,0.6)"
                    : "none",
              }}
            >
              {/* Center glowing core (The core of the slide) */}
              <div
                className={`w-16 h-full transition-opacity duration-1000 ${stage >= 4 ? "opacity-100 bg-[#FFD700] blur-[2px]" : "opacity-0"}`}
              ></div>
            </motion.div>
            {/* Center Pivot Joint */}
            <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#020612] border-[3px] border-[#1e293b] flex items-center justify-center z-30 shadow-[0_0_20px_rgba(0,0,0,1)]">
              <div
                className={`w-3 h-3 rounded-full transition-colors duration-700 ${stage >= 4 ? "bg-[#FFB300] shadow-[0_0_12px_#FFB300]" : "bg-slate-700"}`}
              ></div>
            </div>
          </div>

          {/* Storage Compartment Area - Industrial Transparent Chambers */}
          <div className="absolute bottom-3 left-3 right-3 h-[40%] min-h-[170px] max-h-[300px] flex gap-3 z-10">
            {/* General Storage Chamber */}
            <div
              className={`flex-1 relative border border-[#07182D] rounded-xl overflow-hidden bg-[#020612] backdrop-blur-md shadow-[inset_0_0_30px_rgba(0,0,0,1)] flex flex-col justify-end transition-all duration-1000 ${!isHazardous && stage >= 6 ? "border-[#00FFB2]/30 shadow-[0_0_20px_rgba(0,255,178,0.1),inset_0_0_20px_rgba(0,255,178,0.05)]" : ""}`}
            >
              <div className="absolute top-3 left-0 w-full text-center text-[8px] text-white/20 uppercase tracking-[0.2em] font-black z-10">
                Standard
                <br />
                Bin
              </div>

              {/* Internal Refraction Lens */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-transparent z-10 pointer-events-none"></div>

              {/* Liquid Fill / Waste Accumulation */}
              <div
                className="relative w-full transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                  height: `${!isHazardous ? fillLevel : Math.max(0, fillLevel - 15)}%`,
                  backgroundColor:
                    !isHazardous && stage >= 6
                      ? `${targetColorHex}15`
                      : "rgba(0, 255, 178, 0.05)",
                }}
              >
                {/* Top Rim Glow */}
                <div
                  className="absolute top-0 left-0 w-full h-[1px] shadow-[0_0_15px]"
                  style={{
                    backgroundColor:
                      !isHazardous && stage >= 6
                        ? `${targetColorHex}90`
                        : "rgba(0, 255, 178, 0.3)",
                    color:
                      !isHazardous && stage >= 6
                        ? targetColorHex
                        : "rgba(0, 255, 178, 0.5)",
                  }}
                ></div>

                {/* Level text inside */}
                <div
                  className="absolute -top-4 right-1.5 text-[8px] font-mono font-bold tracking-wider opacity-60 transition-colors"
                  style={{
                    color:
                      !isHazardous && stage >= 6 ? targetColorHex : "#00FFB2",
                  }}
                >
                  {!isHazardous ? fillLevel : Math.max(0, fillLevel - 15)}%
                </div>
              </div>
            </div>

            {/* Hazmat Storage Chamber */}
            <div
              className={`flex-1 relative border border-[#07182D] rounded-xl overflow-hidden bg-[#020612] backdrop-blur-md shadow-[inset_0_0_30px_rgba(0,0,0,1)] flex flex-col justify-end transition-all duration-1000 ${isHazardous && stage >= 6 ? `border-[${targetColorHex}]/30 shadow-[0_0_20px_${targetColorHex}20,inset_0_0_20px_${targetColorHex}10]` : ""}`}
              style={{
                borderColor:
                  isHazardous && stage >= 6 ? `${targetColorHex}40` : "#07182D",
              }}
            >
              <div className="absolute top-3 left-0 w-full text-center text-[8px] text-white/20 uppercase tracking-[0.2em] font-black z-10">
                Hazmat
                <br />
                Core
              </div>

              {/* Internal Refraction Lens */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-transparent z-10 pointer-events-none"></div>

              {/* Liquid Fill / Waste Accumulation */}
              <div
                className="relative w-full transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                  height: `${isHazardous ? fillLevel : 20}%`,
                  backgroundColor:
                    isHazardous && stage >= 6
                      ? `${targetColorHex}15`
                      : "rgba(255, 41, 101, 0.05)",
                }}
              >
                {/* Top Rim Glow */}
                <div
                  className="absolute top-0 left-0 w-full h-[1px] shadow-[0_0_15px]"
                  style={{
                    backgroundColor:
                      isHazardous && stage >= 6
                        ? `${targetColorHex}90`
                        : "rgba(255, 41, 101, 0.3)",
                    color:
                      isHazardous && stage >= 6
                        ? targetColorHex
                        : "rgba(255, 41, 101, 0.5)",
                  }}
                ></div>

                {/* Level text inside */}
                <div
                  className="absolute -top-4 right-1.5 text-[8px] font-mono font-bold tracking-wider opacity-60 transition-colors"
                  style={{
                    color:
                      isHazardous && stage >= 6 ? targetColorHex : "#FF2965",
                  }}
                >
                  {isHazardous ? fillLevel : 20}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Telemetry Box (Right side display) */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 bg-[#020612]/90 backdrop-blur-xl border border-white/5 rounded-xl p-5 shadow-[0_20px_40px_rgba(0,0,0,0.8)] z-40">
          <div className="text-[9px] font-black text-white/40 tracking-[0.3em] uppercase border-b border-white/5 pb-2 mb-4">
            Diagnostics
          </div>

          <div className="space-y-5 text-xs font-bold font-mono">
            <div>
              <div className="text-[9px] text-[#00E6FF]/50 uppercase tracking-widest mb-1 shadow-sm">
                Load Weight
              </div>
              <div
                className={`text-xl font-light ${stage >= 2 ? "text-[#FFB300] drop-shadow-[0_0_15px_rgba(255,179,0,0.4)]" : "text-slate-800"}`}
              >
                {stage >= 2 ? (
                  <div className="flex items-baseline gap-1">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {stage === 2
                        ? (Math.random() * 0.5 + 0.1).toFixed(2)
                        : "0.45"}
                    </motion.span>
                    <span className="text-[10px] uppercase font-bold text-[#FFB300]/50">
                      kg
                    </span>
                  </div>
                ) : (
                  <span className="opacity-30">
                    0.00 <span className="text-[10px]">kg</span>
                  </span>
                )}
              </div>
              {/* Stabilization mini-bar */}
              <div className="mt-1.5 w-full h-[2px] bg-[#041128] overflow-hidden">
                {stage === 2 && (
                  <motion.div
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-1/2 h-full bg-[#FFB300] shadow-[0_0_8px_#FFB300]"
                  ></motion.div>
                )}
                {stage > 2 && (
                  <div className="w-full h-full bg-[#FFB300]/30 transition-all duration-500"></div>
                )}
              </div>
            </div>

            <div>
              <div className="text-[9px] text-[#00E6FF]/50 uppercase tracking-widest mb-1">
                AI Classification
              </div>
              <div
                className={`text-[11px] leading-tight mt-1 transition-colors duration-500 ${stage >= 3 ? "drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" : "text-slate-800"}`}
                style={{ color: stage >= 3 ? targetColorHex : "" }}
              >
                {stage >= 3 ? (
                  <div className="flex flex-col gap-1">
                    <span
                      className="truncate block"
                      style={{ maxWidth: "100%" }}
                    >
                      {wasteType}
                    </span>
                    <span className="text-[9px] font-black opacity-60">
                      CONFIDENCE: 98.4%
                    </span>
                  </div>
                ) : (
                  "AWAITING SCAN"
                )}
              </div>
            </div>

            <div>
              <div className="text-[9px] text-[#00E6FF]/50 uppercase tracking-widest mb-1">
                Routing Matrix
              </div>
              <div
                className={`text-[10px] uppercase tracking-wider mt-1 transition-colors duration-500 flex items-center gap-2 ${isSorting ? "text-[#FF8A00] drop-shadow-[0_0_10px_rgba(255,138,0,0.5)]" : "text-slate-800"}`}
              >
                {isSorting && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00] animate-pulse shadow-[0_0_5px_#FF8A00]"></span>
                )}
                {isSorting ? "SORTING ENGAGED" : "STANDBY"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Timeline Footer */}
      <div className="mt-14 flex justify-between relative px-2 max-w-2xl mx-auto z-20">
        <div className="absolute top-3.5 left-4 right-4 h-[2px] bg-[#1e293b]/40 rounded-full"></div>

        {/* Animated Progress Line */}
        <div
          className="absolute top-3.5 left-4 h-[2px] transition-all duration-1000 ease-in-out rounded-full shadow-[0_0_15px_#00E6FF]"
          style={{
            width: `calc(${(stage / 6) * 100}% - 32px)`,
            background:
              "linear-gradient(90deg, transparent, #00E6FF 50%, #ffffff)",
          }}
        ></div>

        {[
          { label: "Input", icon: <Database />, color: "#00E6FF" },
          { label: "Scan", icon: <Camera />, color: "#FF2965" },
          { label: "Weigh", icon: <Scale />, color: "#FFB300" },
          { label: "Classify", icon: <Cpu />, color: "#7A5FFF" },
          { label: "Sort", icon: <Activity />, color: "#FF8A00" },
          { label: "Store", icon: <ShieldCheck />, color: targetColorHex },
        ].map((step, idx) => {
          const stepStage =
            idx === 0
              ? 1
              : idx === 1
                ? 2
                : idx === 2
                  ? 2
                  : idx === 3
                    ? 3
                    : idx === 4
                      ? 4
                      : 6;
          const isPast = stage > stepStage || stage === 6;
          const isActive = stage === stepStage || (idx === 5 && stage === 6);
          const shadowColor = isActive || isPast ? step.color : "transparent";
          const bgOpacity = isActive ? "0.2" : isPast ? "0.05" : "0";

          return (
            <div
              key={idx}
              className="relative z-10 flex flex-col items-center group/step cursor-default"
            >
              {/* Core Node */}
              <div
                className={`w-9 h-9 lg:w-11 lg:h-11 rounded-xl flex items-center justify-center transition-all duration-700 bg-[#020612] ${isActive ? "scale-125" : "scale-100"} backdrop-blur-md relative overflow-hidden`}
                style={{
                  borderColor:
                    isActive || isPast ? `${step.color}80` : "#1e293b",
                  borderWidth: "1px",
                  boxShadow: isActive
                    ? `0 0 40px ${shadowColor}90, inset 0 2px 2px ${shadowColor}90, inset 0 -5px 25px ${shadowColor}40`
                    : isPast
                      ? `0 0 20px ${shadowColor}50`
                      : "0 4px 10px rgba(0,0,0,0.5)",
                }}
              >
                <div
                  className="absolute inset-0 transition-opacity duration-700"
                  style={{
                    background: isActive
                      ? `radial-gradient(ellipse at right, ${step.color}60 0%, transparent 80%), radial-gradient(ellipse at left, ${step.color}20 0%, transparent 80%)`
                      : "transparent",
                    opacity: isActive ? 1 : 0,
                  }}
                ></div>
                {React.cloneElement(step.icon as React.ReactElement<any>, {
                  className: `w-3.5 h-3.5 transition-all duration-700 ${isActive ? "drop-shadow-lg" : ""} relative z-10`,
                  style: {
                    color: isActive ? "#fff" : isPast ? step.color : "#475569",
                    filter: isActive
                      ? `drop-shadow(0 0 8px ${step.color})`
                      : "none",
                  },
                })}
              </div>
              <div
                className={`mt-4 sm:mt-5 text-[9px] sm:text-[10px] lg:text-[11px] font-black tracking-widest uppercase transition-all duration-700 font-mono`}
                style={{
                  color: isActive
                    ? "#ffffff"
                    : isPast
                      ? `${step.color}90`
                      : "#475569",
                  textShadow: isActive ? `0 0 12px ${shadowColor}` : "none",
                }}
              >
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
