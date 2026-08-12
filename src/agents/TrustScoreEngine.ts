// Trust scaling based on history
export class TrustScoreEngine {
  static getDynamicTrust(agentId: string, historyScore: number) {
     return Math.min(100, historyScore + (Math.random() * 5));
  }
}
