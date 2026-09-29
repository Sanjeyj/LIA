import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { useTheme } from "../../contexts/ThemeContext";

interface LiquidOrbProps {
  isMobile?: boolean;
  reducedMotion?: boolean;
  mouseRef: React.RefObject<{ x: number; y: number; targetX: number; targetY: number }>;
  scrollRef: React.RefObject<{ scrollY: number; scrollRatio: number }>;
}

export function LiquidOrb({ isMobile = false, reducedMotion = false, mouseRef, scrollRef }: LiquidOrbProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  // Base geometry reference for procedural vertex noise calculation
  const baseGeometry = useMemo(() => {
    return new THREE.IcosahedronGeometry(1.6, isMobile ? 12 : 24);
  }, [isMobile]);

  // Clone geometry position attribute for animated vertex displacement
  const originalPositions = useMemo(() => {
    return baseGeometry.attributes.position.clone();
  }, [baseGeometry]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    // Reduced motion handling
    if (!reducedMotion) {
      // 1. Organic Vertex Deformation (Low-frequency smooth liquid morph)
      const geometry = meshRef.current.geometry;
      const positionAttr = geometry.attributes.position;
      const count = positionAttr.count;

      for (let i = 0; i < count; i++) {
        const u = originalPositions.getX(i);
        const v = originalPositions.getY(i);
        const w = originalPositions.getZ(i);

        // Calculate smooth organic liquid displacement using wave superposition
        const noise =
          Math.sin(u * 1.5 + time * 0.7) * 0.12 +
          Math.cos(v * 1.8 + time * 0.6) * 0.10 +
          Math.sin(w * 1.4 + time * 0.8) * 0.08;

        const factor = 1 + noise * 0.75;
        positionAttr.setXYZ(i, u * factor, v * factor, w * factor);
      }

      positionAttr.needsUpdate = true;
      geometry.computeVertexNormals();

      // 2. Slow Organic Rotation + Mouse Tilt
      meshRef.current.rotation.y += 0.003 + (mouseRef.current ? mouseRef.current.x * 0.02 : 0);
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.12 - (mouseRef.current ? mouseRef.current.y * 0.35 : 0);

      // 3. Floating Vertical Breathing
      const floatY = Math.sin(time * 0.8) * 0.12;

      // 4. Mouse Motion Tracking (Smooth & Responsive)
      if (mouseRef.current) {
        const mouse = mouseRef.current;
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;

        meshRef.current.position.x = mouse.x * 1.35;
        meshRef.current.position.y = floatY + mouse.y * 0.95;
        meshRef.current.rotation.z = mouse.x * 0.28;
      } else {
        meshRef.current.position.y = floatY;
      }

      // 5. Scroll Linked Scale & Fade
      if (scrollRef.current) {
        const ratio = scrollRef.current.scrollRatio;
        const targetScale = Math.max(0.65, 1 - ratio * 0.35);
        meshRef.current.scale.setScalar(targetScale);

        if (materialRef.current) {
          materialRef.current.opacity = Math.max(0, 1 - ratio * 1.2);
        }
      }
    }
  });

  return (
    <mesh ref={meshRef} geometry={baseGeometry} castShadow={false} receiveShadow={false}>
      <meshPhysicalMaterial
        ref={materialRef}
        color="#FFFFFF"
        transmission={0.96}
        opacity={1}
        transparent
        roughness={0.12}
        metalness={0.02}
        ior={1.48}
        thickness={1.2}
        specularColor={new THREE.Color("#D7B65A")}
        specularIntensity={isDark ? 2.2 : 1.2}
        attenuationColor={new THREE.Color(isDark ? "#174EA6" : "#EAF1FF")}
        attenuationDistance={2.5}
        clearcoat={0.6}
        clearcoatRoughness={0.06}
      />
    </mesh>
  );
}
