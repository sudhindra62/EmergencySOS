import React from "react";
import { Handle, Position } from "@xyflow/react";
import { motion } from "motion/react";
import { AgentAvatarEngine } from "./AgentAvatarEngine";
import { useAgentBrain } from "./AgentBrain";

export const NeuralNode = ({ id, data }: { id: string, data: any }) => {
  const agent = useAgentBrain((s) => s.agents[id]);
  
  if (!agent) return null;

  return (
    <div className="relative flex flex-col items-center justify-center p-2 isolate group">
      {/* Node Inputs/Outputs for React Flow */}
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      
      {/* Halo & Energy Ring */}
      <motion.div 
         className="absolute inset-0 rounded-full blur-[20px] -z-10"
         animate={{
           opacity: agent.state === 'idle' ? 0.2 : (agent.state === 'failed' ? 0 : 0.6),
           scale: agent.state === 'thinking' || agent.state === 'negotiating' ? [1, 1.2, 1] : 1,
         }}
         transition={{ repeat: Infinity, duration: 2 }}
         style={{ backgroundColor: agent.color }}
      />
      
      {/* 3D Agent Core Avatar */}
      <div className="rounded-full overflow-hidden bg-black/50 border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <AgentAvatarEngine color={agent.color} state={agent.state} size={100} />
      </div>

      {/* Label and Memory Context */}
      <div className="mt-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl text-center border border-white/10 shadow-xl pointer-events-none min-w-[120px]">
        <h3 className="text-white text-xs font-black uppercase tracking-widest">{agent.name}</h3>
        <p className="text-[9px] uppercase tracking-[0.2em] font-medium" style={{ color: agent.color }}>
          {agent.state}
        </p>
        
        {/* Dynamic Memory Display */}
        {agent.lastDecision !== "None" && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 pt-2 border-t border-white/10"
          >
            <div className="text-[10px] text-slate-300 font-mono font-bold">
              {agent.lastDecision}
            </div>
            <div className="text-[8px] text-slate-500 flex justify-between mt-1">
              <span>CONF: {agent.confidence}%</span>
              <span>{agent.latency}ms</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Micro-Particles Swarm (DOM based for simplicity) */}
      {agent.state === 'busy' || agent.state === 'executing' ? (
        <MicroParticleSwarm color={agent.color} count={12} />
      ) : null}
    </div>
  );
};

const MicroParticleSwarm = ({ color, count }: { color: string, count: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
           key={i}
           className="absolute w-1 h-1 rounded-full z-20 shadow-glow"
           style={{ backgroundColor: color, top: '50%', left: '50%', boxShadow: `0 0 5px ${color}` }}
           initial={{ x: 0, y: 0, opacity: 0 }}
           animate={{
             x: (Math.random() - 0.5) * 150,
             y: (Math.random() - 0.5) * 150,
             opacity: [0, 1, 0]
           }}
           transition={{
             duration: 1 + Math.random(),
             repeat: Infinity,
             delay: Math.random()
           }}
        />
      ))}
    </>
  );
};
