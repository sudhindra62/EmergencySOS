import React from 'react';
import { BaseEdge, getBezierPath, EdgeProps } from '@xyflow/react';
import { motion } from 'motion/react';
import { useAgentBrain } from './AgentBrain';

export const EnergyWire = (props: EdgeProps) => {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, source, target } = props;
  
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const wireState = useAgentBrain((s) => 
     s.wires.find(w => w.source === source && w.target === target)?.state || "idle"
  );
  
  const sourceAgent = useAgentBrain((s) => s.agents[source]);
  const color = sourceAgent?.color || "#fff";

  let strokeWidth = 2;
  let strokeOpacity = 0.2;
  let animateFlow = false;
  let flowDuration = 2;
  let isDashed = false;
  
  switch(wireState) {
    case 'idle':
      strokeWidth = 1;
      strokeOpacity = 0.1;
      break;
    case 'flow':
      strokeWidth = 3;
      strokeOpacity = 0.5;
      animateFlow = true;
      flowDuration = 2;
      break;
    case 'thinking':
      strokeWidth = 2;
      strokeOpacity = 0.4;
      isDashed = true;
      animateFlow = true;
      flowDuration = 4;
      break;
    case 'negotiation':
      strokeWidth = 4;
      strokeOpacity = 0.8;
      animateFlow = true;
      flowDuration = 1; // fast
      isDashed = true;
      break;
    case 'execution':
      strokeWidth = 6;
      strokeOpacity = 1;
      animateFlow = true;
      flowDuration = 0.5; // very fast burst
      break;
    case 'failed':
      strokeWidth = 2;
      strokeOpacity = 0.5;
      isDashed = true; // broken
      break;
  }

  const dashArray = isDashed ? (wireState === 'failed' ? "5, 15" : "10, 10") : "none";

  return (
    <>
      {/* Background glow trail */}
      <BaseEdge 
         path={edgePath} 
         className="react-flow__edge-path" 
         style={{ 
           stroke: wireState === 'failed' ? '#ef4444' : color, 
           strokeWidth: strokeWidth * 3, 
           strokeOpacity: strokeOpacity * 0.3,
           filter: 'blur(5px)',
         }} 
      />
      {/* Main Energy String */}
      <motion.path
        d={edgePath}
        fill="none"
        stroke={wireState === 'failed' ? '#ef4444' : color}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        style={{ strokeOpacity }}
        animate={animateFlow && !isDashed ? { strokeDasharray: ["0, 1000", "1000, 0"] } : {}}
        transition={{ duration: flowDuration, repeat: Infinity, ease: 'linear' }}
      />
      {/* Dashed moving line */}
      {isDashed && wireState !== 'failed' && (
         <motion.path
           d={edgePath}
           fill="none"
           stroke={color}
           strokeWidth={strokeWidth}
           strokeDasharray="15, 15"
           animate={{ strokeDashoffset: [0, -30] }}
           transition={{ duration: flowDuration, repeat: Infinity, ease: 'linear' }}
           style={{ strokeOpacity: 1 }}
         />
      )}
      
      {/* Execution Energy Ball running along the path */}
      {wireState === 'execution' && (
        <circle r="4" fill="#fff" style={{ filter: 'blur(2px)' }}>
          <animateMotion 
             dur="0.5s" 
             repeatCount="indefinite" 
             path={edgePath} 
          />
        </circle>
      )}

      {/* Swarm particles during thinking/negotiation */}
      {(wireState === 'thinking' || wireState === 'negotiation') && (
         <>
           {Array.from({ length: 5 }).map((_, i) => (
              <circle key={i} r="2" fill={color} style={{ filter: 'blur(1px)', opacity: 0.8 }}>
                 <animateMotion 
                   dur={`${1 + Math.random()}s`} 
                   begin={`${Math.random()}s`}
                   repeatCount="indefinite" 
                   path={edgePath} 
                 />
              </circle>
           ))}
         </>
      )}
    </>
  );
};
