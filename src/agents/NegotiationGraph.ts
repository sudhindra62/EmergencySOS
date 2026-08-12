// Data structures for node tracking
export class NegotiationGraph {
  nodes = new Map();
  addNode(id: string, metadata: any) { this.nodes.set(id, metadata); }
}
