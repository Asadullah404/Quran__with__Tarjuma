import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GeometricProps {
  audioData?: Uint8Array;
  isPlaying: boolean;
}

function IslamicPattern({ audioData, isPlaying }: GeometricProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.1;
      
      // Audio reactive scaling
      if (audioData && isPlaying && materialRef.current) {
        const average = audioData.reduce((sum, value) => sum + value, 0) / audioData.length;
        const intensity = average / 255;
        
        groupRef.current.scale.setScalar(0.8 + intensity * 0.4);
        materialRef.current.opacity = 0.6 + intensity * 0.4;
      }
    }
  });

  // Create Islamic geometric pattern
  const shapes = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    const radius = 3;
    
    shapes.push(
      <mesh
        key={i}
        position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
        rotation={[0, 0, angle]}
      >
        <octahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial
          ref={materialRef}
          color="#eab308"
          transparent
          opacity={0.8}
          wireframe
        />
      </mesh>
    );
  }

  return (
    <group ref={groupRef}>
      {shapes}
      {/* Central star */}
      <mesh>
        <dodecahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.6} wireframe />
      </mesh>
    </group>
  );
}

export function GeometricVisualizer({ audioData, isPlaying }: GeometricProps) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <IslamicPattern audioData={audioData} isPlaying={isPlaying} />
      </Canvas>
    </div>
  );
}