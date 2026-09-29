import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useSceneInteraction } from "./useSceneInteraction";
import { SceneLighting } from "./SceneLighting";
import { LiquidOrb } from "./LiquidOrb";
import { FloatingParticles } from "./FloatingParticles";
import { WebGLFallback } from "./WebGLFallback";

export function LiquidGlassSceneContent() {
  const { mouseRef, scrollRef, reducedMotion, isMobile } = useSceneInteraction();

  return (
    <>
      <SceneLighting />
      <LiquidOrb
        isMobile={isMobile}
        reducedMotion={reducedMotion}
        mouseRef={mouseRef}
        scrollRef={scrollRef}
      />
      <FloatingParticles
        count={isMobile ? 16 : 36}
        reducedMotion={reducedMotion}
        mouseRef={mouseRef}
      />
    </>
  );
}

export function LiquidGlassScene() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    >
      <WebGLFallback>
        <Suspense fallback={null}>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            dpr={[1, typeof window !== "undefined" && window.innerWidth <= 768 ? 1.25 : 2]}
            gl={{
              alpha: true,
              antialias: true,
              powerPreference: "high-performance",
            }}
            className="w-full h-full"
          >
            <LiquidGlassSceneContent />
          </Canvas>
        </Suspense>
      </WebGLFallback>
    </div>
  );
}

export default LiquidGlassScene;
