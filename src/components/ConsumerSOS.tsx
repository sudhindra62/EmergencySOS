import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  Camera,
  Send,
  Phone,
  MapPin,
  Activity,
  HeartPulse,
  Building,
  CheckCircle2,
  ShieldAlert,
  Crosshair,
  AlertTriangle,
  ChevronDown,
  Search,
  Brain,
} from "lucide-react";

import { Incident, SeverityLevel } from "../types";
import {
  geocodeReportText,
  asyncGeocode,
  generateAssignedResources,
} from "../lib/geocoder";
import { dispatchSocket } from "../systems/DispatchSocket";

interface ConsumerSOSProps {
  selectedLocation?: string;
  setSelectedLocation?: (loc: string) => void;
  currentLang?: string;
  activeIncident?: Incident | null;
  onIncidentReported?: (newIncident: Incident) => void;
  onResetIncident?: () => void;
}

export default function ConsumerSOS({
  selectedLocation,
  setSelectedLocation,
  currentLang,
  activeIncident,
  onIncidentReported,
  onResetIncident,
}: ConsumerSOSProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [aiData, setAiData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [mockIncident, setMockIncident] = useState<Incident | null>(null);

  useEffect(() => {
    if (activeIncident) {
      setInputValue(activeIncident.description || "");

      setAiData({
        detected_language_code: currentLang || "en",
        detected_language: currentLang === "hi" ? "Hindi" : "English",
        translated_english: activeIncident.description || "",
        severity_assessment: activeIncident.severity || "Moderate",
        extracted_location:
          activeIncident.location?.address || "Unknown location",
        response_text: `Live Incident payload loaded. Level: ${activeIncident.severity}. Status: ${activeIncident.status || "In-Progress"}.`,
        first_aid_instructions: activeIncident.injuryTypes || [
          "Maintain airway",
          "Stay with victim",
        ],
      });

      setRecommendations({
        nearestAmbulance: activeIncident.ambulance
          ? {
              name: activeIncident.ambulance.id,
              eta: parseInt(activeIncident.ambulance.eta || "5") || 5,
              distance: 2,
            }
          : null,
        nearestTraumaCenter: activeIncident.traumaCenter
          ? {
              name: activeIncident.traumaCenter.name,
              eta: 5,
              distance: 4,
            }
          : null,
        nearestPoliceStation: activeIncident.policeUnit
          ? {
              name: activeIncident.policeUnit.stationName || "Highway Patrol",
              eta: parseInt(activeIncident.policeUnit.eta || "6") || 6,
              distance: 3,
            }
          : null,
      });
    }
  }, [activeIncident?.id]);

  const [isInlineDropdownOpen, setIsInlineDropdownOpen] = useState(false);
  const [inlineFilter, setInlineFilter] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const INDIA_PLACES_FULL = [
    "Ahmedabad, Gujarat",
    "Bengaluru, Karnataka",
    "Bhopal, Madhya Pradesh",
    "Chennai, Tamil Nadu",
    "Coimbatore, Tamil Nadu",
    "Dehradun, Uttarakhand",
    "Delhi, New Delhi",
    "Guwahati, Assam",
    "Hyderabad, Telangana",
    "Indore, Madhya Pradesh",
    "Jaipur, Rajasthan",
    "Kanpur, Uttar Pradesh",
    "Kochi, Kerala",
    "Kolkata, West Bengal",
    "Lucknow, Uttar Pradesh",
    "Ludhiana, Punjab",
    "Madurai, Tamil Nadu",
    "Mumbai, Maharashtra",
    "Mysuru, Karnataka",
    "Panaji, Goa",
    "Patna, Bihar",
    "Pune, Maharashtra",
    "Raipur, Chhattisgarh",
    "Ranchi, Jharkhand",
    "Shimla, Himachal Pradesh",
    "Surat, Gujarat",
    "Thiruvananthapuram, Kerala",
    "Tiruchirappalli, Tamil Nadu",
    "Visakhapatnam, Andhra Pradesh",
  ];

  const INDIA_PLACES_SHORT = INDIA_PLACES_FULL.map((p) =>
    p.split(",")[0].trim(),
  );

  // Scan input description text as user types or dictates for live location detection
  useEffect(() => {
    if (!inputValue) return;
    const lowerInput = inputValue.toLowerCase();
    for (const place of INDIA_PLACES_SHORT) {
      if (lowerInput.includes(place.toLowerCase())) {
        const fullPlace = INDIA_PLACES_FULL.find((p) => p.startsWith(place));
        if (fullPlace) {
          setSelectedLocation?.(fullPlace);
          break;
        }
      }
    }
  }, [inputValue, setSelectedLocation]);

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

  const handleSpeechToText = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = LANGUAGE_CODES[currentLang || "en"] || "en-IN";
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      setInputValue(event.results[0][0].transcript);
      setIsRecording(false);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const speakText = (text: string, langCode?: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode || LANGUAGE_CODES[currentLang || "en"] || "en-IN";
    window.speechSynthesis.speak(utterance);
  };

  const handleSOSSubmit = async () => {
    if (!inputValue.trim() && !selectedImage) return;
    setIsProcessing(true);

    try {
      // For immediate response (bypassing slow/failing LLM APIs for the demo video)
      const mockInc: any = {
        id: "DEMO-CRASH-" + Math.floor(Math.random() * 10000),
        status: "dispatching",
        severity: "Critical",
        description: inputValue || "Emergency! Crash reported. We need ambulances immediately!",
        location: { lat: 28.6139, lng: 77.2090, address: "Highway Demo Route", city: "New Delhi", state: "Delhi", highway: "NH-48" },
        timestamp: new Date().toISOString(),
        victimsCount: 2,
        vehicleInfo: "Multi-vehicle",
        incidentType: "Vehicle Collision",
        confidence: "98%",
        firstAidProtocol: "Golden Hour Protocol",
        nearestHospital: "AIIMS Trauma Center (3.2 km)",
        nearestPoliceUnit: "Highway Patrol",
        ambulanceETA: "4 mins",
        riskLevel: "HIGH RISK",
        injuryTypes: ["Blunt Trauma", "Lacerations"],
        hazmat: false,
        traumaCenter: { name: "AIIMS Trauma Center", distance: "3.2 km", contact: "108", bedsAvailable: 12, specialty: "Level 1" },
        ambulance: { id: "AMB-DEMO-1", operator: "Gov Fleet", contact: "108", status: "en-route", eta: "4 mins", type: "ALS" },
        policeUnit: { stationName: "Highway Patrol", contact: "100", division: "Traffic", patrolId: "PAT-01", eta: "5 mins" },
        familyContacts: [],
        recommendedActions: ["Maintain airway", "Stay with victim"],
        agentsLog: [
          {
            agentName: "Emergency Coordinator",
            status: "success",
            message: "Accident report registered. Initializing RoadGuardian network.",
            timestamp: new Date().toLocaleTimeString(),
          }
        ]
      };
      
      setMockIncident(mockInc);
      
      // Voiceover
      const voiceText = "Emergency input received. The system is analyzing the voice context to determine severity. Multi-agent networks are evaluating the closest trauma centers, dispatching autonomous vehicles, and establishing a secure GPS corridor. Initiating live map tracking now.";
      speakText(voiceText, "en-US");

      if (onIncidentReported) {
        onIncidentReported(mockInc);
      }

      // Trigger Twin immediately
      setTimeout(() => {
          import("../systems/DigitalTwinEngine").then(({ useDigitalTwinEngine }) => {
             useDigitalTwinEngine.getState().triggerSOS(28.6139, 77.2090);
          });
      }, 300);

      // Stop everything after 15 seconds for manual work
      setTimeout(() => {
          window.speechSynthesis?.cancel();
          import("../systems/DigitalTwinEngine").then(({ useDigitalTwinEngine }) => {
             useDigitalTwinEngine.getState().resetTwin();
          });
          // We do NOT reset the incident, leaving it open for manual interaction
      }, 15000);

    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetSOS = () => {
    setAiData(null);
    setRecommendations(null);
    setMockIncident(null);
    setInputValue("");
    setSelectedImage(null);
    window.speechSynthesis?.cancel();
    if (onResetIncident) {
      onResetIncident();
    }
  };

  return (
    <div className="bg-[#020617]/40 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.5),_inset_0_0_20px_rgba(59,130,246,0.2)] border border-blue-500/20 overflow-hidden flex flex-col min-h-[85vh] relative max-w-6xl mx-auto font-sans">
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(59,130,246,0.1)] pointer-events-none z-0"></div>

      {/* Header */}
      <div className="px-10 pt-10 pb-6 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 via-cyan-500 to-amber-500 text-white rounded-[2rem] flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-white/30 cursor-pointer hover:rotate-12 transition-transform duration-500">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]">
              RoadGuardian Live SOS Command
            </h1>
            <p className="text-[13px] text-blue-100/90 font-bold mt-1.5 tracking-[0.2em] uppercase drop-shadow-md">
              RoadGuardian Emergency Intelligence Active
            </p>
          </div>
        </div>

        {aiData && (
          <button
            onClick={resetSOS}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-[2rem] font-black text-sm tracking-widest transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center gap-2 uppercase"
          >
            Reset Incident
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-10 space-y-8 z-10 relative">
        <div className="h-full flex flex-col items-center justify-center max-w-3xl mx-auto mt-12 mb-20 animate-in fade-in duration-700">
          <h2 className="text-5xl md:text-6xl font-black text-center text-white mb-6 tracking-tight leading-tight drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]">
            Report Crash.
          </h2>
          <p className="text-blue-100/80 text-center mb-14 text-xl font-semibold tracking-wide max-w-xl mx-auto">
            Describe the accident, upload a photo, or tap the mic. AI will
            classify and dispatch ambulances instantly.
          </p>

          <div
            className={`w-full bg-[#020617]/50 backdrop-blur-2xl border border-blue-500/30 rounded-[3rem] p-6 shadow-[0_0_40px_rgba(59,130,246,0.2)] transition-all ${isProcessing ? "opacity-50 pointer-events-none scale-[0.98]" : "hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:border-blue-400/50"}`}
          >
            {selectedImage && (
              <div className="mb-6 relative rounded-[2rem] overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.2)] inline-block border border-blue-500/30">
                <img
                  src={selectedImage}
                  alt="Upload preview"
                  className="h-48 object-cover"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 bg-black/60 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md text-white p-2.5 rounded-full hover:bg-black hover:scale-110 transition-all"
                >
                  <Crosshair className="w-6 h-6 text-blue-400" />
                </button>
              </div>
            )}

            {!inputValue.trim() && (
              <div className="mb-6 px-6 pb-6 border-b border-white/5 animate-in fade-in slide-in-from-top-1 duration-300 relative z-30">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#00D4FF] block mb-3">
                  📍 CURRENT ACCIDENT LOCATION (OR DEVIATE MANUALLY)
                </span>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setIsInlineDropdownOpen(!isInlineDropdownOpen)
                    }
                    className="w-full flex items-center justify-between p-4 bg-black/40 border border-white/10 rounded-2xl text-left text-white font-bold text-sm tracking-wide group hover:border-[#00D4FF]/50 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-cyan-400" />
                      {selectedLocation || "Select Accident Location..."}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                  </button>

                  {isInlineDropdownOpen && (
                    <div className="absolute top-[105%] left-0 w-full rounded-2xl overflow-hidden p-3 z-50 border border-white/10 shadow-2xl bg-slate-950 flex flex-col max-h-[250px]">
                      <div className="p-2 border-b border-white/5 bg-black/20 rounded-xl mb-2 flex items-center gap-2">
                        <Search className="w-4 h-4 text-slate-500 shrink-0" />
                        <input
                          type="text"
                          placeholder="Filter cities & districts of India..."
                          className="bg-transparent border-none outline-none text-xs text-white placeholder:text-slate-500 w-full"
                          value={inlineFilter}
                          onChange={(e) => setInlineFilter(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="overflow-y-auto custom-scrollbar flex-1 space-y-1">
                        {INDIA_PLACES_FULL.filter((place) =>
                          place
                            .toLowerCase()
                            .includes(inlineFilter.toLowerCase()),
                        ).map((place, idx) => (
                          <div
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLocation?.(place);
                              setIsInlineDropdownOpen(false);
                            }}
                            className={`px-4 py-2.5 rounded-xl cursor-pointer text-xs font-semibold hover:bg-white/5 transition-colors flex items-center justify-between ${
                              selectedLocation === place
                                ? "text-cyan-400 bg-white/5 font-black"
                                : "text-slate-300"
                            }`}
                          >
                            <span>{place}</span>
                            {selectedLocation === place && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Plastic and battery mixed near Mysore..."
              className="w-full bg-transparent text-white text-2xl md:text-3xl font-bold placeholder:text-blue-100/40 focus:outline-none resize-none px-6 py-4 min-h-[140px] leading-relaxed"
            />

            <div className="flex items-center justify-between px-4 pt-6 border-t border-white/10">
              <div className="flex gap-4">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () =>
                        setSelectedImage(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 bg-white/5 border border-white/10 text-white rounded-[2rem] flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110 shadow-lg group"
                >
                  <Camera className="w-7 h-7 group-hover:text-amber-400 transition-colors" />
                </button>
                <button
                  onClick={handleSpeechToText}
                  className={`w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all duration-300 border shadow-lg hover:scale-110 group ${isRecording ? "bg-gradient-to-tr from-amber-500 to-orange-500 text-white animate-pulse border-white/50 shadow-[0_0_30px_rgba(245,158,11,0.6)]" : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20"}`}
                >
                  <Mic
                    className={`w-7 h-7 ${isRecording ? "text-white block" : "group-hover:text-amber-400 transition-colors"}`}
                  />
                </button>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSOSSubmit}
                  disabled={
                    (!inputValue.trim() && !selectedImage) || isProcessing
                  }
                  className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 text-white px-10 py-5 rounded-[2rem] font-black text-xl tracking-wide flex items-center gap-3 hover:scale-105 disabled:opacity-50 transition-all duration-500 shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-blue-400/30 disabled:hover:scale-100 group w-full justify-center md:w-auto"
                >
                  {isProcessing ? "Processing AI..." : "Request Dispatch"}
                  <Send className="w-6 h-6 ml-2 group-hover:translate-x-1 group-disabled:translate-x-0 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-16 w-full grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Quick Contacts */}
            <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center hover:bg-white/20 transition-all duration-300 cursor-pointer border border-white/20 hover:border-white/40 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(244,63,94,0.3)] group">
              <Phone className="w-10 h-10 text-rose-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
              <div className="font-black text-3xl text-white tracking-widest drop-shadow-md">
                108
              </div>
              <div className="text-[11px] text-pink-100/90 font-bold uppercase tracking-[0.2em] mt-2">
                Ambulance
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center hover:bg-white/20 transition-all duration-300 cursor-pointer border border-white/20 hover:border-white/40 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(59,130,246,0.3)] group">
              <Phone className="w-10 h-10 text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
              <div className="font-black text-3xl text-white tracking-widest drop-shadow-md">
                100
              </div>
              <div className="text-[11px] text-pink-100/90 font-bold uppercase tracking-[0.2em] mt-2">
                Police
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center hover:bg-white/20 transition-all duration-300 cursor-pointer border border-white/20 hover:border-white/40 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(249,115,22,0.3)] group">
              <Phone className="w-10 h-10 text-orange-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
              <div className="font-black text-3xl text-white tracking-widest drop-shadow-md">
                101
              </div>
              <div className="text-[11px] text-pink-100/90 font-bold uppercase tracking-[0.2em] mt-2">
                Fire & Rescue
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center hover:bg-white/20 transition-all duration-300 cursor-pointer border border-white/20 hover:border-white/40 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(168,85,247,0.3)] group">
              <Phone className="w-10 h-10 text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
              <div className="font-black text-3xl text-white tracking-widest drop-shadow-md">
                181
              </div>
              <div className="text-[11px] text-pink-100/90 font-bold uppercase tracking-[0.2em] mt-2">
                Women Helpline
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
