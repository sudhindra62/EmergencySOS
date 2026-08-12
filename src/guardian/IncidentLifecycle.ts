export class IncidentLifecycle {
  static createIncidentPacket() {
     return {
       id: `auto-${Date.now()}`,
       status: "detection_phase",
       timestamp: new Date().toISOString()
     };
  }
  static closeIncident(id: string) {
     // archival logic
  }
}
