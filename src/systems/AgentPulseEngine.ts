// This handles expanding visual 'ping' elements and expanding particle radii for agent triggers
import { useDigitalTwinEngine } from "./DigitalTwinEngine";

export class AgentPulseEngine {
  static getPulseRadius(t: number) {
    return Math.abs(Math.sin(t * 10)) * 500;
  }
}
