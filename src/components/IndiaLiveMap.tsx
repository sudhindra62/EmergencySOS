import React, { useEffect, memo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap,
  GeoJSON,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Incident } from "../types";
import { geocodeReportText, asyncGeocode } from "../lib/geocoder";
import { useDigitalTwinEngine } from "../systems/DigitalTwinEngine";
import { useVehicleCoordinator } from "../systems/VehicleCoordinator";
import { RouteSimulator } from "../systems/RouteSimulator";

// Store static routes to avoid regenerating straight lines
interface StaticRouteCache {
  [key: string]: [number, number][];
}

const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629];
const DEFAULT_ZOOM = 5;

// Resource placement helper (simulates nearby hospitals/police/rescue)
const getSimulatedResourceLocation = (
  lat: number,
  lng: number,
  offsetLat: number,
  offsetLng: number,
): [number, number] => {
  return [lat + offsetLat, lng + offsetLng];
};

// Icons setup
const createCustomIcon = (
  color: string,
  letter: string,
  isPulsing: boolean = false,
) => {
  const pulseClass = isPulsing ? "leaflet-marker-pulse-rose" : "";
  return L.divIcon({
    html: `
      <div class="${pulseClass}" style="
        background-color: ${color}; 
        width: 24px; 
        height: 24px; 
        border-radius: 50%; 
        border: 2px solid #020617; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        color: white; 
        font-weight: bold; 
        font-size: 12px;
        box-shadow: 0 0 ${isPulsing ? "15px" : "5px"} ${color};
      ">
        ${letter}
      </div>
    `,
    className: "custom-leaflet-icon",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const createBlueprintVehicleIcon = (
  type: string,
  color: string,
  heading: number,
  eta: string,
  distance: string,
) => {
  const svg = `
    <svg width="32" height="48" viewBox="0 0 32 48" xmlns="http://www.w3.org/2000/svg">
      <!-- Shadow -->
      <path d="M 6 8 Q 16 -2 26 8 L 28 36 Q 16 48 4 36 Z" fill="rgba(0,0,0,0.4)" filter="blur(2px)"/>
      <!-- Body Profile -->
      <path d="M 6 10 C 6 4, 10 2, 16 2 C 22 2, 26 4, 26 10 L 28 38 C 28 44, 22 46, 16 46 C 10 46, 4 44, 4 38 Z" fill="${color}" stroke="#0f172a" stroke-width="1.5"/>
      
      <!-- Windshield -->
      <path d="M 8 14 C 12 12, 20 12, 24 14 L 25 20 L 7 20 Z" fill="#0f172a" />
      <path d="M 9 15 C 13 13.5, 19 13.5, 23 15 L 24 19 L 8 19 Z" fill="#1e293b" />
      
      <!-- Rear Window -->
      <path d="M 8 36 C 12 37, 20 37, 24 36 L 23 32 L 9 32 Z" fill="#0f172a" />
      <path d="M 9 35.5 C 13 36.2, 19 36.2, 23 35.5 L 22 33 L 10 33 Z" fill="#1e293b" />
      
      <!-- Headlights -->
      <path d="M 6 5 A 2 2 0 0 1 10 5 L 9 7 L 6.5 7 Z" fill="#fef08a" />
      <path d="M 26 5 A 2 2 0 0 0 22 5 L 23 7 L 25.5 7 Z" fill="#fef08a" />
      <path d="M 7 4 L 9 4 L 8 2 Z" fill="#fff" opacity="0.6"/>
      <path d="M 25 4 L 23 4 L 24 2 Z" fill="#fff" opacity="0.6"/>
      
      <!-- Taillights -->
      <path d="M 5 43 A 1 1 0 0 0 9 43 L 8 45 L 5.5 45 Z" fill="#ef4444" />
      <path d="M 27 43 A 1 1 0 0 1 23 43 L 24 45 L 26.5 45 Z" fill="#ef4444" />
      
      <!-- Details -->
      ${
        type === "ambulance"
          ? `
        <rect x="10" y="22" width="12" height="8" rx="1" fill="#ffffff" />
        <path d="M 16 23 L 16 29 M 13 26 L 19 26" stroke="#ef4444" stroke-width="2" stroke-linecap="square"/>
        <line x1="12" y1="12" x2="14" y2="12" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/>
        <line x1="18" y1="12" x2="20" y2="12" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
      `
          : ""
      }
      ${
        type === "police"
          ? `
        <rect x="12" y="23" width="8" height="6" rx="1" fill="#fff" opacity="0.1" />
        <rect x="11" y="11" width="4" height="2" fill="#ef4444" />
        <rect x="17" y="11" width="4" height="2" fill="#3b82f6" />
      `
          : ""
      }
      ${
        type === "rescue"
          ? `
        <rect x="11" y="21" width="10" height="10" fill="none" stroke="#fff" stroke-width="1" stroke-dasharray="2,2"/>
        <circle cx="16" cy="12" r="1.5" fill="#ef4444" />
      `
          : ""
      }
    </svg>
  `;
  return L.divIcon({
    html: `
      <div style="
        position: relative;
        width: 32px; 
        height: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
      ">
        <div style="
          transform: rotate(${heading}deg);
          transform-origin: center center;
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.6));
        ">
          ${svg}
        </div>
        <div style="
          position: absolute;
          top: -28px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid ${color};
          border-radius: 4px;
          padding: 2px 6px;
          color: #f8fafc;
          font-family: monospace;
          font-size: 10px;
          white-space: nowrap;
          font-weight: 600;
          box-shadow: 0 2px 4px rgba(0,0,0,0.5);
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        ">
          <span>${eta}</span>
          <span style="font-size: 8px; color: ${color}">${distance}</span>
        </div>
      </div>
    `,
    className: "custom-blueprint-vehicle transition-transform duration-100 ease-linear",
    iconSize: [32, 48],
    iconAnchor: [16, 24],
  });
};

const iconMapping = {
  incident: createCustomIcon("#e11d48", "!", true), // rose-600
  ambulance: createCustomIcon("#14b8a6", "A"), // teal-500
  hospital: createCustomIcon("#3b82f6", "H"), // blue-500
  police: createCustomIcon("#8b5cf6", "P"), // purple-500
  rescue: createCustomIcon("#f59e0b", "R"), // amber-500
};

// Component to dynamically fly to incident
const MapUpdater: React.FC<{ lat: number; lng: number; zoom: number }> = memo(
  ({ lat, lng, zoom }) => {
    const map = useMap();
    useEffect(() => {
      map.flyTo([lat, lng], zoom, { duration: 1.5 });
    }, [lat, lng, zoom, map]);
    return null;
  },
);

MapUpdater.displayName = "MapUpdater";

interface IndiaLiveMapProps {
  selectedIncident: Incident | null;
  selectedLocation?: string;
}

function TwinDynamicLayer(props: {
  selectedIncident: any;
  isDispatching: boolean;
}) {
  const twinState = useDigitalTwinEngine();
  useVehicleCoordinator();

  if (!twinState.incidentActive) return null;

  return (
    <>
      {/* Incident Active Aura & Marker */}
      {twinState.incidentCoords && (
        <>
          <Circle
            center={twinState.incidentCoords}
            radius={400}
            pathOptions={{
              color: "#e11d48",
              fillColor: "#e11d48",
              fillOpacity: 0.3,
            }}
          />
          <Marker
            position={twinState.incidentCoords}
            icon={iconMapping.incident}
          />
        </>
      )}

      {/* Live Synchronized Buildings */}
      {twinState.buildings.map((b) => (
        <React.Fragment key={b.id}>
          {b.type === "hospital" && (
            <Marker position={b.coords} icon={iconMapping.hospital} />
          )}
        </React.Fragment>
      ))}

      {/* Simulated Routes */}
      {twinState.routes.map((r) => {
        const routeColor =
          r.status === "green"
            ? "#22c55e"
            : r.status === "teal"
              ? "#14b8a6"
              : r.status === "purple"
                ? "#8b5cf6"
                : r.status === "orange"
                  ? "#f59e0b"
                  : r.status === "yellow"
                    ? "#eab308"
                    : "#ef4444";
        return (
          <React.Fragment key={r.id}>
            {/* Glowing background path */}
            <Polyline
              positions={r.waypoints}
              color={routeColor}
              weight={8}
              opacity={0.4}
              className="corridor-glow"
            />
            {/* Moving dashed track */}
            <Polyline
              positions={r.waypoints}
              color={routeColor}
              weight={3}
              className="animated-corridor-line"
            />
          </React.Fragment>
        );
      })}

      {/* Live Synchronized Vehicles */}
      {twinState.vehicles.map((v) => (
        <Marker
          key={v.id}
          position={v.coords}
          icon={createBlueprintVehicleIcon(
            v.type,
            v.type === "ambulance"
              ? "#14b8a6"
              : v.type === "police"
                ? "#8b5cf6"
                : "#f59e0b",
            v.heading || 0,
            v.eta || "Calculating...",
            v.distance || "0.0 km",
          )}
        >
          <Popup className="bg-slate-900 border border-slate-800 text-slate-200">
            <div className="font-bold text-blue-400 mb-1">{v.id}</div>
            <div className="text-xs">ETA: {v.eta}</div>
          </Popup>
        </Marker>
      ))}

      {/* Agent Signal Particles */}
      {twinState.particles.map((p) => (
        <Marker
          key={p.id}
          position={p.coords}
          icon={L.divIcon({
            html: `
              <div class="relative flex items-center justify-center pointer-events-none">
                <span class="absolute flex h-3 w-3">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-sky-500 shadow-[0_0_10px_#0ea5e9]"></span>
                </span>
                <span class="ml-6 px-1.5 py-0.5 bg-sky-900/80 border border-sky-500/50 rounded text-[8px] text-sky-200 font-mono whitespace-nowrap backdrop-blur-sm">
                  ${p.label}
                </span>
              </div>
            `,
            className:
              "custom-agent-particle transition-all duration-100 ease-linear",
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          })}
        />
      ))}
    </>
  );
}

function IndiaLiveMapInner({
  selectedIncident,
  selectedLocation,
}: IndiaLiveMapProps) {
  const [simulationMode, setSimulationMode] = useState(false);
  const [geoData, setGeoData] = useState<any>(null);
  const [staticRoutes, setStaticRoutes] = useState<StaticRouteCache>({});

  useEffect(() => {
    // Fetch static real routes for the static dashboard incident
    if (selectedIncident && selectedIncident.location) {
      const fetchRoutes = async () => {
        let routesObj: StaticRouteCache = {};
        const ilat = selectedIncident.location.lat;
        const ilng = selectedIncident.location.lng;

        if (selectedIncident.traumaCenter) {
           const target = getSimulatedResourceLocation(ilat, ilng, 0.03, 0.04);
           routesObj.hospital = await RouteSimulator.getRealRoute(target[0], target[1], ilat, ilng);
        }
        if (selectedIncident.ambulance) {
           const target = getSimulatedResourceLocation(ilat, ilng, -0.05, 0.04);
           routesObj.ambulance = await RouteSimulator.getRealRoute(target[0], target[1], ilat, ilng);
        }
        if (selectedIncident.policeUnit) {
           const target = getSimulatedResourceLocation(ilat, ilng, 0.06, -0.06);
           routesObj.police = await RouteSimulator.getRealRoute(target[0], target[1], ilat, ilng);
        }
        const targetOther = getSimulatedResourceLocation(ilat, ilng, 0.04, -0.02);
        routesObj.other = await RouteSimulator.getRealRoute(targetOther[0], targetOther[1], ilat, ilng);

        setStaticRoutes(routesObj);
      };
      
      fetchRoutes();
    }
  }, [selectedIncident]);

  useEffect(() => {
    // Fetch India States GeoJSON
    fetch(
      "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/india.geojson",
    )
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Could not load India GeoJSON:", err));
  }, []);

  const [centerFallback, setCenterFallback] = useState<any>(null);

  useEffect(() => {
    if (selectedLocation) {
      asyncGeocode(selectedLocation).then((res) => setCenterFallback(res));
    } else {
      setCenterFallback(null);
    }
  }, [selectedLocation]);

  const center: [number, number] =
    selectedIncident &&
    selectedIncident.location &&
    typeof selectedIncident.location.lat === "number" &&
    typeof selectedIncident.location.lng === "number"
      ? [selectedIncident.location.lat, selectedIncident.location.lng]
      : centerFallback &&
          typeof centerFallback.lat === "number" &&
          typeof centerFallback.lng === "number"
        ? [centerFallback.lat, centerFallback.lng]
        : DEFAULT_CENTER;

  const zoom =
    (selectedIncident && selectedIncident.location) || centerFallback
      ? 12
      : DEFAULT_ZOOM;

  const triggerSOS = useDigitalTwinEngine((s) => s.triggerSOS);
  const resetTwin = useDigitalTwinEngine((s) => s.resetTwin);
  const dispatchStatus = useDigitalTwinEngine((s) => s.dispatchStatus);
  const severity = useDigitalTwinEngine((s) => s.severity);
  const hospitalSelected = useDigitalTwinEngine((s) => s.hospitalSelected);
  const incidentActive = useDigitalTwinEngine((s) => s.incidentActive);
  const vehiclesCount = useDigitalTwinEngine((s) => s.vehicles.length);

  const isDispatching =
    selectedIncident?.status === "dispatching" ||
    selectedIncident?.status === "en-route" ||
    selectedIncident?.status === "on-scene";

  return (
    <div className="relative h-full w-full bg-slate-950 rounded-2xl border border-slate-900 overflow-hidden flex flex-col justify-between">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ width: "100%", height: "100%", zIndex: 1 }}
        zoomControl={true}
        scrollWheelZoom={true}
        preferCanvas={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {geoData && (
          <GeoJSON
            data={geoData}
            style={{
              color: "#1e293b",
              weight: 1,
              fillColor: "transparent",
              fillOpacity: 0,
            }}
          />
        )}

        <MapUpdater lat={center[0]} lng={center[1]} zoom={zoom} />

        {/* Global Key Cities Markers */}
        {!selectedIncident &&
          [
            { name: "New Delhi", lat: 28.6139, lng: 77.209 },
            { name: "Mumbai", lat: 19.076, lng: 72.8777 },
            { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
            { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
            { name: "Chennai", lat: 13.0827, lng: 80.2707 },
            { name: "Hyderabad", lat: 17.385, lng: 78.4867 },
            { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
            { name: "Pune", lat: 18.5204, lng: 73.8567 },
          ].map((c) => (
            <Marker
              key={c.name}
              position={[c.lat, c.lng]}
              icon={L.divIcon({
                className: "city-label-icon",
                html: `<div style="color: #64748b; font-size: 10px; font-weight: 600; text-shadow: 0 0 5px black; white-space: nowrap; transform: translate(-50%, -10px);">${c.name}</div>`,
                iconSize: [0, 0],
              })}
            />
          ))}

        {/* Selected Incident Marker */}
        {/* Render base incident marker only if Twin is NOT active */}
        {!incidentActive &&
          selectedIncident &&
          selectedIncident.location &&
          typeof selectedIncident.location.lat === "number" &&
          typeof selectedIncident.location.lng === "number" && (
            <Marker
              position={[
                selectedIncident.location.lat,
                selectedIncident.location.lng,
              ]}
              icon={iconMapping.incident}
            >
              <Popup className="bg-slate-900 border border-slate-800 text-slate-200">
                <div className="font-bold text-rose-500 mb-1">
                  Detection Zone: {selectedIncident.id}
                </div>
                <div className="text-xs">{selectedIncident.description}</div>
              </Popup>
            </Marker>
          )}

        {/* Render simulated dispatched resources if an incident is active, but Twin is NOT active */}
        {!incidentActive && selectedIncident && isDispatching && (
          <>
            {/* Hospital Marker */}
            {selectedIncident.traumaCenter && staticRoutes.hospital && (
              <Marker
                position={staticRoutes.hospital[0]}
                icon={iconMapping.hospital}
              >
                <Popup className="bg-slate-900 border border-slate-800 text-slate-200">
                  <div className="font-bold text-blue-500 mb-1">
                    {selectedIncident.traumaCenter.name}
                  </div>
                  <div className="text-xs">
                    Trauma Center Processing Facility
                  </div>
                  <div className="text-[10px] font-mono mt-2 text-cyan-300 bg-slate-950 p-1.5 rounded border border-cyan-900 leading-tight">
                    <span className="text-slate-400 block mb-0.5">
                      Helpline
                    </span>
                    {selectedIncident.traumaCenter.contact}
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Ambulance Marker */}
            {selectedIncident.ambulance && staticRoutes.ambulance && (
              <Marker
                position={staticRoutes.ambulance[0]}
                icon={createBlueprintVehicleIcon("ambulance", "#14b8a6", 0, selectedIncident.ambulance.eta, "Approaching")}
              >
                <Popup className="bg-slate-900 border border-slate-800 text-slate-200">
                  <div className="font-bold text-teal-400 mb-1">
                    {selectedIncident.ambulance.id}
                  </div>
                  <div className="text-xs">
                    ETA: {selectedIncident.ambulance.eta}
                  </div>
                  <div className="text-[10px] font-mono mt-2 text-teal-300 bg-slate-950 p-1.5 rounded border border-teal-900 leading-tight">
                    <span className="text-slate-400 block mb-0.5">
                      EMS Dispatch
                    </span>
                    {selectedIncident.ambulance.contact}
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Police Marker */}
            {selectedIncident.policeUnit && staticRoutes.police && (
              <Marker
                position={staticRoutes.police[0]}
                icon={createBlueprintVehicleIcon("police", "#8b5cf6", 0, selectedIncident.policeUnit.eta, "Approaching")}
              >
                <Popup className="bg-slate-900 border border-slate-800 text-slate-200">
                  <div className="font-bold text-purple-400 mb-1">
                    {selectedIncident.policeUnit.patrolId}
                  </div>
                  <div className="text-xs">
                    Compliance ETA: {selectedIncident.policeUnit.eta}
                  </div>
                  <div className="text-[10px] font-mono mt-2 text-purple-300 bg-slate-950 p-1.5 rounded border border-purple-900 leading-tight">
                    <span className="text-slate-400 block mb-0.5">
                      Patrol Division
                    </span>
                    {selectedIncident.policeUnit.contact}
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Rescue Service Marker */}
            {staticRoutes.other && (
              <Marker
                position={staticRoutes.other[0]}
                icon={createBlueprintVehicleIcon("rescue", "#f59e0b", 0, "12 mins", "Approaching")}
              >
                <Popup className="bg-slate-900 border border-slate-800 text-slate-200">
                  <div className="font-bold text-amber-500 mb-1">
                    NDRF / Fire Unit
                  </div>
                  <div className="text-xs">Mobilization ETA: 12 mins</div>
                  <div className="text-[10px] font-mono mt-2 text-amber-300 bg-slate-950 p-1.5 rounded border border-amber-900 leading-tight">
                    <span className="text-slate-400 block mb-0.5">
                      Alert Dispatch
                    </span>
                    101 / +91 112
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Draw Dynamic Route Corridors */}
            {selectedIncident.traumaCenter && selectedIncident.ambulance && (
              <>
                {staticRoutes.ambulance && (
                  <Polyline
                    positions={staticRoutes.ambulance}
                    color="#14b8a6"
                    weight={3.5}
                    dashArray="6, 10"
                    className="animated-ambulance-line"
                    pathOptions={{ className: "animated-ambulance-line" }}
                  />
                )}

                {staticRoutes.hospital && (
                    <Polyline
                      positions={staticRoutes.hospital}
                      color="#22c55e"
                      weight={4}
                      dashArray="8, 12"
                      className="animated-corridor-line"
                      pathOptions={{ className: "animated-corridor-line" }}
                    />
                )}

                {selectedIncident.policeUnit && staticRoutes.police && (
                  <Polyline
                    positions={staticRoutes.police}
                    color="#8b5cf6"
                    weight={3.5}
                    dashArray="6, 10"
                    className="animated-corridor-line"
                    pathOptions={{ className: "animated-corridor-line" }}
                  />
                )}

                {staticRoutes.other && (
                    <Polyline
                      positions={staticRoutes.other}
                      color="#f59e0b"
                      weight={3}
                      dashArray="6, 10"
                      className="animated-corridor-line"
                      pathOptions={{ className: "animated-corridor-line" }}
                    />
                )}
              </>
            )}
          </>
        )}

        {/* Digital Twin Engine LIVE render */}
        <TwinDynamicLayer
          selectedIncident={selectedIncident}
          isDispatching={isDispatching}
        />
      </MapContainer>

      {/* Map Header Indicators */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex items-center justify-between text-[10px] text-slate-200 font-mono pointer-events-auto">
        <span className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          INDIA ECO-GIS OVERLAY: ACTIVE
        </span>
        <button
          onClick={() => {
            if (incidentActive) {
              resetTwin();
            } else {
              setSimulationMode(true);
              triggerSOS(center[0], center[1]);
            }
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded shadow-lg transition-all border cursor-pointer hover:bg-sky-500/10 ${incidentActive ? "bg-sky-900/40 text-sky-300 border-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.3)]" : "bg-slate-900 border-slate-800 text-slate-300"}`}
        >
          <span
            className={`w-2 h-2 rounded-full ${incidentActive ? "bg-sky-400 animate-ping" : "bg-slate-600"}`}
          ></span>
          DIGITAL TWIN SIMULATION
        </button>
        <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded shadow-lg">
          {zoom === DEFAULT_ZOOM ? "NATIONAL VIEW" : "TACTICAL ZOOM"}
        </span>
      </div>

      {/* Digital Twin Command Overlay */}
      {incidentActive && (
        <div className="absolute top-20 right-4 z-[400] pointer-events-none flex flex-col items-end gap-2 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="bg-slate-900/80 backdrop-blur-md border border-sky-500/30 px-4 py-3 rounded-xl shadow-[0_0_15px_rgba(14,165,233,0.3)] min-w-[200px]">
            <div className="text-sky-400 text-[10px] font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              Live Sync Engine
            </div>
            <div className="flex flex-col gap-1.5 text-xs font-mono text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">STATUS:</span>
                <span className="text-white line-clamp-1 text-right max-w-[120px]">
                  {dispatchStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">SEVERITY:</span>
                <span
                  className={
                    severity === "Critical" ? "text-rose-400" : "text-amber-400"
                  }
                >
                  {severity || "Analyzing..."}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">HOSPITAL:</span>
                <span className="text-emerald-400 line-clamp-1 max-w-[120px] text-right">
                  {hospitalSelected?.name || "Searching..."}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">UNITS:</span>
                <span className="text-sky-400">{vehiclesCount} En-Route</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Bottom Legends overlay */}
      <div className="absolute bottom-6 left-4 z-[400] pointer-events-none">
        <div className="flex flex-col gap-3 text-xs font-mono text-slate-300 bg-slate-900 border border-slate-800 px-4 py-4 rounded-xl shadow-2xl">
          <span className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider mb-1">
            Tesla Command Center
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Detection
            Zone (SOS)
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Trauma
            Facility Map
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> Fleet
            Tracking
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />{" "}
            Compliance Force
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Fire &
            Rescue (NDRF)
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-teal-400 inline-block drop-shadow-md" />{" "}
            ETA Route Corridors
          </span>
        </div>
      </div>
    </div>
  );
}

const IndiaLiveMap = memo(IndiaLiveMapInner, (prevProps, nextProps) => {
  if (prevProps.selectedIncident === nextProps.selectedIncident) return true;
  if (!prevProps.selectedIncident || !nextProps.selectedIncident) return false;

  return (
    prevProps.selectedIncident.id === nextProps.selectedIncident.id &&
    prevProps.selectedIncident.status === nextProps.selectedIncident.status &&
    prevProps.selectedIncident.location.lat ===
      nextProps.selectedIncident.location.lat &&
    prevProps.selectedIncident.location.lng ===
      nextProps.selectedIncident.location.lng &&
    prevProps.selectedIncident.traumaCenter?.name ===
      nextProps.selectedIncident.traumaCenter?.name &&
    prevProps.selectedIncident.ambulance?.eta ===
      nextProps.selectedIncident.ambulance?.eta &&
    prevProps.selectedIncident.policeUnit?.patrolId ===
      nextProps.selectedIncident.policeUnit?.patrolId
  );
});

IndiaLiveMap.displayName = "IndiaLiveMap";

export default IndiaLiveMap;
