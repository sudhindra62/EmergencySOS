/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Truck,
  Activity,
  ShieldAlert,
  HeartPulse,
  MapPin,
  Eye,
  AlertCircle,
  PhoneCall,
  CheckCircle,
  Navigation,
  ExternalLink,
  Calendar,
  PlusCircle,
  Clock,
  Shield,
  PlusSquare,
} from "lucide-react";
import {
  Incident,
  IncidentStatus,
  TraumaCenter,
  AmbulanceUnit,
  PoliceUnit,
  SeverityLevel,
} from "../types";
import IndiaLiveMap from "./IndiaLiveMap";
import { useDigitalTwinEngine } from "../systems/DigitalTwinEngine";

interface EmergencyDashboardProps {
  incidents: Incident[];
  selectedIncident: Incident | null;
  onSelectIncident: (id: string) => void;
  onStatusUpdate: (id: string, newStatus: IncidentStatus) => void;
  onNavigate?: (tabId: string) => void;
  selectedLocation?: string;
}

function EmergencyDashboardInner({
  incidents,
  selectedIncident,
  onSelectIncident,
  onStatusUpdate,
  onNavigate,
  selectedLocation,
}: EmergencyDashboardProps) {
  const twinState = useDigitalTwinEngine();

  const [timeLeft, setTimeLeft] = useState(47 * 60 + 32); // 47:32 in seconds

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (twinState.incidentActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      setTimeLeft(47 * 60 + 32); // Reset when inactive
    }
    return () => clearInterval(interval);
  }, [twinState.incidentActive]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getSeverityBadgeClass = (severity: SeverityLevel) => {
    switch (severity) {
      case "Critical":
        return "bg-rose-950/80 text-rose-400 border border-rose-800 animate-pulse";
      case "Severe":
        return "bg-amber-950/80 text-amber-500 border border-amber-900";
      case "Moderate":
        return "bg-cyan-950/80 text-cyan-400 border border-cyan-900";
      default:
        return "bg-slate-900 border border-slate-850 text-slate-350";
    }
  };

  const getStatusBadgeClass = (status: IncidentStatus) => {
    switch (status) {
      case "reported":
        return "bg-blue-950 text-blue-400 border border-blue-900";
      case "dispatching":
        return "bg-sky-950/80 text-cyan-400 border border-sky-900 animate-pulse";
      case "en-route":
        return "bg-amber-950 text-amber-450 border border-amber-900";
      case "on-scene":
        return "bg-rose-950 text-rose-400 border border-rose-900";
      case "resolved":
        return "bg-emerald-950 text-emerald-450 border border-emerald-900";
      default:
        return "bg-slate-950 text-slate-400";
    }
  };

  // Interactive GIS map implemented using Leaflet instead of static SVG

  return (
    <div className="space-y-6">
      {selectedIncident && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
          {/* Incident Status */}
          <div className="h-[120px] premium-card kpi-critical flex flex-col justify-between p-5 group">
            <div className="glass-reflection"></div>
            <div className="flex items-center gap-3 relative z-10">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                Incident Status
              </span>
            </div>
            <div className="relative z-10">
              <div
                className={`text-2xl font-black ${(twinState.incidentActive ? twinState.severity : selectedIncident.severity) === "Critical" ? "text-rose-400" : (twinState.incidentActive ? twinState.severity : selectedIncident.severity) === "Severe" ? "text-amber-400" : (twinState.incidentActive ? twinState.severity : selectedIncident.severity) === "Moderate" ? "text-cyan-400" : "text-slate-400"}`}
              >
                {twinState.incidentActive
                  ? twinState.severity
                  : selectedIncident.severity}
              </div>
              <div className="text-xs text-blue-200/50">Severity Level</div>
            </div>
            <div className="ambient-glow ambient-glow-red"></div>
          </div>

          {/* Response Window */}
          <div className="h-[120px] premium-card kpi-golden flex flex-col justify-between p-5 group">
            <div className="glass-reflection"></div>
            <div className="flex items-center gap-3 relative z-10">
              <Clock className="w-5 h-5 text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                Response Window
              </span>
            </div>
            <div className="relative z-10">
              <div className="text-2xl font-black text-amber-400">
                {formatTime(timeLeft)}
              </div>
              <div className="text-xs text-blue-200/50">Time Remaining</div>
            </div>
            <div className="ambient-glow ambient-glow-orange"></div>
          </div>

          {/* ETA Fleet */}
          <div className="h-[120px] premium-card kpi-eta flex flex-col justify-between p-5 group">
            <div className="glass-reflection"></div>
            <div className="flex items-center gap-3 relative z-10">
              <Truck className="w-5 h-5 text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                ETA Fleet
              </span>
            </div>
            <div className="relative z-10">
              <div className="text-2xl font-black text-blue-400">
                {twinState.incidentActive
                  ? twinState.vehicles.find((v) => v.type === "ambulance")
                      ?.eta || "--"
                  : selectedIncident.ambulance?.eta || "--"}
              </div>
              <div className="text-xs text-blue-200/50">On the way</div>
            </div>
          </div>

          {/* Nearest Facility */}
          <div className="h-[120px] premium-card kpi-hospital flex flex-col justify-between p-5 group">
            <div className="glass-reflection"></div>
            <div className="flex items-center gap-3 relative z-10">
              <PlusSquare className="w-5 h-5 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                Nearest Facility
              </span>
            </div>
            <div className="relative z-10">
              <div className="text-2xl font-black text-emerald-400">
                {twinState.incidentActive
                  ? twinState.vehicles.find((v) => v.type === "ambulance")
                      ?.distance || "--"
                  : selectedIncident.traumaCenter?.distance || "--"}
              </div>
              <div className="text-xs text-blue-200/50">Trauma Centre</div>
            </div>
          </div>

          {/* Police Station */}
          <div className="h-[120px] premium-card kpi-police flex flex-col justify-between p-5 group">
            <div className="glass-reflection"></div>
            <div className="flex items-center gap-3 relative z-10">
              <Shield className="w-5 h-5 text-indigo-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                Police Station
              </span>
            </div>
            <div className="relative z-10">
              <div className="text-2xl font-black text-indigo-400">
                {twinState.incidentActive
                  ? twinState.vehicles.find((v) => v.type === "police")?.eta ||
                    "--"
                  : selectedIncident.policeUnit?.eta || "--"}
              </div>
              <div className="text-xs text-blue-200/50">Nearest Unit</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 items-start w-full">
        {/* Center Column - Main Map & Incident Summary */}
        <div className="w-full flex flex-col gap-8 min-w-0 h-full">
          {selectedIncident ? (
            <>
              {/* Main Map */}
              <div className="premium-card map-container-premium p-6 flex flex-col h-full">
                <div className="glass-reflection"></div>
                <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(34,211,238,0.05)] pointer-events-none z-0"></div>
                <h3 className="text-white font-black text-lg tracking-wider mb-4 uppercase drop-shadow-sm flex items-center gap-2 relative z-10">
                  <Navigation className="w-5 h-5 text-cyan-400" />
                  RoadGuardian Intelligence Map
                </h3>
                <div className="flex-1 w-full min-h-[650px] rounded-2xl overflow-hidden shadow-lg relative z-10">
                  <IndiaLiveMap
                    selectedIncident={selectedIncident}
                    selectedLocation={selectedLocation}
                  />
                </div>
                <div className="ambient-glow ambient-glow-cyan"></div>
              </div>

              {/* Incident Summary Panel */}
              <div className="w-full premium-card incident-panel p-6 mb-6">
                <div className="glass-reflection"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-4 mb-4 gap-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-bold font-mono text-cyan-400">
                      {selectedIncident.id}
                    </h3>
                    <span className="text-xs text-blue-200/50">
                      Reported:{" "}
                      {new Date(selectedIncident.timestamp).toLocaleTimeString(
                        "en-US",
                        { hour12: true, hour: "numeric", minute: "2-digit" },
                      )}{" "}
                      •{" "}
                      {new Date(selectedIncident.timestamp).toLocaleDateString(
                        "en-US",
                        { day: "numeric", month: "long", year: "numeric" },
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-lg font-black tracking-widest uppercase shadow-inner ${getSeverityBadgeClass(selectedIncident.severity)}`}
                    >
                      {selectedIncident.severity}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs rounded-lg font-black tracking-widest uppercase shadow-inner ${getStatusBadgeClass(selectedIncident.status)}`}
                    >
                      {selectedIncident.status}
                    </span>
                    <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                      <span className="text-[10px] text-blue-200/50 uppercase font-bold tracking-wider">
                        CAD Status:
                      </span>
                      <select
                        value={selectedIncident.status}
                        onChange={(e) =>
                          onStatusUpdate(
                            selectedIncident.id,
                            e.target.value as IncidentStatus,
                          )
                        }
                        className="text-xs font-bold uppercase bg-transparent text-cyan-400 focus:outline-none cursor-pointer appearance-none"
                      >
                        <option value="reported" className="bg-[#08080C]">
                          Reported
                        </option>
                        <option value="dispatching" className="bg-[#08080C]">
                          Dispatching
                        </option>
                        <option value="en-route" className="bg-[#08080C]">
                          En-Route
                        </option>
                        <option value="on-scene" className="bg-[#08080C]">
                          On-Scene
                        </option>
                        <option value="resolved" className="bg-[#08080C]">
                          Resolved
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                    <p className="text-sm text-blue-100/80 leading-relaxed font-medium">
                      {selectedIncident.description}
                    </p>
                    <div className="space-y-1 pt-2">
                      <div className="flex items-center gap-2 text-rose-500 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedIncident.location.address}</span>
                      </div>
                      <div className="text-xs text-blue-200/50 font-mono ml-6">
                        {selectedIncident.location.lat.toFixed(4)}° N,{" "}
                        {selectedIncident.location.lng.toFixed(4)}° E
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-[320px] shrink-0 border border-white/5 rounded-xl bg-black/30 p-4 relative overflow-hidden flex flex-col justify-between min-h-[120px]">
                    <span className="text-[10px] text-cyan-200/80 font-black uppercase tracking-widest block mb-2">
                      GPS Tracker - Live
                    </span>
                    <div className="flex-1 w-full relative flex items-center py-2 h-8">
                      <div className="w-full h-[2px] bg-cyan-900/50 absolute top-1/2 -translate-y-1/2 left-0 right-0"></div>
                      <svg
                        className="w-full h-full absolute inset-0"
                        preserveAspectRatio="none"
                      >
                        <polyline
                          points="0,15 20,5 40,20 60,10 80,25 100,10 120,20 140,5 160,15"
                          fill="none"
                          stroke="#22d3ee"
                          strokeWidth="2"
                          strokeDasharray="4 2"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                      <div className="w-2 h-2 rounded-full bg-white absolute right-4 top-1/2 -translate-y-1/2 shadow-[0_0_10px_#22d3ee] z-10"></div>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded-md">
                        <Truck className="w-3.5 h-3.5" />
                        <span>{selectedIncident.ambulance?.eta || "--"}</span>
                      </div>
                      <span className="text-[10px] text-blue-200/50 uppercase mt-auto">
                        Fleet ETA
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="premium-card rounded-3xl h-[600px] flex flex-col items-center justify-center text-center p-8">
              <ShieldAlert className="w-16 h-16 text-blue-500/30 mb-4 animate-pulse drop-shadow-lg" />
              <h3 className="text-white font-black text-xl tracking-wider">
                AWAITING INCIDENT SELECTION
              </h3>
              <p className="text-blue-100/50 mt-2 max-w-md">
                Select an incident from the registry feed on the left to begin
                Mission Control operations.
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Fleet Operations */}
        <div className="w-full flex flex-col gap-8 h-full">
          {selectedIncident && (
            <>
              {/* Nearest Facilities (Combined Card) */}
              <div className="premium-card services-card p-6 flex flex-col flex-1">
                <div className="glass-reflection"></div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-black uppercase tracking-widest text-white">
                    Nearest Facilities & Authorities
                  </span>
                  <span className="text-xs text-blue-200/50 font-bold uppercase transition-colors hover:text-cyan-400 cursor-pointer flex items-center gap-1">
                    View All <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
                <div className="ambient-glow ambient-glow-cyan"></div>

                <div className="space-y-4 flex-1 relative z-10">
                  {/* Processing Facility */}
                  <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <PlusSquare className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-white truncate">
                          {selectedIncident.traumaCenter?.name ||
                            "Processing Center"}
                        </p>
                        <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md uppercase font-black tracking-wider whitespace-nowrap">
                          Collection Node
                        </span>
                      </div>
                      <p className="text-[10px] text-blue-200/70 truncate flex items-center gap-1 mb-1">
                        {selectedIncident.traumaCenter?.distance || "0 km"} •
                        Chennai
                      </p>
                      <p className="text-[10px] text-emerald-400/80 font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>{" "}
                        24x7 Operations • Capacity:{" "}
                        {selectedIncident.traumaCenter?.bedsAvailable} Tons
                      </p>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 hover:bg-indigo-500/30 transition-colors">
                      <PhoneCall className="w-3.5 h-3.5 text-indigo-400" />
                    </button>
                  </div>

                  {/* Smart Fleet */}
                  <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                      <Truck className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-white truncate">
                          {selectedIncident.ambulance?.id || "Smart Fleet Unit"}
                        </p>
                        <span className="text-[9px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-md uppercase font-black tracking-wider whitespace-nowrap">
                          Smart Fleet
                        </span>
                      </div>
                      <p className="text-[10px] text-blue-200/70 truncate flex items-center gap-1">
                        <span className="font-mono text-cyan-400">
                          {selectedIncident.ambulance?.eta || "Unknown"}
                        </span>{" "}
                        • {selectedIncident.ambulance?.operator || "On the way"}
                      </p>
                      <div className="h-6 w-full mt-2 relative">
                        <svg
                          className="w-full h-full absolute inset-0"
                          preserveAspectRatio="none"
                        >
                          <polyline
                            points="0,15 10,12 20,20 30,5 40,15 50,22 60,10 70,18"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="1.5"
                            strokeDasharray="3 2"
                            vectorEffect="non-scaling-stroke"
                          />
                        </svg>
                      </div>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 hover:bg-indigo-500/30 transition-colors">
                      <PhoneCall className="w-3.5 h-3.5 text-indigo-400" />
                    </button>
                  </div>

                  {/* Police Patrol */}
                  <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-white truncate">
                          {selectedIncident.policeUnit?.stationName ||
                            "Tambaram Police Station"}
                        </p>
                        <span className="text-[9px] px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-md uppercase font-black tracking-wider whitespace-nowrap">
                          Police
                        </span>
                      </div>
                      <p className="text-[10px] text-blue-200/70 truncate flex items-center gap-1">
                        {selectedIncident.policeUnit?.eta || "2.1 km"} •{" "}
                        {selectedIncident.location.city || "Chennai"} Division
                      </p>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 hover:bg-indigo-500/30 transition-colors">
                      <PhoneCall className="w-3.5 h-3.5 text-indigo-400" />
                    </button>
                  </div>

                  {/* Highway Patrol Traffic Unit */}
                  <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-white truncate">
                          Highway Patrol Traffic Unit
                        </p>
                        <span className="text-[9px] px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded-md uppercase font-black tracking-wider whitespace-nowrap">
                          Task Force
                        </span>
                      </div>
                      <p className="text-[10px] text-blue-200/70 truncate flex items-center gap-1">
                        2.9 km • NHAI Clearances
                      </p>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 hover:bg-amber-500/30 transition-colors">
                      <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Incident Analytics View */}
              <div className="flex flex-col flex-1"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const EmergencyDashboard = React.memo(EmergencyDashboardInner);
EmergencyDashboard.displayName = "EmergencyDashboard";
export default EmergencyDashboard;
