import { create } from "zustand";
import { dispatchSocket } from "./DispatchSocket";
import { RouteSimulator } from "./RouteSimulator";

export interface Vehicle {
  id: string;
  type: "ambulance" | "police" | "rescue";
  coords: [number, number];
  targetCoords: [number, number];
  eta: string;
  distance: string;
  heading: number;
}

export interface PulseEvent {
  id: string;
  type: string;
  timestamp: number;
}

export interface BuildingModel {
  id: string;
  coords: [number, number];
  type: "hospital" | "affected" | "critical" | "normal";
  size: number;
}

export interface RouteCorridor {
  id: string;
  waypoints: [number, number][];
  status: "green" | "yellow" | "red" | "teal" | "purple" | "orange";
}

export interface AgentParticle {
  id: string;
  coords: [number, number];
  target: [number, number];
  progress: number; // 0 to 1
  label: string;
}

export interface TwinState {
  incidentActive: boolean;
  incidentId: string | null;
  incidentCoords: [number, number] | null;
  severity: string | null;
  hospitalSelected: {
    name: string;
    coords: { lat: number; lng: number };
  } | null;
  vehicles: Vehicle[];
  pulses: PulseEvent[];
  buildings: BuildingModel[];
  routes: RouteCorridor[];
  particles: AgentParticle[];
  dispatchStatus: string;
  triggerSOS: (lat: number, lng: number) => void;
  resetTwin: () => void;
  batchUpdate: (
    vehicleUpdates: Partial<Vehicle>[],
    particleUpdates: Partial<AgentParticle>[],
    particleRemovals: string[],
    routeUpdates?: { id: string; waypoints: [number, number][] }[]
  ) => void;
}

export const useDigitalTwinEngine = create<TwinState>((set, get) => {
  const socket = dispatchSocket.connect();

  socket.on("incident_created", (data) => {
    set({
      incidentActive: true,
      incidentId: data.id,
      incidentCoords: [data.lat, data.lng],
      buildings: [],
      dispatchStatus: "Incident Created. Calculating protocol...",
    });
  });

  socket.on("severity_scored", (data) => {
    set((state) => {
      if (!state.incidentCoords) return state;
      return {
        severity: data.severity,
        dispatchStatus: "Severity Scored: " + data.severity,
        pulses: [
          ...state.pulses,
          {
            id: Math.random().toString(),
            type: "severity",
            timestamp: Date.now(),
          },
        ],
        particles: [
          ...state.particles,
          {
            id: `particle-severity-${Date.now()}`,
            coords: [
              state.incidentCoords[0] + 0.05,
              state.incidentCoords[1] - 0.05,
            ],
            target: state.incidentCoords,
            progress: 0,
            label: "SeverityAgent",
          },
        ],
      };
    });
  });

  socket.on("hospital_selected", async (data) => {
    const hospitalCoords: [number, number] = [
      data.coords.lat + 0.03,
      data.coords.lng + 0.04,
    ];

    set((state) => ({
      hospitalSelected: data,
      dispatchStatus: "Hospital Selected: " + data.name,
      pulses: [
        ...state.pulses,
        {
          id: Math.random().toString(),
          type: "hospital",
          timestamp: Date.now(),
        },
      ],
      buildings: [
        ...state.buildings,
        {
          id: "hospital-main",
          coords: hospitalCoords,
          type: "hospital",
          size: 200,
        },
      ],
      particles: [
        ...state.particles,
        {
          id: `particle-hospital-${Date.now()}`,
          coords: state.incidentCoords!,
          target: hospitalCoords,
          progress: 0,
          label: "HospitalAgent",
        },
      ]
    }));

    const incidentCoords = get().incidentCoords;
    if (incidentCoords) {
      const waypoints = await RouteSimulator.getRealRoute(incidentCoords[0], incidentCoords[1], hospitalCoords[0], hospitalCoords[1]);
      set((state) => ({
         routes: [
          ...state.routes,
          {
            id: "route-to-hospital",
            waypoints,
            status: "green",
          },
        ],
      }));
    }
  });

  socket.on("route_locked", (data) => {
    set((state) => ({
      dispatchStatus: "Green Corridor Locked.",
      pulses: [
        ...state.pulses,
        { id: Math.random().toString(), type: "route", timestamp: Date.now() },
      ],
    }));
  });

  socket.on("vehicle_spawn", async (data) => {
    const currentState = get();
    if (!currentState.incidentCoords) return;

    const isAmbulance = data.type === "ambulance";
    const isPolice = data.type === "police";

    // Use deterministic directional offsets to ensure distinct paths
    const offsetLat = isAmbulance 
        ? -0.05 - Math.random() * 0.05 // South
        : isPolice 
        ? 0.06 + Math.random() * 0.08 // North
        : -0.03 - Math.random() * 0.05;
        
    const offsetLng = isAmbulance 
        ? 0.05 + Math.random() * 0.05 // East
        : isPolice 
        ? -0.06 - Math.random() * 0.08 // West
        : -0.05 - Math.random() * 0.05;
    const start: [number, number] = [
      currentState.incidentCoords[0] + offsetLat,
      currentState.incidentCoords[1] + offsetLng,
    ];

    set((state) => ({
      vehicles: [
        ...state.vehicles,
        {
          id: data.id,
          type: data.type,
          coords: start,
          targetCoords: state.incidentCoords!,
          eta: data.eta,
          distance: `${(Math.sqrt(offsetLat * offsetLat + offsetLng * offsetLng) * 111).toFixed(1)} km`,
          heading: 0,
        },
      ],
      dispatchStatus: `Unit ${data.id} Dispatched.`,
    }));

    const waypoints = await RouteSimulator.getRealRoute(start[0], start[1], currentState.incidentCoords[0], currentState.incidentCoords[1]);

    set((state) => ({
      routes: [
        ...state.routes,
        {
          id: `route-${data.id}`,
          waypoints,
          status:
            data.type === "ambulance"
              ? "teal"
              : data.type === "police"
                ? "purple"
                : "orange",
        },
      ]
    }));
  });

  socket.on("dispatch_complete", (data) => {
    set({ dispatchStatus: data.status });
  });

  return {
    incidentActive: false,
    incidentId: null,
    incidentCoords: null,
    severity: null,
    hospitalSelected: null,
    vehicles: [],
    pulses: [],
    buildings: [],
    routes: [],
    particles: [],
    dispatchStatus: "Standby Mode",

    triggerSOS: (lat, lng) => {
      set({
        vehicles: [],
        pulses: [],
        buildings: [],
        routes: [],
        particles: [],
        hospitalSelected: null,
        severity: null,
      });
      dispatchSocket.triggerIncident({ lat, lng });
    },

    resetTwin: () => {
      set({
        incidentActive: false,
        incidentId: null,
        incidentCoords: null,
        vehicles: [],
        pulses: [],
        buildings: [],
        routes: [],
        particles: [],
        hospitalSelected: null,
        severity: null,
        dispatchStatus: "Standby Mode",
      });
    },

    batchUpdate: (vehicleUpdates, particleUpdates, particleRemovals, routeUpdates) => {
      set((state) => {
        let newVehicles = state.vehicles;
        if (vehicleUpdates.length > 0) {
          newVehicles = state.vehicles.map((v) => {
            const update = vehicleUpdates.find((u) => u.id === v.id);
            return update ? { ...v, ...update } : v;
          });
        }

        let newParticles = state.particles;
        if (particleRemovals.length > 0) {
          newParticles = newParticles.filter(
            (p) => !particleRemovals.includes(p.id),
          );
        }
        if (particleUpdates.length > 0) {
          newParticles = newParticles.map((p) => {
            const update = particleUpdates.find((u) => u.id === p.id);
            return update ? { ...p, ...update } : p;
          });
        }

        let newRoutes = state.routes;
        if (routeUpdates && routeUpdates.length > 0) {
           newRoutes = state.routes.map((r) => {
              const update = routeUpdates.find((u) => u.id === r.id);
              return update ? { ...r, waypoints: update.waypoints } : r;
           });
        }

        return { vehicles: newVehicles, particles: newParticles, routes: newRoutes };
      });
    },
  };
});
