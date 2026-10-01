import React from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}

export const SectionReveal: React.FC<SectionRevealProps> = ({
  children,
  className = "",
  delay = 0,
  id,
}) => {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 18, scale: 0.99 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ willChange: "transform, opacity" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
