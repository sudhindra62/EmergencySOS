// Keeps track of the incident sequence over time

export const incidentTimelineData = [
  { event: "incident_created", delay: 0 },
  { event: "severity_scored", delay: 500 },
  { event: "hospital_selected", delay: 1000 },
  { event: "route_locked", delay: 1500 },
  { event: "vehicle_spawn", delay: 1800 },
  { event: "dispatch_complete", delay: 2200 },
];
