import React, { useState, useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface CountUpProps {
  value: string;
  duration?: number;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  value,
  duration = 2,
  className = "",
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(() => (shouldReduceMotion ? value : "0"));

  const match = value.match(/^([^\d]*)([\d,]+)([^\d]*)$/);
  const prefix = match ? match[1] : "";
  const numericStr = match ? match[2].replace(/,/g, "") : "0";
  const targetNumber = parseInt(numericStr, 10) || 0;
  const suffix = match ? match[3] : "";
  const hasComma = match ? match[2].includes(",") : false;

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    if (!isInView || targetNumber === 0) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      const currentVal = Math.floor(easedProgress * targetNumber);

      const formattedVal = hasComma
        ? currentVal.toLocaleString("en-US")
        : currentVal.toString();

      setDisplayValue(`${prefix}${formattedVal}${suffix}`);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateCount);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrameId = requestAnimationFrame(animateCount);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, targetNumber, duration, value, prefix, suffix, hasComma, shouldReduceMotion]);

  return (
    <span ref={ref} className={className}>
      {shouldReduceMotion ? value : displayValue}
    </span>
  );
};
