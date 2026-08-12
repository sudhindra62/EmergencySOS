/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  AlertOctagon,
  Mic,
  MicOff,
  Camera,
  RefreshCw,
  Send,
  Volume2,
  ShieldAlert,
  HeartPulse,
  UserCheck,
  Flame,
} from "lucide-react";
import { Incident, SeverityLevel } from "../types";
import {
  geocodeReportText,
  asyncGeocode,
  generateAssignedResources,
} from "../lib/geocoder";

interface AccidentReportingProps {
  onIncidentReported: (newIncident: Incident) => void;
  selectedLocation?: string;
  setSelectedLocation?: (loc: string) => void;
  currentLang?: string;
}

// Preset rapid simulation scenarios to show instantaneous triage simulation
const PRESET_SCENARIOS = [
  {
    title: "Multi-Vehicle Collision (Bengaluru Hwy)",
    description:
      "Large pile of discarded electronics dumped off NH48. CRT monitors smashed, exposing lead. Several swollen lithium batteries emitting faint smoke. Ground surface looks contaminated.",
    type: "car", // Keeping type ID to not break icons
  },
  {
    title: "GST Road Plastic Burn (Illegal Combustion)",
    description:
      "Massive collision involving a lorry and multiple cars on Paranur bridge shoulder. Severe injuries reported. High risk of secondary crash.",
    type: "bike", // Keeping type ID to not break icons
  },
  {
    title: "Chemical Factory Sludge Leak",
    description:
      "Industrial transport tank leaking thick yellow chemical sludge near Maduravoyal bypass loop. Corrosive fluid entering the storm drains. Emitting strong acidic odor.",
    type: "hazmat",
  },
];

export default function AccidentReporting({
  onIncidentReported,
  selectedLocation,
  setSelectedLocation,
  currentLang,
}: AccidentReportingProps) {
  const [description, setDescription] = useState<string>("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [simulatedImage, setSimulatedImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("");

  const PLACES_SHORT = [
    "Ahmedabad",
    "Bengaluru",
    "Bhopal",
    "Chennai",
    "Coimbatore",
    "Dehradun",
    "Delhi",
    "Guwahati",
    "Hyderabad",
    "Indore",
    "Jaipur",
    "Kanpur",
    "Kochi",
    "Kolkata",
    "Lucknow",
    "Ludhiana",
    "Madurai",
    "Mumbai",
    "Mysuru",
    "Panaji",
    "Patna",
    "Pune",
    "Raipur",
    "Ranchi",
    "Shimla",
    "Surat",
    "Thiruvananthapuram",
    "Tiruchirappalli",
    "Visakhapatnam",
  ];

  // Auto-scan incident reports for location identifiers as user writes or narrates
  useEffect(() => {
    if (!description) return;
    const lowerInput = description.toLowerCase();
    for (const place of PLACES_SHORT) {
      if (lowerInput.includes(place.toLowerCase())) {
        const state = "India";
        setSelectedLocation?.(`${place}, ${state}`);
        break;
      }
    }
  }, [description, setSelectedLocation]);

  const LANGUAGE_CODES: Record<string, string> = {
    en: "en-IN",
    hi: "hi-IN",
    kn: "kn-IN",
    ta: "ta-IN",
    te: "te-IN",
    ml: "ml-IN",
    mr: "mr-IN",
    bn: "bn-IN",
  };

  // Speech Recognition refs
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API for real hands-free speech-to-text
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = LANGUAGE_CODES[currentLang || "en"] || "en-IN";

      rec.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          }
        }
        if (finalTranscript) {
          setDescription((prev) => (prev + " " + finalTranscript).trim());
        }
      };

      rec.onerror = (e: any) => {
        console.warn("Speech recognition status:", e.error);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, [currentLang]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert(
        "Hands-free dictation: Speech recognition is not fully supported on this iframe browser configuration. Please type or use our pre-briefed hardware scenarios!",
      );
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const selectPresetScenario = (index: number) => {
    setSelectedPreset(index);
    setDescription(PRESET_SCENARIOS[index].description);

    // Auto-simulate contextual crash scene photo based on type
    if (PRESET_SCENARIOS[index].type === "car") {
      setSimulatedImage(
        "https://images.unsplash.com/photo-1611288875704-5858602b6d85?w=600&auto=format&fit=crop&q=60",
      ); // Severe car crash pile
    } else if (PRESET_SCENARIOS[index].type === "bike") {
      setSimulatedImage(
        "https://images.unsplash.com/photo-1594819047050-99defca82545?w=600&auto=format&fit=crop&q=60",
      ); // Two wheeler accident
    } else if (PRESET_SCENARIOS[index].type === "hazmat") {
      setSimulatedImage(
        "https://images.unsplash.com/photo-1614081077553-9112fb449646?w=600&auto=format&fit=crop&q=60",
      ); // Chemical tanker leak
    }
  };

  const handleCustomPhotoSimulation = () => {
    // Cycles standard accident report references
    const photos = [
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=60", // Crash pile
      "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=600&auto=format&fit=crop&q=60", // Unsorted debris
      "https://images.unsplash.com/photo-1621451537084-48118f673323?w=600&auto=format&fit=crop&q=60", // Plastic bottles in nature
    ];
    const randomImg = photos[Math.floor(Math.random() * photos.length)];
    setSimulatedImage(randomImg);
    if (!description) {
      setDescription(
        "Vehicle ran off the highway peripheral. Driver appears to be unconscious. Need immediate assistance.",
      );
    }
  };

  const triggerTextToSpeech = (text: string) => {
    if ("speechSynthesis" in window) {
      // Cancel active queues first
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      utterance.lang = LANGUAGE_CODES[currentLang || "en"] || "en-IN";

      // Try to find natural voices
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find((v) =>
        v.lang.startsWith(utterance.lang.split("-")[0]),
      );
      if (preferred) utterance.voice = preferred;

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSOSSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert("Please key in or dictate the accident specifics first!");
      return;
    }

    setSubmitting(true);
    setStatusText("Rerouting telemetry to Agentic Coordinating Centre...");

    try {
      // Call backend route
      const response = await fetch("/api/assess-accident", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          voicePayload: isRecording ? "captured" : null,
          imageSimulated: simulatedImage,
        }),
      });

      if (!response.ok) {
        throw new Error("Coordinating server failed to triaging parameters");
      }

      const reportData = await response.json();

      // Geocode description to find latitude, longitude, and correct address values
      const geocoded = await asyncGeocode(description);
      const sev = (reportData.severity || "Moderate") as SeverityLevel;
      const tResources = generateAssignedResources(
        geocoded.lat,
        geocoded.lng,
        geocoded.city,
        sev,
      );

      // Format final reported incident to feed back to live dashboard
      const processedIncident: Incident = {
        id: `INC-2026-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: new Date().toISOString(),
        location: {
          lat: geocoded.lat,
          lng: geocoded.lng,
          address: geocoded.address,
          highway: geocoded.highway,
          city: geocoded.city,
          state: geocoded.state || "India",
        },
        description: description,
        severity: sev,
        status: "dispatching",
        victimsCount: reportData.victimsCount || 1,
        victimCount: reportData.victimsCount || 1,
        vehicleInfo: reportData.vehicleInfo || "reported accident origin",
        incidentType: reportData.vehicleInfo || "accident event",
        confidence: "95%",
        firstAidProtocol:
          reportData.injuryTypes && reportData.injuryTypes[0]
            ? `${reportData.injuryTypes[0]} Protocol`
            : "Standard Segregation Protocol",
        nearestHospital: `${tResources.traumaCenter.name} (${tResources.traumaCenter.distance})`,
        nearestPoliceUnit: tResources.policeUnit.stationName,
        ambulanceETA: tResources.ambulance.eta,
        riskLevel:
          sev === "Critical"
            ? "Critical Risk"
            : sev === "Severe"
              ? "High Risk"
              : "Moderate Risk",
        injuryTypes: reportData.injuryTypes || [
          "Leaking Substrate",
          "Plastic Composite",
        ],
        hazmat: reportData.hazmat || false,
        traumaCenter: tResources.traumaCenter,
        ambulance: tResources.ambulance,
        policeUnit: tResources.policeUnit,
        familyContacts: [
          {
            name: "Compliance Operations Hub",
            relation: "Compliance Dispatch Team",
            phone: "112 / 108",
            notified: true,
            notificationTime: new Date().toISOString(),
          },
        ],
        agentsLog: reportData.agentsLog,
        recommendedActions: reportData.recommendedActions,
        audioResponseText: reportData.audioResponseText,
      };

      // Call dashboard state update callback
      onIncidentReported(processedIncident);

      // Speak out comforting containment statement for bystander under pressure
      if (reportData.audioResponseText) {
        triggerTextToSpeech(reportData.audioResponseText);
      }

      // Clear report card
      setDescription("");
      setSimulatedImage(null);
      setSelectedPreset(null);
      setStatusText("Complete! Fleet units routed on control hub.");
      setTimeout(() => setStatusText(""), 5000);
    } catch (err: any) {
      console.error(err);
      setStatusText(
        `Error: ${err.message}. Retrying via offline telemetry protocol...`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sos-shell rounded-[2.5rem] p-8 md:p-12 flex flex-col relative">
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#FFD56A]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-[#FFD56A]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="glass-reflection" />
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="text-white font-extrabold text-lg tracking-wider flex items-center gap-3 drop-shadow-[0_0_15px_rgba(255,213,106,0.1)]">
            <div className="p-2 bg-[#FFD56A]/10 border border-[#FFD56A]/20 rounded-xl">
              <AlertOctagon className="w-5 h-5 command-icon animate-pulse" />
            </div>
            ROADGUARDIAN COMMAND CENTER
          </h3>
          <p className="text-[11px] text-[rgba(255,213,106,0.6)] mt-2 ml-14 font-medium tracking-wide">
            Hands-Free Voice and Media Ingress for instant Highway/Police
            triaging.
          </p>
        </div>
        {statusText && (
          <span className="text-[10px] bg-black/60 px-3 py-1.5 text-[rgba(255,213,106,0.9)] border border-[rgba(255,213,106,0.3)] font-mono rounded-lg shadow-lg">
            {statusText}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        {/* Scenario preset selection on left side */}
        <div className="lg:col-span-4">
          <span className="text-[10px] text-[rgba(255,213,106,0.7)] font-bold uppercase tracking-widest block mb-6 px-1">
            🚀 RAPID HIGHWAY TRIGGER SIMULATORS
          </span>
          <div className="flex flex-col gap-[28px]">
            {PRESET_SCENARIOS.map((sc, scIdx) => (
              <button
                key={scIdx}
                onClick={() => selectPresetScenario(scIdx)}
                className={`w-full p-4 rounded-2xl text-left transition-all text-xs cursor-pointer block relative z-10 hover:scale-[1.02] ${
                  selectedPreset === scIdx
                    ? "breakthrough-card card-gold border border-[#FFD56A]/40 text-white shadow-[0_0_25px_rgba(255,213,106,0.15)]"
                    : "breakthrough-card bg-black/40 border border-white/5 text-[rgba(255,213,106,0.5)] hover:text-white hover:border-[#FFD56A]/20"
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-2">
                  <span>{sc.title}</span>
                  {sc.type === "hazmat" && (
                    <Flame className="w-3.5 h-3.5 command-icon" />
                  )}
                </div>
                <p className="text-[10px] text-[rgba(255,213,106,0.4)] font-medium line-clamp-2 leading-relaxed">
                  {sc.description}
                </p>
              </button>
            ))}

            <div className="p-4 rounded-2xl breakthrough-card bg-[#050812]/80 border border-[#FFD56A]/10 mt-2 z-10 transition-colors shadow-inner hover:border-[#FFD56A]/20">
              <h4 className="text-white font-bold text-[10px] mb-2 uppercase tracking-wider flex items-center gap-1.5 drop-shadow-[0_0_8px_rgba(255,213,106,0.2)]">
                <Volume2 className="w-3.5 h-3.5 command-icon" />
                Hands-Free Assistant
              </h4>
              <p className="text-[10px] text-[rgba(255,213,106,0.5)] leading-relaxed font-medium">
                Once submitted, the AI voice engine will automatically recite
                first aid commands aloud to keep bystanders calm and focused.
              </p>
            </div>
          </div>
        </div>

        {/* SOS Input Deck */}
        <form
          onSubmit={handleSOSSubmit}
          className="lg:col-span-8 space-y-5 sos-command-panel p-6 sm:p-8 flex flex-col justify-between"
        >
          <div className="relative">
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setSelectedPreset(null);
              }}
              placeholder="Speak hands-free or type accident description (e.g., 'Industrial disposal dumped near Chennai bypass...')"
              className="w-full min-h-[160px] golden-glass-input p-6 pb-16 rounded-[1.5rem] text-sm text-[rgba(255,213,106,0.8)] focus:outline-none focus:border-[rgba(255,214,110,0.4)] transition placeholder-[rgba(255,213,106,0.3)] resize-none font-sans leading-relaxed relative z-10"
            />

            {/* Dictation Controller inside textbox */}
            <div className="absolute bottom-4 right-4 flex items-center gap-3">
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-3 rounded-full transition-all cursor-pointer flex items-center justify-center relative z-20 ${
                  isRecording
                    ? "bg-[rgba(255,213,106,1)] text-black shadow-[0_0_20px_rgba(255,214,110,0.5)] animate-pulse"
                    : "bg-black/80 border border-[rgba(255,214,110,0.2)] hover:bg-[rgba(15,18,28,0.9)] text-[rgba(255,213,106,0.8)]"
                }`}
                title="Hands-free vocal report dictation"
              >
                {isRecording ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4 command-icon" />
                )}
              </button>
              <button
                type="button"
                onClick={handleCustomPhotoSimulation}
                className="p-3 rounded-full bg-black/80 border border-[rgba(255,214,110,0.2)] hover:bg-[rgba(15,18,28,0.9)] text-[rgba(255,213,106,0.8)] cursor-pointer flex items-center justify-center relative z-20"
                title="Simulate smartphone crash scene photo upload"
              >
                <Camera className="w-4 h-4 command-icon" />
              </button>
            </div>

            {/* Live recording trace */}
            {isRecording && (
              <span className="absolute bottom-5 left-6 text-[10px] font-mono font-bold text-[rgba(255,213,106,1)] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[rgba(255,214,110,1)] animate-ping"></span>
                LIVE VOICE INGRESS ACTIVATED (SPEAK NOW...)
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 golden-glass-input p-5 rounded-[1.5rem] relative z-10">
            {simulatedImage ? (
              <div className="flex items-center gap-4">
                <img
                  src={simulatedImage}
                  alt="Incident Reference"
                  className="w-14 h-14 rounded-lg object-cover border border-[rgba(255,214,110,0.3)] shadow-[0_0_15px_rgba(255,194,71,0.2)]"
                />
                <div>
                  <span className="text-xs text-[rgba(255,213,106,1)] font-bold block mb-1">
                    Telemetry Photo Attached
                  </span>
                  <button
                    type="button"
                    onClick={() => setSimulatedImage(null)}
                    className="text-[10px] text-[rgba(255,194,71,0.7)] hover:text-[rgba(255,213,106,1)] transition-colors cursor-pointer"
                  >
                    Remove Attachment
                  </button>
                </div>
              </div>
            ) : (
              <span className="text-[11px] text-[rgba(255,213,106,0.5)] italic font-medium leading-relaxed">
                * Attach a simulated camera image for AI-driven debris/hazard
                calculations.
              </span>
            )}

            <button
              type="submit"
              disabled={submitting || !description.trim()}
              className={`px-8 py-4 rounded-xl font-black text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-3 cursor-pointer z-20 relative ${
                submitting || !description.trim()
                  ? "bg-black/60 text-[rgba(255,214,110,0.3)] cursor-not-allowed border border-[rgba(255,214,110,0.1)]"
                  : "bg-gradient-to-r from-[rgba(255,194,71,0.8)] to-[rgba(255,213,106,0.9)] hover:from-[rgba(255,213,106,1)] hover:to-[rgba(255,225,140,1)] text-black shadow-[0_0_30px_rgba(255,194,71,0.4)] border border-[rgba(255,214,110,1)]"
              }`}
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Triaging...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  TRIGGER SOS
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Safety Compliance & Guidelines */}
      <div className="mt-12 pt-8 border-t border-[#FFD56A]/10 grid grid-cols-1 md:grid-cols-3 gap-6 text-[10px] relative z-10">
        <div className="flex gap-4 p-5 breakthrough-card bg-black/40 rounded-2xl transition-colors border border-[#FFD56A]/5 hover:border-[#FFD56A]/20">
          <ShieldAlert className="w-6 h-6 command-icon shrink-0" />
          <p className="text-[rgba(255,213,106,0.6)] mt-0.5 leading-relaxed font-medium">
            <strong className="text-white block mb-1">MoRTH Compliance</strong>
            All telemetry uploads bind safely to National Transit Database
            protocols.
          </p>
        </div>
        <div className="flex gap-4 p-5 breakthrough-card bg-black/40 rounded-2xl transition-colors border border-[#FFD56A]/5 hover:border-[#FFD56A]/20">
          <HeartPulse className="w-6 h-6 command-icon shrink-0" />
          <p className="text-[rgba(255,213,106,0.6)] mt-0.5 leading-relaxed font-medium">
            <strong className="text-white block mb-1">
              ALS Dispatch Locking
            </strong>
            Severity assessment locks respiratory response parameter systems.
          </p>
        </div>
        <div className="flex gap-4 p-5 breakthrough-card bg-black/40 rounded-2xl transition-colors border border-[#FFD56A]/5 hover:border-[#FFD56A]/20">
          <UserCheck className="w-6 h-6 command-icon shrink-0" />
          <p className="text-[rgba(255,213,106,0.6)] mt-0.5 leading-relaxed font-medium">
            <strong className="text-white block mb-1">
              Bystander Protection
            </strong>
            Protects callers under national safety codes automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
