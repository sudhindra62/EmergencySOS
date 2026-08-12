import { DecisionEngine } from "../agents/DecisionEngine";

export class EmergencyEscalation {
  static scale(severity: string) {
     if (severity === 'critical') {
        DecisionEngine.runSOSScenario();
     }
  }
}
