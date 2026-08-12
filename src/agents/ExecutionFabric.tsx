import React, { useMemo } from 'react';
import { ReactFlow, Background, BackgroundVariant, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAgentBrain } from './AgentBrain';
import { NeuralNode } from './NeuralNode';
import { EnergyWire } from './EnergyWire';

const nodeTypes = {
  neural: NeuralNode,
};

const edgeTypes = {
  energy: EnergyWire,
};

const PipelineStep = ({ label, active, completed }: { label: string, active: boolean, completed: boolean }) => (
  <div className="flex items-center gap-3">
    <div className={`w-2 h-2 rounded-full ${completed ? 'bg-indigo-500 shadow-[0_0_10px_#6366f1]' : active ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse' : 'bg-slate-700'}`} />
    <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${completed ? 'text-indigo-300' : active ? 'text-cyan-300' : 'text-slate-600'}`}>
      {label}
    </div>
  </div>
);

const DecisionPipelineOverlay = () => {
  const coord = useAgentBrain(s => s.agents.coord);
  const severity = useAgentBrain(s => s.agents.severity);
  const hospital = useAgentBrain(s => s.agents.hospital);
  const fleet = useAgentBrain(s => s.agents.fleet);

  let step = 0;
  if (coord?.state === 'thinking') step = 1;
  if (severity?.state === 'busy') step = 2;
  if (severity?.state === 'completed') step = 3;
  if (hospital?.state === 'negotiating' || fleet?.state === 'negotiating') step = 4;
  if (hospital?.state === 'completed' && fleet?.state === 'completed') step = 5;
  if (coord?.state === 'completed') step = 6;

  return (
    <div className="absolute right-10 top-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col gap-6">
      <PipelineStep label="Input Detected" active={step === 1} completed={step > 1} />
      <PipelineStep label="Classify" active={step === 2} completed={step > 2} />
      <PipelineStep label="Severity Locked" active={step === 3} completed={step > 3} />
      <PipelineStep label="Negotiate" active={step === 4} completed={step > 4} />
      <PipelineStep label="Dispatch Ready" active={step === 5} completed={step > 5} />
      <PipelineStep label="Consensus Complete" active={step >= 6} completed={step >= 6} />
    </div>
  );
};

// Static layout for cinematic look
const initialNodes: Node[] = [
  { id: 'coord', type: 'neural', position: { x: 500, y: 150 }, data: {} },
  { id: 'severity', type: 'neural', position: { x: 200, y: 350 }, data: {} },
  { id: 'hospital', type: 'neural', position: { x: 400, y: 400 }, data: {} },
  { id: 'fleet', type: 'neural', position: { x: 700, y: 400 }, data: {} },
  { id: 'route', type: 'neural', position: { x: 900, y: 550 }, data: {} },
  { id: 'police', type: 'neural', position: { x: 100, y: 550 }, data: {} },
  { id: 'family', type: 'neural', position: { x: 300, y: 650 }, data: {} },
  { id: 'voice', type: 'neural', position: { x: 800, y: 150 }, data: {} },
  { id: 'analytics', type: 'neural', position: { x: 600, y: 650 }, data: {} },
  { id: 'offline', type: 'neural', position: { x: 200, y: 150 }, data: {} },
  { id: 'prediction', type: 'neural', position: { x: 800, y: 550 }, data: {} },
];

export const ExecutionFabric = () => {
  const wires = useAgentBrain((s) => s.wires);

  const edges: Edge[] = useMemo(() => {
    return wires.map((wire, i) => ({
      id: "e-" + wire.source + "-" + wire.target,
      source: wire.source,
      target: wire.target,
      type: 'energy',
      animated: false,
    }));
  }, [wires]);

  return (
    <div style={{ width: '100%', height: '100%', background: 'transparent' }} className="relative">
       {/* Ambient Overlay to make it cinematic */}
       <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t from-[rgba(2,5,18,1)] via-transparent to-[rgba(2,5,18,0.8)]" />
       
       <ReactFlow
         nodes={initialNodes}
         edges={edges}
         nodeTypes={nodeTypes}
         edgeTypes={edgeTypes}
         fitView
         proOptions={{ hideAttribution: true }}
         minZoom={0.5}
         maxZoom={2}
         nodesDraggable={false}
         nodesConnectable={false}
         elementsSelectable={false}
         className="bg-[#020512]"
       >
         <Background color="#1e1e4c" variant={BackgroundVariant.Dots} gap={30} size={1} />
       </ReactFlow>

       {/* Control UI overlay */}
       <div className="absolute top-10 left-10 z-20 pointer-events-none font-mono text-[10px] text-indigo-400">
         <div className="mb-1 uppercase tracking-[0.3em] text-white">Neural Negotiation Fabric</div>
         <div className="opacity-50">Node Pulse: Nominal</div>
         <div className="opacity-50">Wire Transfer: ~12ms</div>
       </div>

       {/* Decision Pipeline Sidebar */}
       <DecisionPipelineOverlay />
    </div>
  );
};
