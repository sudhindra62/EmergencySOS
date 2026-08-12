import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AvatarProps {
  color: string;
  state: string;
  size?: number;
}

const CoreSphere = ({ color, state }: { color: string, state: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((stateObj) => {
    if (!meshRef.current) return;
    
    // Rotation speed based on state
    let speed = 1;
    if (state === 'busy' || state === 'executing') speed = 5;
    if (state === 'negotiating') speed = 3;
    if (state === 'failed') speed = 0;
    
    meshRef.current.rotation.y += 0.01 * speed;
    meshRef.current.rotation.z += 0.005 * speed;
    
    const scale = state === 'thinking' || state === 'negotiating'
       ? 1 + Math.sin(stateObj.clock.elapsedTime * 4) * 0.1
       : 1;
    meshRef.current.scale.set(scale, scale, scale);
  });

  const materialColor = state === 'failed' ? '#333333' : color;
  const wireframe = state === 'negotiating' || state === 'thinking';

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial 
         color={materialColor} 
         wireframe={wireframe} 
         emissive={materialColor}
         emissiveIntensity={state === 'completed' ? 1.5 : (state === 'idle' ? 0.2 : 0.8)}
         transparent
         opacity={0.9}
      />
    </mesh>
  );
};

export const AgentAvatarEngine = ({ color, state, size = 150 }: AvatarProps) => {
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <CoreSphere color={color} state={state} />
      </Canvas>
    </div>
  );
};
