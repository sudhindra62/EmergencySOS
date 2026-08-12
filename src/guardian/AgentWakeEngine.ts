import { useAgentBrain } from "../agents/AgentBrain";

export class AgentWakeEngine {
  static awakenAll() {
    // Pings all agents to wake them from sleep state into idle/monitoring
    const { setAgentState, agents } = useAgentBrain.getState();
    Object.keys(agents).forEach(id => setAgentState(id, "idle"));
  }
}
