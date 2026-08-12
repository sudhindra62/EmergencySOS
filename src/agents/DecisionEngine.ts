import { useAgentBrain } from "./AgentBrain";

class DecisionEngineCore {
  private listeners: Map<string, Function[]> = new Map();

  emit(event: string, data?: any) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(fn => fn(data));
    }
  }

  on(event: string, fn: Function) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(fn);
  }

  private speak(text: string, voiceType: number = 0) {
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance(text);
      msg.rate = 1.1; // Fast, urgent
      msg.pitch = voiceType; // 0 for coordinator, 1 for dispatch
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        msg.voice = voices[voiceType % voices.length];
      }
      window.speechSynthesis.speak(msg);
    }
  }

  async runSOSScenario() {
    const { setAgentState, setWireState, updateAgentMemory, resetFabric } = useAgentBrain.getState();
    resetFabric();
    
    this.emit("agent_awake");
    
    // Step 1: Coordinator awakens
    setAgentState("coord", "thinking");
    setWireState("coord", "voice", "execution");
    setAgentState("voice", "busy");
    this.speak("Emergency detected. Activating neural orchestrator.", 0);
    await this.sleep(1000);
    setWireState("coord", "voice", "idle");
    setAgentState("voice", "idle");
    
    // Step 2: Coordinator requests Severity
    this.emit("agent_request", { from: "coord", to: "severity" });
    setWireState("coord", "severity", "execution");
    setAgentState("severity", "busy");
    await this.sleep(1500);
    
    // Step 3: Severity says critical
    updateAgentMemory("severity", { lastDecision: "CRITICAL", confidence: 96 });
    setAgentState("severity", "completed");
    setWireState("coord", "severity", "idle");
    setAgentState("coord", "negotiating");
    this.emit("agent_vote", { agent: "severity", decision: "CRITICAL" });
    
    // Step 4: Hospital Negotiation
    this.speak("Severity critical. Querying trauma centers.", 0);
    setWireState("coord", "hospital", "negotiation");
    setAgentState("hospital", "negotiating");
    await this.sleep(1500);
    updateAgentMemory("hospital", { lastDecision: "ICU FULL", confidence: 45 });
    setAgentState("hospital", "failed");
    setWireState("coord", "hospital", "failed");
    this.emit("agent_failed", { agent: "hospital" });
    this.speak("Primary ICU unavailable. Rerouting to secondary.", 1);
    
    await this.sleep(1000);
    setAgentState("hospital", "recovering");
    setWireState("coord", "hospital", "flow");
    await this.sleep(1000);
    updateAgentMemory("hospital", { lastDecision: "ALT ICU ACCEPTS", confidence: 92 });
    setAgentState("hospital", "completed");
    setWireState("coord", "hospital", "idle");
    this.speak("Secondary trauma center locked.", 1);
    
    // Step 5: Route & Fleet
    this.speak("Dispatching Advanced Life Support.", 0);
    setWireState("coord", "fleet", "negotiation");
    setAgentState("fleet", "negotiating");
    await this.sleep(1000);
    updateAgentMemory("fleet", { lastDecision: "ALS AMB-4 LOCKED", confidence: 99 });
    setAgentState("fleet", "completed");
    setWireState("coord", "fleet", "idle");

    setWireState("fleet", "route", "execution");
    setWireState("hospital", "route", "execution");
    setAgentState("route", "busy");
    await this.sleep(1500);
    updateAgentMemory("route", { lastDecision: "-4 MIN ETA", confidence: 95 });
    setAgentState("route", "completed");
    setWireState("fleet", "route", "idle");
    setWireState("hospital", "route", "idle");
    this.speak("Green corridor established. 4 minutes ETA.", 1);
    
    // Step 5.5: Prediction agent prediction
    setWireState("coord", "prediction", "negotiation");
    setAgentState("prediction", "thinking");
    await this.sleep(1000);
    updateAgentMemory("prediction", { lastDecision: "ETA VALIDATED", confidence: 88 });
    setAgentState("prediction", "completed");
    setWireState("coord", "prediction", "idle");

    // Step 6: Consensus
    this.emit("agent_consensus");
    setAgentState("coord", "completed");
    setAgentState("police", "completed");
    setAgentState("family", "completed");
    setWireState("coord", "police", "execution");
    setWireState("coord", "family", "execution");
    
    await this.sleep(1000);
    this.speak("Consensus reached. Dispatch active.", 0);
    this.emit("agent_complete");
  }

  private sleep(ms: number) {
    return new Promise(r => setTimeout(r, ms));
  }
}

export const DecisionEngine = new DecisionEngineCore();
