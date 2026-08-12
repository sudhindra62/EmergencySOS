import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  Send,
  Cpu,
  Box,
  Database,
  HardDrive,
  RefreshCw,
  AlertTriangle,
  Zap,
  Server,
  Navigation,
  Brain,
  Scan,
  Play,
  Pause,
  FastForward,
  RotateCcw,
  Clock,
  History,
  CheckCircle2,
} from "lucide-react";

export default function SmartBinSimulationTab({
  currentLang = "en",
}: {
  currentLang?: string;
}) {
  const [stage, setStage] = useState<number>(0);
  const [wasteType, setWasteType] = useState<string>("Standby");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [aiData, setAiData] = useState<any>(null);

  // Playback Controls
  const [isSlowMotion, setIsSlowMotion] = useState(false);
  const [isAuto, setIsAuto] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const speed = isSlowMotion ? 2.5 : 1;
  const [history, setHistory] = useState<
    { type: string; time: string; hazard: boolean }[]
  >([]);

  // Left form
  const [isRecording, setIsRecording] = useState(false);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  useEffect(() => {
    return () => clearAllTimeouts();
  }, []);

  const handleDropSimulation = (type: string) => {
    setInputValue(`Simulation inserted: ${type}`);
    setWasteType(type);
    triggerSimulationFlow(type);
  };

  const resetSimulation = () => {
    clearAllTimeouts();
    setStage(0);
    setIsProcessing(false);
    setWasteType("Standby");
    setAiData(null);
  };

  const triggerSimulationFlow = async (text: string) => {
    clearAllTimeouts();
    setIsProcessing(true);
    setStage(1); // Scan
    setWasteType("Scanning Payload...");
    setAiData(null);

    // Hardware flow timeline
    timeoutsRef.current.push(setTimeout(() => setStage(2), 1500 * speed)); // Weigh & Sensors
    timeoutsRef.current.push(setTimeout(() => setStage(3), 3000 * speed)); // Classify Start

    try {
      const response = await fetch("/api/assistant-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Evaluate this waste simulation physically inserted into the smart bin: ${text}`,
          language: currentLang,
        }),
      });

      const chatData = await response.json();

      // Delay applying the result until stage 3 has been shown
      timeoutsRef.current.push(
        setTimeout(() => {
          setAiData(chatData);
          const detectedWaste =
            chatData?.waste_detection || text.split(":")[1] || "General Waste";
          setWasteType(detectedWaste);
          setStage(4); // Decision & Gate opens

          const isHaz =
            chatData?.severity_assessment === "Critical" ||
            chatData?.severity_assessment === "Severe";
          setHistory((prev) =>
            [
              {
                type: detectedWaste,
                time: new Date().toLocaleTimeString(),
                hazard: isHaz,
              },
              ...prev,
            ].slice(0, 5),
          );

          timeoutsRef.current.push(setTimeout(() => setStage(5), 1500 * speed)); // Drop
          timeoutsRef.current.push(
            setTimeout(() => {
              setStage(6); // Success
              setIsProcessing(false);

              if (isAuto) {
                timeoutsRef.current.push(
                  setTimeout(() => {
                    handleDropSimulation(text);
                  }, 3000),
                );
              }
            }, 3000 * speed),
          );
        }, 4000 * speed),
      ); // Wait from the start
    } catch (err) {
      console.error(err);
      timeoutsRef.current.push(
        setTimeout(() => {
          const detectedWaste = text.split(":")[1] || "General Waste";
          setWasteType(detectedWaste);
          setStage(4);
          setHistory((prev) =>
            [
              {
                type: detectedWaste,
                time: new Date().toLocaleTimeString(),
                hazard: false,
              },
              ...prev,
            ].slice(0, 5),
          );

          timeoutsRef.current.push(setTimeout(() => setStage(5), 1500 * speed));
          timeoutsRef.current.push(
            setTimeout(() => {
              setStage(6);
              setIsProcessing(false);
            }, 3000 * speed),
          );
        }, 4000 * speed),
      );
    }
  };

  const handleManualSubmit = () => {
    if (!inputValue.trim()) return;
    setWasteType("User Upload");
    triggerSimulationFlow(inputValue);
  };

  const isHazard =
    aiData?.severity_assessment === "Critical" ||
    aiData?.severity_assessment === "Severe";

  const getBinIndex = () => {
    if (!aiData) return 2; // wet/center default
    const txt = (aiData.waste_detection || wasteType).toLowerCase();
    if (txt.includes("plastic") || txt.includes("pet")) return 0; // plastic
    if (txt.includes("dry") || txt.includes("paper")) return 1; // dry
    if (txt.includes("medical") || txt.includes("hazard")) return 3; // medical
    if (txt.includes("battery") || txt.includes("electronic")) return 4; // battery
    return 2; // wet center
  };

  const currentBinIndex = getBinIndex();
  const binPositions = ["15%", "32.5%", "50%", "67.5%", "85%"];
  // Provide specific throwing angles as per instructions
  const getSimRotation = () => {
    if (currentBinIndex === 0) return -45; // Plastic
    if (currentBinIndex === 1) return -20; // Dry
    if (currentBinIndex === 2) return 0; // Wet
    if (currentBinIndex === 3) return 45; // Medical
    if (currentBinIndex === 4) return 70; // Battery
    return 0; // Center
  };

  // stage 4 is rotating, stage 5 is falling, stage >= 6 is stored
  const targetLeft = stage >= 5 ? binPositions[currentBinIndex] : "50%";

  return (
    <div className="min-h-[85vh] flex flex-col pt-4">
      <div className="flex justify-between items-center mb-6 z-10 px-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-widest drop-shadow-[0_0_15px_rgba(34,211,238,0.4)] flex items-center gap-3 uppercase">
            <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
            AI SMART BIN — INTERNAL DIGITAL TWIN
          </h1>
          <span className="text-xs md:text-sm text-cyan-400/70 font-mono tracking-widest uppercase ml-11">
            Autonomous Waste Recognition • Mechanical Sorting • Storage
            Intelligence
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400">
          <span className="hidden md:flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> GPU: Idle
          </span>
          <span className="hidden md:flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-blue-400" /> Latency: 12ms
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-6 pb-12 flex-1">
        {/* LEFT COLUMN: INPUTS & CONTROLS */}
        <div className="col-span-1 md:col-span-3 space-y-6 flex flex-col">
          <div className="bg-black/40 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/30 transition-all">
            <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-xs border-b border-slate-800 pb-2">
              Manual Input Console
            </h3>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. Broken LCD screen..."
              className="w-full bg-slate-900/50 rounded-xl border border-slate-800 p-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors h-24 mb-4 resize-none"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border ${isRecording ? "bg-red-500/20 border-red-500 text-red-500 animate-pulse" : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"}`}
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={handleManualSubmit}
                disabled={isProcessing || !inputValue.trim()}
                className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
              >
                {isProcessing ? "Processing..." : "Insert"}{" "}
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SIMULATION CONTROLS */}
          <div className="bg-black/40 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden group">
            <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-xs border-b border-slate-800 pb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-slate-400" /> Prototype Controls
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => setIsSlowMotion(!isSlowMotion)}
                className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all border ${isSlowMotion ? "bg-indigo-600/20 border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"}`}
              >
                <Clock className="w-4 h-4" /> Slow Mo
              </button>
              <button
                onClick={() => setIsAuto(!isAuto)}
                className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all border ${isAuto ? "bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]" : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"}`}
              >
                <RefreshCw
                  className={`w-4 h-4 ${isAuto ? "animate-spin" : ""}`}
                />{" "}
                Auto
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={resetSimulation}
                className="w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all bg-slate-800/50 border border-slate-700 text-red-400 hover:bg-red-500/20 hover:border-red-500"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>

          {/* SIMULATOR QUICK INSERTS */}
          <div className="bg-black/40 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
            <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-xs border-b border-slate-800 pb-2">
              Hardware Drop Simulators
            </h3>
            <div className="space-y-3">
              {[
                { label: "Plastic Bottles", type: "Plastic Waste" },
                { label: "Medical Syringe", type: "Hazardous Medical Waste" },
                { label: "Used Battery", type: "Chemical Battery Waste" },
                { label: "Organic Food", type: "Organic Wet Waste" },
              ].map((sim) => (
                <button
                  key={sim.label}
                  onClick={() => handleDropSimulation(sim.type)}
                  disabled={isProcessing && !isAuto}
                  className="w-full bg-slate-800/50 hover:bg-slate-700 text-left px-4 py-3 rounded-xl border border-slate-700 hover:border-slate-500 transition-all text-xs font-mono text-slate-300 disabled:opacity-50 group flex items-center justify-between"
                >
                  {sim.label}
                  <Box className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:text-amber-400" />
                </button>
              ))}
            </div>
          </div>

          {/* HISTORY TIMELINE */}
          <div className="bg-black/40 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md flex-1 flex flex-col">
            <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-xs border-b border-slate-800 pb-2 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" /> Recents Pipeline
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {history.length === 0 ? (
                <div className="text-slate-600 text-xs text-center py-4 font-mono">
                  No simulation history.
                </div>
              ) : (
                history.map((h, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border flex items-center justify-between ${h.hazard ? "bg-red-500/10 border-red-500/30" : "bg-slate-800/30 border-slate-700"}`}
                  >
                    <div className="flex flex-col">
                      <span
                        className={`text-xs font-bold ${h.hazard ? "text-red-400" : "text-slate-300"}`}
                      >
                        {h.type.substring(0, 20)}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono mt-0.5">
                        {h.time}
                      </span>
                    </div>
                    {h.hazard ? (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: BIN DIGITAL TWIN BLUEPRINT */}
        <div className="col-span-1 md:col-span-6 flex flex-col items-center justify-center relative min-h-[600px]">
          <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>

          <div
            className={`relative w-full max-w-md aspect-[1/1.6] rounded-t-3xl rounded-b-xl border border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl shadow-[inset_0_0_80px_rgba(6,182,212,0.05),0_0_50px_rgba(6,182,212,0.05)] flex flex-col items-center overflow-hidden transition-all duration-700 ${isHazard && stage >= 4 ? "border-red-500/50 shadow-[inset_0_0_80px_rgba(239,68,68,0.1),0_0_50px_rgba(239,68,68,0.1)]" : ""}`}
          >
            {/* BLUEPRINT OVERLAYS & AMBIENT EFFECTS */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
              {/* Grid */}
              <div
                className="w-full h-full opacity-10"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(6, 182, 212, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.4) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              ></div>
              {/* Wire Traces */}
              <svg
                className="absolute inset-0 w-full h-full opacity-20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 20 20 L 40 20 L 40 100 L 100 100"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <path
                  d="M 380 50 L 350 50 L 350 200 L 200 200"
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <path
                  d="M 50 300 L 80 300 L 80 400 L 150 400"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              </svg>
              {/* Sensor IDs */}
              <div className="absolute top-8 right-8 text-[5px] font-mono text-cyan-400/50">
                CAM_SYS_1A
              </div>
              <div className="absolute top-[28%] left-8 text-[5px] font-mono text-amber-400/50">
                WT_SNSR_09
              </div>
              <div className="absolute top-[48%] right-8 text-[5px] font-mono text-indigo-400/50">
                NPU_CORE_VX
              </div>
              <div className="absolute top-[68%] left-8 text-[5px] font-mono text-orange-400/50">
                SRV_MT_L2
              </div>
            </div>

            <style>{`
               @keyframes scanline {
                 0% { transform: translateY(0) scaleY(1); opacity: 1; }
                 50% { transform: translateY(80px) scaleY(1.5); opacity: 0.5; }
                 100% { transform: translateY(0) scaleY(1); opacity: 1; }
               }
               .animate-scanline { animation: scanline 2.5s ease-in-out infinite; }
               @keyframes datastream {
                 0% { transform: translateX(-100%); }
                 100% { transform: translateX(300%); }
               }
               .animate-datastream { animation: datastream 1.5s linear infinite; }
               @keyframes rotateLeft {
                 0%, 100% { transform: rotate(0deg); }
                 50% { transform: rotate(-35deg); }
               }
               @keyframes rotateRight {
                 0%, 100% { transform: rotate(0deg); }
                 50% { transform: rotate(35deg); }
               }
               @keyframes floatDust {
                 0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
                 50% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
               }
               @keyframes bounceDrop {
                 0% { transform: translateY(0) scale(1); }
                 50% { transform: translateY(15px) scale(0.9); }
                 100% { transform: translateY(0) scale(1); }
               }
             `}</style>

            {/* Smart Bin Entry (Top Lid & Ambient Dust) */}
            <div className="absolute top-0 w-full h-[5%] z-50 flex justify-center items-center overflow-visible">
              {/* Entry aperture */}
              <div className="w-1/3 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent shadow-[0_0_15px_#22d3ee] rounded-full"></div>
              {/* Animated Lid Flaps */}
              <div
                className={`absolute top-0 w-1/4 h-2 bg-slate-800 border-b border-r border-cyan-500/30 rounded-bl-sm transition-transform duration-500 origin-top-left ${stage === 1 ? "-rotate-45" : "rotate-0"}`}
                style={{ left: "16.6%" }}
              ></div>
              <div
                className={`absolute top-0 w-1/4 h-2 bg-slate-800 border-b border-l border-cyan-500/30 rounded-br-sm transition-transform duration-500 origin-top-right ${stage === 1 ? "rotate-45" : "rotate-0"}`}
                style={{ right: "16.6%" }}
              ></div>
              {/* Dust Particles */}
              {stage === 1 && (
                <>
                  <div
                    className="absolute top-2 left-1/3 w-1 h-1 bg-white/20 rounded-full blur-[1px]"
                    style={{ animation: "floatDust 2s ease-in-out infinite" }}
                  ></div>
                  <div
                    className="absolute top-4 right-1/3 w-1.5 h-1.5 bg-cyan-400/20 rounded-full blur-[1px]"
                    style={{
                      animation: "floatDust 3s ease-in-out infinite 0.5s",
                    }}
                  ></div>
                </>
              )}
            </div>

            {/* Dropping Object */}
            <div
              {...{
                className: `absolute flex flex-col items-center justify-center transition-all z-[70] ${stage >= 4 ? "ease-in" : "ease-out"} 
                ${stage === 0 ? "top-[0%] opacity-0 scale-50" : ""}
                ${stage === 1 ? "top-[6%] opacity-100 scale-100" : ""}
                ${stage === 2 || stage === 3 ? "top-[20%] opacity-100 scale-100" : ""}
                ${stage === 4 ? "top-[52%] opacity-100 scale-100" : ""}
                ${stage === 5 ? "top-[80%] opacity-100 scale-75" : ""}
                ${stage >= 6 ? "top-[85%] opacity-0 scale-50" : ""}
              `,
              }}
              style={{
                left: targetLeft,
                transform: `translateX(-50%)`,
                transitionDuration: `${stage >= 5 ? 800 * speed : 800 * speed}ms`,
                marginTop: stage === 6 ? "15px" : "0px",
              }}
            >
              {/* Particle Trail */}
              {stage >= 4 && stage <= 6 && (
                <div className="absolute -top-6 w-1 h-8 bg-gradient-to-t from-cyan-400/50 to-transparent blur-sm rounded-full animate-pulse"></div>
              )}

              <div
                className={`w-12 h-12 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.5)] flex items-center justify-center backdrop-blur-md border ${isHazard && stage >= 4 ? "bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]" : "bg-indigo-500/30 border-indigo-500 text-indigo-300"} ${stage === 6 ? "animate-[bounceDrop_0.3s_ease-out]" : ""}`}
              >
                <Box
                  className={`w-5 h-5 ${stage === 5 ? "animate-spin" : ""}`}
                  style={{ animationDuration: "1s" }}
                />
              </div>
              {/* Trajectory dashed line */}
              {stage === 5 && (
                <div className="absolute top-12 bottom-[-100px] w-[2px] border-l-2 border-dashed border-cyan-500/30 -z-10 animate-pulse"></div>
              )}
            </div>

            {/* 1. Camera Module (Top) */}
            <div
              className={`w-full p-4 border-b border-cyan-900/30 relative transition-colors duration-500 h-[15%] flex justify-center items-center overflow-hidden ${stage === 1 ? "bg-cyan-900/10" : ""}`}
            >
              <div className="text-[9px] font-mono text-cyan-400/80 uppercase tracking-widest absolute top-2 left-4 z-10 flex flex-col font-bold">
                <span className="flex items-center gap-1.5">
                  <Scan className="w-3 h-3" /> Vision Scan Engine
                </span>
                <span
                  className={`text-[7px] mt-0.5 ${stage === 1 ? "text-cyan-400 animate-pulse" : "text-slate-600"}`}
                >
                  {stage === 1 ? "ACTIVE_SCAN" : "STANDBY"}
                </span>
              </div>

              {/* Holographic Data Overlay */}
              <div
                className={`absolute right-4 top-2 text-[6px] font-mono text-cyan-300 text-right opacity-0 transition-opacity duration-300 ${stage === 1 ? "opacity-100" : ""}`}
              >
                <div className="font-bold border-b border-cyan-800 pb-0.5 mb-1">
                  OPTICS DATA
                </div>
                <div>OBJ: {wasteType.substring(0, 10)}...</div>
                <div>CONF: {aiData?.confidence_score || "98%"}</div>
                <div>
                  MAT: {(aiData?.waste_detection || wasteType).split(" ")[0]}
                </div>
              </div>

              {/* Dual cameras */}
              <div className="flex gap-4 mt-2">
                <div
                  className={`w-8 h-8 rounded-full border flex items-center justify-center relative overflow-hidden transition-all duration-500 ${stage === 1 ? "border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.6)]" : "border-slate-800"}`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${stage === 1 ? "bg-cyan-400 animate-pulse" : "bg-slate-800"}`}
                  ></div>
                </div>
                <div
                  className={`w-8 h-8 rounded-full border flex items-center justify-center relative overflow-hidden transition-all duration-500 delay-100 ${stage === 1 ? "border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.6)]" : "border-slate-800"}`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${stage === 1 ? "bg-indigo-400 animate-pulse" : "bg-slate-800"}`}
                  ></div>
                </div>
              </div>

              {/* Scan Laser sweeps and Depth Grid */}
              <div
                className={`absolute top-[40%] left-0 right-0 h-[100px] bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none transition-opacity duration-300 z-50 overflow-hidden ${stage === 1 ? "opacity-100" : "opacity-0"}`}
              >
                {/* Depth Grid */}
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)",
                    backgroundSize: "10px 10px",
                  }}
                ></div>
                {/* Sweep line */}
                <div className="w-full h-[2px] bg-cyan-400 shadow-[0_0_20px_#22d3ee] animate-scanline absolute top-0" />
              </div>
            </div>

            {/* 2. Weight Analysis Layer */}
            <div
              className={`w-full px-4 py-2 border-b border-cyan-900/30 relative flex gap-6 transition-colors duration-500 h-[12%] ${stage === 2 ? "bg-amber-900/10" : ""}`}
            >
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-[7px] font-mono text-slate-400 mb-1 uppercase tracking-widest flex justify-between gap-1 items-end">
                  <span>Weight Analytics</span>
                  <span
                    className={
                      stage >= 2
                        ? "text-amber-400 font-black text-[9px] drop-shadow-[0_0_5px_#fbbf24]"
                        : "text-slate-600 text-[9px]"
                    }
                  >
                    {stage >= 2 ? "42.5g" : "0.0g"}
                  </span>
                </div>
                {/* Platform visual with springs */}
                <div className="relative mt-2">
                  <div
                    className={`w-full h-1.5 rounded-full transition-all duration-[400ms] flex items-center justify-center border relative z-10 ${stage >= 2 ? "border-amber-500 bg-amber-500/20 translate-y-1.5 shadow-[0_0_10px_rgba(245,158,11,0.5)]" : "border-slate-700 bg-slate-800"}`}
                  ></div>
                  {/* Springs */}
                  <div className="absolute top-0 left-4 w-1 flex flex-col gap-[1px]">
                    <div
                      className={`w-full h-1 border border-slate-600 transition-all ${stage >= 2 ? "h-[2px]" : ""}`}
                    ></div>
                    <div
                      className={`w-full h-1 border border-slate-600 transition-all ${stage >= 2 ? "h-[2px]" : ""}`}
                    ></div>
                  </div>
                  <div className="absolute top-0 right-4 w-1 flex flex-col gap-[1px]">
                    <div
                      className={`w-full h-1 border border-slate-600 transition-all ${stage >= 2 ? "h-[2px]" : ""}`}
                    ></div>
                    <div
                      className={`w-full h-1 border border-slate-600 transition-all ${stage >= 2 ? "h-[2px]" : ""}`}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="w-[1px] bg-slate-800 my-2"></div>

              <div className="flex-1 flex flex-col justify-center items-center">
                <div className="text-[7px] font-mono text-slate-400 mb-2 uppercase tracking-widest w-full text-center">
                  Material Sensors
                </div>
                <div className="grid grid-cols-3 gap-1 px-1 w-full bg-slate-900/50 p-1 rounded-sm border border-slate-800/50">
                  <div
                    className={`w-full h-1.5 rounded-[1px] ${stage >= 2 ? "bg-blue-400 shadow-[0_0_5px_#3b82f6] animate-pulse duration-75" : "bg-slate-800"}`}
                    title="Moisture"
                  ></div>
                  <div
                    className={`w-full h-1.5 rounded-[1px] ${stage >= 2 ? "bg-emerald-400 shadow-[0_0_5px_#34d399] animate-pulse delay-75 duration-75" : "bg-slate-800"}`}
                    title="Organic"
                  ></div>
                  <div
                    className={`w-full h-1.5 rounded-[1px] ${stage >= 2 && isHazard ? "bg-red-500 shadow-[0_0_5px_#ef4444] animate-pulse delay-150 duration-75" : stage >= 2 ? "bg-slate-700" : "bg-slate-800"}`}
                    title="Chemical"
                  ></div>
                  <div
                    className={`w-full h-1.5 rounded-[1px] ${stage >= 2 ? "bg-slate-300 shadow-[0_0_5px_#cbd5e1] animate-pulse delay-200 duration-75" : "bg-slate-800"}`}
                    title="Metal"
                  ></div>
                  <div
                    className={`w-full h-1.5 rounded-[1px] ${stage >= 2 ? "bg-purple-400 shadow-[0_0_5px_#c084fc] animate-pulse delay-[250ms] duration-75" : "bg-slate-800"}`}
                    title="Conductive"
                  ></div>
                  <div
                    className={`w-full h-1.5 rounded-[1px] ${stage >= 2 ? "bg-orange-400 shadow-[0_0_5px_#fb923c] animate-pulse delay-[300ms] duration-75" : "bg-slate-800"}`}
                    title="Thermal"
                  ></div>
                </div>
              </div>
            </div>

            {/* 3. AI Core */}
            <div
              className={`w-full px-4 py-3 border-b border-cyan-900/30 flex flex-col items-center justify-center relative transition-colors duration-500 h-[22%] ${stage === 3 || stage === 4 ? "bg-indigo-900/10" : ""}`}
            >
              <div className="text-[7px] font-mono text-indigo-400/80 uppercase tracking-widest absolute top-2 left-4 font-bold flex items-center gap-1.5">
                <Brain className="w-2.5 h-2.5" /> Holographic AI Core
              </div>

              <div
                className={`w-14 h-14 rotate-45 rounded-xl border-2 flex items-center justify-center relative mt-2 z-10 transition-all duration-700 ${stage >= 3 ? "border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.5)] bg-slate-950/90" : "border-slate-800 bg-slate-950"}`}
              >
                <div className="-rotate-45 text-center flex flex-col items-center justify-center">
                  <Cpu
                    className={`w-6 h-6 transition-colors duration-500 ${stage === 3 ? "text-indigo-400 animate-pulse" : stage >= 4 ? (isHazard ? "text-red-400 drop-shadow-[0_0_10px_#ef4444]" : "text-emerald-400 drop-shadow-[0_0_10px_#10b981]") : "text-slate-700"}`}
                  />
                </div>
                {/* Neural network routes */}
                {stage >= 3 && (
                  <>
                    <div
                      className="absolute -inset-4 border border-indigo-500/20 rounded-xl"
                      style={{ transform: "rotate(15deg)" }}
                    ></div>
                    <div
                      className="absolute -inset-4 border border-indigo-500/20 rounded-xl"
                      style={{ transform: "rotate(-15deg)" }}
                    ></div>

                    <div className="absolute inset-x-[-20px] top-1/2 h-[1px] bg-indigo-500/20 -rotate-45 overflow-hidden">
                      <div className="w-1/2 h-full bg-cyan-300 shadow-[0_0_10px_#67e8f9] animate-datastream" />
                    </div>
                    <div className="absolute inset-y-[-20px] left-1/2 w-[1px] bg-indigo-500/20 -rotate-45 overflow-hidden">
                      <div
                        className="h-1/2 w-full bg-indigo-300 shadow-[0_0_10px_#818cf8] animate-datastream"
                        style={{ animationDirection: "reverse" }}
                      />
                    </div>
                  </>
                )}
              </div>

              <div
                className={`absolute right-4 top-1/2 -translate-y-1/2 text-right transition-opacity duration-500 w-32 ${stage >= 4 ? "opacity-100" : "opacity-0"}`}
              >
                <div className="text-[6px] uppercase font-mono text-slate-500 mb-0.5 tracking-widest border-b border-slate-700/50 pb-1">
                  Decision Engine Output
                </div>
                <div
                  className={`text-[9px] font-black leading-tight mt-1 truncate ${isHazard ? "text-red-400" : "text-emerald-400"}`}
                >
                  {wasteType}
                  <br />
                  <span className="text-cyan-400 drop-shadow-[0_0_5px_#22d3ee]">
                    {aiData?.confidence_score || "98%"} Match
                  </span>
                </div>
                {/* Decorative connecting line */}
                <div className="absolute top-1/2 -left-8 w-6 border-b border-dashed border-cyan-500/30"></div>
              </div>
            </div>

            {/* 4. Mechanical Sorting Platform (Rotating) */}
            <div
              className={`w-full p-2 border-b border-cyan-900/30 relative transition-colors duration-500 h-[10%] max-h-[10%] flex flex-col justify-center items-center ${stage === 4 ? "bg-orange-900/10" : ""}`}
            >
              <div className="absolute top-1 left-2 text-[7px] font-mono text-orange-400/80 uppercase">
                Rotating Throw Platform
              </div>
              <div className="relative w-full flex justify-center items-center mt-2">
                {/* Center hub */}
                <div className="absolute w-4 h-4 rounded-full bg-slate-900 border border-slate-700 z-10 flex items-center justify-center">
                  <div
                    className={`w-1 h-1 rounded-full ${stage >= 4 ? "bg-orange-400 shadow-[0_0_8px_#f97316]" : "bg-slate-600"}`}
                  ></div>
                </div>

                {/* The rotating tray */}
                <div
                  className="relative w-20 flex justify-center items-center transition-all ease-in-out origin-center"
                  style={{
                    transform:
                      stage === 5
                        ? `rotate(${getSimRotation()}deg)`
                        : "rotate(0deg)",
                    transitionDuration: `${800 * speed}ms`,
                  }}
                >
                  <div className="h-1.5 w-full bg-orange-500 rounded-full shadow-[0_0_10px_#f97316] border border-orange-300 flex justify-center items-center">
                    {/* Locking mechanism visual */}
                    <div
                      className={`w-3 h-1 ${stage >= 4 ? "bg-red-500 opacity-100" : "bg-transparent opacity-0"} transition-colors duration-300`}
                    ></div>
                  </div>
                </div>

                {/* Blueprint lines to storage */}
                <div className="absolute top-1/2 left-[20%] w-[1px] h-10 border-l border-dashed border-cyan-500/20 -z-10"></div>
                <div className="absolute top-1/2 right-[20%] w-[1px] h-10 border-l border-dashed border-cyan-500/20 -z-10"></div>
              </div>
            </div>

            {/* 5. Storage Chambers */}
            <div className="flex-1 w-full flex pt-3 px-2 gap-1.5 bg-slate-950/80 overflow-hidden relative border-t border-slate-800/80">
              {/* Bin 0: Plastic */}
              <div className="flex-1 rounded-t-sm border border-b-0 border-slate-800 flex flex-col justify-end relative overflow-hidden bg-slate-900/40 backdrop-blur-sm group">
                <div className="absolute top-2 w-full text-center z-10 transition-opacity">
                  <div className="text-[6px] font-bold font-mono text-slate-400 uppercase tracking-tighter shadow-black drop-shadow-md">
                    Plastic
                  </div>
                </div>
                <div className="absolute top-10 left-0 right-0 flex justify-center opacity-30">
                  <Database className="w-6 h-6 text-cyan-500" strokeWidth={1} />
                </div>
                <div className="w-full absolute bottom-0 left-0 right-0 p-1 flex justify-between text-[4px] font-mono text-cyan-400/50 z-20">
                  <span>VOL: 22L</span>
                  <span>WGT: 14kg</span>
                </div>
                <div
                  className={`w-full transition-all ease-out duration-[2000ms] relative bottom-0 z-10 ${currentBinIndex === 0 && stage >= 6 ? "h-[60%]" : "h-[20%]"}`}
                >
                  <div className="absolute inset-0 bg-blue-900/40 border-t border-blue-500/50 shadow-[inset_0_20px_50px_rgba(59,130,246,0.1)] backdrop-blur-[2px]">
                    {currentBinIndex === 0 && stage >= 6 && (
                      <div className="absolute inset-0 bg-blue-400/10 animate-pulse"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bin 1: Dry */}
              <div className="flex-1 rounded-t-sm border border-b-0 border-slate-800 flex flex-col justify-end relative overflow-hidden bg-slate-900/40 backdrop-blur-sm group">
                <div className="absolute top-2 w-full text-center z-10">
                  <div className="text-[6px] font-bold font-mono text-slate-400 uppercase tracking-tighter shadow-black drop-shadow-md">
                    Dry
                  </div>
                </div>
                <div className="absolute top-10 left-0 right-0 flex justify-center opacity-30">
                  <Database
                    className="w-6 h-6 text-amber-500"
                    strokeWidth={1}
                  />
                </div>
                <div className="w-full absolute bottom-0 left-0 right-0 p-1 flex justify-between text-[4px] font-mono text-amber-400/50 z-20">
                  <span>VOL: 45L</span>
                  <span>WGT: 18kg</span>
                </div>
                <div
                  className={`w-full transition-all ease-out duration-[2000ms] relative bottom-0 z-10 ${currentBinIndex === 1 && stage >= 6 ? "h-[60%]" : "h-[30%]"}`}
                >
                  <div className="absolute inset-0 bg-amber-900/40 border-t border-amber-500/50 shadow-[inset_0_20px_50px_rgba(245,158,11,0.1)] backdrop-blur-[2px]">
                    {currentBinIndex === 1 && stage >= 6 && (
                      <div className="absolute inset-0 bg-amber-400/10 animate-pulse"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bin 2: Wet */}
              <div className="flex-1 rounded-t-sm border border-b-0 border-slate-800 flex flex-col justify-end relative overflow-hidden bg-slate-900/40 backdrop-blur-sm group">
                <div className="absolute top-2 w-full text-center z-10">
                  <div className="text-[6px] font-bold font-mono text-slate-400 uppercase tracking-tighter shadow-black drop-shadow-md">
                    Wet
                  </div>
                </div>
                <div className="absolute top-10 left-0 right-0 flex justify-center opacity-30">
                  <Database
                    className="w-6 h-6 text-emerald-500"
                    strokeWidth={1}
                  />
                </div>
                <div className="w-full absolute bottom-0 left-0 right-0 p-1 flex justify-between text-[4px] font-mono text-emerald-400/50 z-20">
                  <span>VOL: 60L</span>
                  <span>TMP: 28C</span>
                </div>
                <div
                  className={`w-full transition-all ease-out duration-[2000ms] relative bottom-0 z-10 ${currentBinIndex === 2 && stage >= 6 ? "h-[60%]" : "h-[40%]"}`}
                >
                  <div className="absolute inset-0 bg-emerald-900/40 border-t border-emerald-500/50 shadow-[inset_0_20px_50px_rgba(16,185,129,0.1)] backdrop-blur-[2px]">
                    {currentBinIndex === 2 && stage >= 6 && (
                      <div className="absolute inset-0 bg-emerald-400/10 animate-pulse"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bin 3: Medical */}
              <div className="flex-1 rounded-t-sm border border-b-0 border-slate-800 flex flex-col justify-end relative overflow-hidden bg-slate-900/40 backdrop-blur-sm group">
                <div className="absolute top-2 w-full text-center z-10">
                  <div className="text-[6px] font-bold font-mono text-red-500 uppercase tracking-tighter shadow-black drop-shadow-md">
                    Medical
                  </div>
                </div>
                <div className="absolute top-10 left-0 right-0 flex justify-center opacity-30">
                  <Database className="w-6 h-6 text-red-500" strokeWidth={1} />
                </div>
                <div className="w-full absolute bottom-0 left-0 right-0 p-1 flex justify-between text-[4px] font-mono text-red-400/50 z-20">
                  <span>VOL: 8L</span>
                  <span>LVL: WARN</span>
                </div>
                <div
                  className={`w-full transition-all ease-out duration-[2000ms] relative bottom-0 z-10 ${currentBinIndex === 3 && stage >= 6 ? "h-[60%]" : "h-[15%]"}`}
                >
                  <div className="absolute inset-0 bg-red-900/40 border-t border-red-500/50 shadow-[inset_0_20px_50px_rgba(239,68,68,0.1)] backdrop-blur-[2px]">
                    {currentBinIndex === 3 && stage >= 6 && (
                      <div className="absolute inset-0 bg-red-400/20 animate-pulse"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bin 4: Battery */}
              <div className="flex-1 rounded-t-sm border border-b-0 border-slate-800 flex flex-col justify-end relative overflow-hidden bg-slate-900/40 backdrop-blur-sm group">
                <div className="absolute top-2 w-full text-center z-10">
                  <div className="text-[6px] font-bold font-mono text-orange-500 uppercase tracking-tighter shadow-black drop-shadow-md">
                    Battery
                  </div>
                </div>
                <div className="absolute top-10 left-0 right-0 flex justify-center opacity-30">
                  <Database
                    className="w-6 h-6 text-orange-500"
                    strokeWidth={1}
                  />
                </div>
                <div className="w-full absolute bottom-0 left-0 right-0 p-1 flex justify-between text-[4px] font-mono text-orange-400/50 z-20">
                  <span>VOL: 2L</span>
                  <span>TMP: 24C</span>
                </div>
                <div
                  className={`w-full transition-all ease-out duration-[2000ms] relative bottom-0 z-10 ${currentBinIndex === 4 && stage >= 6 ? "h-[60%]" : "h-[2%]"}`}
                >
                  <div className="absolute inset-0 bg-orange-900/40 border-t border-orange-500/50 shadow-[inset_0_20px_50px_rgba(249,115,22,0.1)] backdrop-blur-[2px]">
                    {currentBinIndex === 4 && stage >= 6 && (
                      <div className="absolute inset-0 bg-orange-400/20 animate-pulse"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Flow Pipeline Indicator */}
          <div className="mt-6 flex flex-col w-full max-w-md px-2 relative z-10">
            <div className="flex justify-between text-[7px] md:text-[8px] font-mono font-bold uppercase text-slate-500 mb-2">
              <span className={stage >= 0 ? "text-cyan-400 glow-cyan-500" : ""}>
                Input
              </span>
              <span className={stage >= 1 ? "text-cyan-400 glow-cyan-500" : ""}>
                Scan
              </span>
              <span className={stage >= 2 ? "text-cyan-400 glow-cyan-500" : ""}>
                Weigh
              </span>
              <span className={stage >= 3 ? "text-cyan-400 glow-cyan-500" : ""}>
                Classify
              </span>
              <span
                className={
                  stage >= 4
                    ? "text-orange-400 drop-shadow-[0_0_5px_#f97316]"
                    : ""
                }
              >
                Sort
              </span>
              <span className={stage >= 5 ? "text-cyan-400 glow-cyan-500" : ""}>
                Store
              </span>
              <span
                className={
                  stage >= 6 ? "text-emerald-400 glow-emerald-500" : ""
                }
              >
                Success
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex relative">
              <div
                className={`absolute top-0 bottom-0 left-0 bg-cyan-500 shadow-[0_0_10px_#06b6d4] transition-all duration-500 ease-out`}
                style={{ width: `${(stage / 6) * 100}%` }}
              ></div>
            </div>

            <div className="mt-5 text-center flex flex-wrap items-center justify-center gap-2 md:gap-3">
              <button
                onClick={() => {
                  if (!isProcessing) handleDropSimulation("Plastic Bottle");
                }}
                className={`transition-colors border border-slate-700/50 bg-slate-900/30 px-3 py-1.5 rounded-sm text-[10px] font-mono flex items-center gap-1 hover:bg-slate-800 hover:text-white ${isProcessing ? "pointer-events-none opacity-40" : "cursor-pointer text-slate-400"}`}
                title="Insert Waste"
              >
                <Play className="w-3 h-3" />
                INSERT
              </button>
              <button
                onClick={() => {
                  if (!isProcessing)
                    handleDropSimulation(
                      wasteType === "Standby" ? "Plastic Bottle" : wasteType,
                    );
                }}
                className={`transition-colors border border-slate-700/50 bg-slate-900/30 px-3 py-1.5 rounded-sm text-[10px] font-mono flex items-center gap-1 hover:bg-slate-800 hover:text-white ${isProcessing ? "pointer-events-none opacity-40" : "cursor-pointer text-slate-400"}`}
              >
                <RefreshCw
                  className={`w-3 h-3 ${isProcessing && "animate-spin"}`}
                />
                REPLAY
              </button>
              <button
                onClick={() => setIsSlowMotion(!isSlowMotion)}
                className={`transition-colors border ${isSlowMotion ? "border-cyan-500/50 bg-cyan-900/30 text-cyan-400" : "border-slate-700/50 bg-slate-900/30 text-slate-400"} px-3 py-1.5 rounded-sm text-[10px] font-mono flex items-center gap-1 hover:bg-slate-800 hover:text-white`}
              >
                <Clock className="w-3 h-3" />
                SLOW MO
              </button>
              <button
                onClick={() => setIsAuto(!isAuto)}
                className={`transition-colors border ${isAuto ? "border-indigo-500/50 bg-indigo-900/30 text-indigo-400" : "border-slate-700/50 bg-slate-900/30 text-slate-400"} px-3 py-1.5 rounded-sm text-[10px] font-mono flex items-center gap-1 hover:bg-slate-800 hover:text-white`}
              >
                <FastForward className="w-3 h-3" />
                AUTO
              </button>
              <button
                onClick={resetSimulation}
                className="transition-colors border border-red-900/50 bg-red-950/30 text-red-500/70 px-3 py-1.5 rounded-sm text-[10px] font-mono flex items-center gap-1 hover:bg-red-900/50 hover:text-red-400"
              >
                <RotateCcw className="w-3 h-3" />
                RST
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: OUTPUTS */}
        <div className="col-span-1 md:col-span-3 space-y-6 flex flex-col">
          <div className="bg-black/40 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden group">
            <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-xs border-b border-slate-800 pb-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-500" />
              Intelligence Output
            </h3>

            {aiData ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <div className="text-[9px] text-slate-500 font-bold tracking-wider uppercase mb-1">
                    Detected Object
                  </div>
                  <div className="text-sm font-black text-white">
                    {aiData.waste_detection || wasteType}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[9px] text-slate-500 font-bold tracking-wider uppercase mb-1">
                      Severity Risk
                    </div>
                    <div
                      className={`text-xs font-black uppercase flex items-center gap-1.5 ${isHazard ? "text-red-500" : "text-emerald-500"}`}
                    >
                      {isHazard && <AlertTriangle className="w-3 h-3" />}
                      {aiData.severity_assessment}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500 font-bold tracking-wider uppercase mb-1">
                      Confidence
                    </div>
                    <div className="text-xs font-black text-cyan-400 uppercase">
                      {aiData.confidence_score || "98%"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500 font-bold tracking-wider uppercase mb-1">
                      Contamination
                    </div>
                    <div
                      className={`text-xs font-black uppercase ${isHazard ? "text-amber-500" : "text-slate-300"}`}
                    >
                      {aiData.contamination_risk || "Medium"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500 font-bold tracking-wider uppercase mb-1">
                      Collection
                    </div>
                    <div className="text-xs font-black text-blue-400 uppercase">
                      {aiData.collection_status || "Scheduled"}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 font-bold tracking-wider uppercase mb-1">
                    Environmental Impact
                  </div>
                  <div className="text-xs font-bold text-slate-300 leading-tight">
                    {aiData.environmental_impact ||
                      "Moderate environmental impact if uncontained."}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <div className="text-[9px] text-slate-500 font-bold tracking-wider uppercase mb-2">
                    Automated Hardware Action
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 font-mono text-[10px] text-slate-300 leading-relaxed">
                    {isHazard ? (
                      <>
                        <span className="text-red-400 font-bold">
                          1. LOCK_MECHANISM = TRUE
                        </span>
                        <br />
                        <span className="text-red-400 font-bold">
                          2. ALERT_DASHBOARD = HIGH
                        </span>
                        <br />
                        3. SEGREGATE_BIN = "HAZARDOUS_CHAMBER"
                        <br />
                        4. ETA_COLLECTION = "IMMEDIATE"
                      </>
                    ) : (
                      <>
                        1. SEGREGATE_BIN = "STANDARD_RECYCLING"
                        <br />
                        2. COMPRESSION_ACTUATOR = RUN
                        <br />
                        3. CAPACITY_SENSOR = READ
                        <br />
                        4. DB_SYNC = DONE
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <HardDrive className="w-8 h-8 mb-3 opacity-20" />
                <p className="text-xs">Awaiting hardware event...</p>
              </div>
            )}
          </div>

          <div className="bg-black/40 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md flex-1">
            <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-xs border-b border-slate-800 pb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-slate-400" />
              Live Telemetry
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1">
                    <span>PROCESSING (CPU)</span>
                    <span
                      className={
                        stage >= 1 && stage <= 6
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }
                    >
                      {stage >= 1 && stage <= 6 ? "84%" : "12%"}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-[500ms] ${stage >= 1 && stage <= 6 ? "bg-amber-500 w-[84%]" : "bg-emerald-500 w-[12%]"}`}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1">
                    <span>POWER (BATTERY)</span>
                    <span className="text-emerald-400">92%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[92%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1">
                    <span>WEIGHT</span>
                    <span
                      className={
                        stage >= 2 ? "text-amber-400" : "text-slate-500"
                      }
                    >
                      {stage >= 2 ? "42.5g" : "0.0g"}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${stage >= 2 ? "bg-amber-500 w-[42%]" : "bg-slate-700 w-0"}`}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1">
                    <span>CONFIDENCE</span>
                    <span
                      className={
                        stage >= 3 ? "text-cyan-400" : "text-slate-500"
                      }
                    >
                      {stage >= 3 ? aiData?.confidence_score || "98%" : "---"}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${stage >= 3 ? "bg-cyan-500 w-[98%]" : "bg-slate-700 w-0"}`}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                  <span>STORAGE (CONTAINER FILL)</span>
                  <span
                    className={stage === 6 ? "text-blue-400 font-black" : ""}
                  >
                    {stage === 6 ? "45%" : "42%"}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                  <div
                    className="absolute top-0 left-0 h-full bg-slate-600 transition-all duration-[2000ms]"
                    style={{ width: "42%" }}
                  ></div>
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-[2000ms]"
                    style={{ width: stage === 6 ? "45%" : "42%" }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                    <span>DETECTION TIME</span>
                  </div>
                  <div
                    className={`text-xs font-black ${stage >= 3 ? "text-cyan-400" : "text-slate-600"}`}
                  >
                    {stage >= 3 ? "124ms" : "Standby"}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                    <span>MOTOR POSITION</span>
                  </div>
                  <div
                    className={`text-xs font-black ${stage >= 4 ? "text-orange-400" : "text-slate-600"}`}
                  >
                    {stage >= 4
                      ? currentBinIndex === 0
                        ? "-140mm (L)"
                        : currentBinIndex === 2
                          ? "+140mm (R)"
                          : "0mm (C)"
                      : "0mm (C)"}
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <button className="w-full bg-slate-800/30 hover:bg-slate-800/60 p-2 rounded-lg text-[10px] font-mono text-cyan-400 flex items-center justify-center gap-2 transition-all">
                  <Navigation className="w-3 h-3" /> MAP SYNC ACTIVE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
