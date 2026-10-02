import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FloatingParticlesProps {
  count?: number;
  reducedMotion?: boolean;
  mouseRef: React.RefObject<{ x: number; y: number; targetX: number; targetY: number }>;
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function FloatingParticles({ count = 35, reducedMotion = false, mouseRef }: FloatingParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (pseudoRandom(i * 3 + 1) - 0.5) * 12;
      pos[i * 3 + 1] = (pseudoRandom(i * 3 + 2) - 0.5) * 10;
      pos[i * 3 + 2] = (pseudoRandom(i * 3 + 3) - 0.5) * 8;
    }

    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current || reducedMotion) return;

    // Slow organic rotation & floating movement
    pointsRef.current.rotation.y += delta * 0.03;
    pointsRef.current.rotation.x += delta * 0.015;

    // Subtle response to cursor
    if (mouseRef.current) {
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      pointsRef.current.position.x = mouse.x * 0.3;
      pointsRef.current.position.y = mouse.y * 0.3;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#E8D89A"
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
