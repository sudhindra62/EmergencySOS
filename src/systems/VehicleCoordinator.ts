import { useEffect } from "react";
import {
  useDigitalTwinEngine,
  Vehicle,
  AgentParticle,
} from "./DigitalTwinEngine";

export const useVehicleCoordinator = () => {
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const animate = () => {
      const engine = useDigitalTwinEngine.getState();

      const vehicleUpdates: Partial<Vehicle>[] = [];
      const particleUpdates: Partial<AgentParticle>[] = [];
      const particleRemovals: string[] = [];
      const routeUpdates: { id: string; waypoints: [number, number][] }[] = [];

      // Animate Vehicles
      engine.vehicles.forEach((vehicle) => {
        const [lat, lng] = vehicle.coords;
        const targetCoords = vehicle.targetCoords;
        const [targetLat, targetLng] = targetCoords;

// If it's far enough, move it
        const route = engine.routes.find(r => r.id === `route-${vehicle.id}`);
        let waypoints = route ? route.waypoints : [[lat, lng], [targetLat, targetLng]];
        
        let pathDist = 0;
        let currentSegment = 0;
        
        // Find the next target waypoint
        // Since we are shifting waypoints as we reach them, our current path is remaining waypoints
        let nextWaypoint = waypoints.length > 1 ? waypoints[1] as [number, number] : targetCoords;
        let distSq = Math.pow(nextWaypoint[0] - lat, 2) + Math.pow(nextWaypoint[1] - lng, 2);
        let dist = Math.sqrt(distSq);

        // If we are very close to the next waypoint (or overshoot), pop it and look at the next one
        let shiftCount = 0;
        let moveSpeed = 0.00015; // Distance to move per 50ms (was 0.0003 per 100ms)
        
        while (dist < moveSpeed && waypoints.length > 2 + shiftCount) {
             shiftCount++;
             nextWaypoint = waypoints[1 + shiftCount] as [number, number];
             distSq = Math.pow(nextWaypoint[0] - lat, 2) + Math.pow(nextWaypoint[1] - lng, 2);
             dist = Math.sqrt(distSq);
        }

        if (dist > 0.0001 || waypoints.length > 2) {
          const speed = Math.min(moveSpeed, dist);
          const dirLat = (nextWaypoint[0] - lat) / dist;
          const dirLng = (nextWaypoint[1] - lng) / dist;

          const newLat = lat + dirLat * speed;
          const newLng = lng + dirLng * speed;

          const dx = nextWaypoint[1] - lng;
          const dy = nextWaypoint[0] - lat;
          const heading = Math.atan2(dx, dy) * (180 / Math.PI);

          const remainingDistKm =
            Math.sqrt(
              Math.pow(targetLat - newLat, 2) + Math.pow(targetLng - newLng, 2),
            ) * 111;
          const remainingMins = Math.floor((remainingDistKm / 40) * 60) + 1;
          const etaStr = remainingMins > 0 ? `${remainingMins} min` : "< 1 min";

          vehicleUpdates.push({
            id: vehicle.id,
            coords: [newLat, newLng],
            heading,
            distance: `${remainingDistKm.toFixed(1)} km`,
            eta: etaStr,
          });

          if (route) {
             const remainingWaypoints = waypoints.slice(1 + shiftCount) as [number, number][];
             remainingWaypoints.unshift([newLat, newLng] as [number, number]);
             routeUpdates.push({
                 id: route.id,
                 waypoints: remainingWaypoints
             });
          }
        } else if (vehicle.distance !== "0.0 km" && vehicle.eta !== "Arrived") {
          vehicleUpdates.push({
            id: vehicle.id,
            coords: [lat, lng],
            heading: vehicle.heading,
            distance: "0.0 km",
            eta: "Arrived",
          });
          
          if (route) {
             routeUpdates.push({
                 id: route.id,
                 waypoints: [[lat, lng], [targetLat, targetLng]]
             });
          }
        }
      });

      // Animate Particles
      engine.particles.forEach((particle) => {
        const speed = 0.04; // Roughly 4% per 50ms
        let newProgress = particle.progress + speed;

        if (newProgress >= 1) {
          particleRemovals.push(particle.id);
        } else {
          const startLat = particle.coords[0];
          const startLng = particle.coords[1];
          const [targetLat, targetLng] = particle.target;

          const newLat = startLat + (targetLat - startLat) * speed;
          const newLng = startLng + (targetLng - startLng) * speed;

          particleUpdates.push({
            id: particle.id,
            progress: newProgress,
            coords: [newLat, newLng],
          });
        }
      });

      if (
        vehicleUpdates.length > 0 ||
        particleUpdates.length > 0 ||
        particleRemovals.length > 0 ||
        routeUpdates.length > 0
      ) {
        engine.batchUpdate(vehicleUpdates, particleUpdates, particleRemovals, routeUpdates);
      }
    };

    intervalId = setInterval(animate, 50); // 20 FPS for smoother vehicle movement
    return () => clearInterval(intervalId);
  }, []);
};
