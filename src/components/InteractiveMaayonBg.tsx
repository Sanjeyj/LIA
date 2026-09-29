import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface InteractiveMaayonBgProps {
  className?: string;
  opacity?: number;
  scale?: number;
}

export const InteractiveMaayonBg: React.FC<InteractiveMaayonBgProps> = ({
  className = "",
  opacity = 0.48,
  scale = 1.08,
}) => {
  const [, setMousePos] = useState({ x: 0, y: 0 });

  // Smooth springs for fluid mouse parallax movement
  const springConfig = { stiffness: 90, damping: 16, mass: 0.6 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setMousePos({ x, y });
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Transform springs into smooth 3D parallax offsets
  const translateX = useTransform(mouseX, [-1, 1], [-60, 60]);
  const translateY = useTransform(mouseY, [-1, 1], [-45, 45]);
  const rotateY = useTransform(mouseX, [-1, 1], [-18, 18]);
  const rotateX = useTransform(mouseY, [-1, 1], [15, -15]);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-0 ${className}`}
    >
      <motion.div
        style={{
          x: translateX,
          y: translateY,
          rotateX,
          rotateY,
          perspective: 1200,
        }}
        className="relative w-full max-w-6xl h-auto flex items-center justify-center transition-opacity duration-500"
      >
        {/* Continuous Animated Breathing & Floating Wrapper */}
        <motion.div
          animate={{
            y: [0, -18, 0, 14, 0],
            rotateZ: [0, 1.8, 0, -1.8, 0],
            scale: [1, 1.03, 1, 0.98, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-full flex items-center justify-center"
        >
          {/* Pulsing Specular Light Rays & Radial Aura (Gold & Electric Cyan Radiance) */}
          <motion.div
            animate={{
              opacity: [0.5, 0.85, 0.5],
              scale: [0.95, 1.08, 0.95],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-[850px] h-[450px] bg-gradient-to-r from-[#D7B65A]/45 via-[#00C4CC]/40 to-[#174EA6]/45 rounded-full blur-[110px] opacity-75 dark:opacity-65 pointer-events-none"
          />

          <motion.div
            animate={{
              opacity: [0.4, 0.75, 0.4],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-[600px] h-[320px] bg-gradient-to-tr from-[#00A8B5]/35 via-[#F3E5AB]/50 to-[#0B1938]/40 rounded-full blur-3xl opacity-70 pointer-events-none"
          />

          {/* Glowing MAAYON 3D Banner Logo Graphic Container */}
          <div className="relative group w-[94%] max-w-[1020px] rounded-3xl overflow-hidden p-1.5">
            
            {/* Animated Shining Metallic Filter Image */}
            <motion.img
              animate={{
                filter: [
                  "drop-shadow(0 0 25px rgba(215,182,90,0.4)) brightness(1)",
                  "drop-shadow(0 0 50px rgba(0,196,204,0.7)) brightness(1.25)",
                  "drop-shadow(0 0 25px rgba(215,182,90,0.4)) brightness(1)",
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              src="/assets/logos/maayon-banner.jpg"
              alt="MAAYON official 3D logo animated glowing background motion"
              className="w-full h-auto object-contain rounded-2xl transition-all duration-500"
              style={{
                opacity: opacity,
                transform: `scale(${scale})`,
              }}
            />

            {/* Specular Light Sheen 1: Primary High-Intensity Golden White Beam Sweep */}
            <motion.div
              animate={{
                x: ["-150%", "250%"],
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: "easeInOut",
              }}
              className="absolute inset-0 w-2/3 h-full bg-gradient-to-r from-transparent via-white/60 via-[#F3E5AB]/70 to-transparent skew-x-[-30deg] pointer-events-none"
            />

            {/* Specular Light Sheen 2: Secondary Cyan/Electric Blue Flare Sweep */}
            <motion.div
              animate={{
                x: ["-180%", "280%"],
              }}
              transition={{
                duration: 3.8,
                delay: 1.2,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut",
              }}
              className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-[#00C4CC]/50 via-white/80 to-transparent skew-x-[-25deg] pointer-events-none"
            />

            {/* Corner Diamond Sparkles & Light Sheen Rings */}
            <div aria-hidden="true" className="absolute top-1/4 left-1/3 w-2.5 h-2.5 bg-white rounded-full blur-[1px] animate-ping opacity-75" />
            <div aria-hidden="true" className="absolute top-1/3 right-1/4 w-3 h-3 bg-[#F3E5AB] rounded-full blur-[1px] animate-pulse opacity-90" />
            <div aria-hidden="true" className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-[#00C4CC] rounded-full blur-[1px] animate-ping opacity-80" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
