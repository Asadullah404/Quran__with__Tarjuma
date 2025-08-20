import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface StarfieldProps {
  audioData?: Uint8Array;
  isPlaying: boolean;
}

function Stars({ audioData, isPlaying }: StarfieldProps) {
  const ref = useRef<THREE.Points>(null);
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(5000 * 3);
    const colors = new Float32Array(5000 * 3);
    
    for (let i = 0; i < 5000; i++) {
      // Create sphere distribution
      const radius = Math.random() * 25 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Islamic green to gold gradient
      const baseColor = new THREE.Color().setHSL(0.25 + Math.random() * 0.1, 0.7, 0.6);
      colors[i * 3] = baseColor.r;
      colors[i * 3 + 1] = baseColor.g;
      colors[i * 3 + 2] = baseColor.b;
    }
    
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      // Gentle rotation for spiritual feeling
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      
      // Audio reactive brightness
      if (audioData && isPlaying) {
        const average = audioData.reduce((sum, value) => sum + value, 0) / audioData.length;
        const intensity = average / 255;
        
        if (ref.current.material) {
          (ref.current.material as any).size = 2 + intensity * 3;
          (ref.current.material as any).opacity = 0.6 + intensity * 0.4;
        }
      }
    }
  });

  return (
    <group>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#22c55e"
          size={2}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

export function StarfieldVisualizer({ audioData, isPlaying }: StarfieldProps) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <fog attach="fog" args={['#001122', 15, 30]} />
        <Stars audioData={audioData} isPlaying={isPlaying} />
      </Canvas>
    </div>
  );
}