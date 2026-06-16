"use client";

// Count-up animation — animates a number when scrolled into view
import { useEffect, useState, useRef } from "react";

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  duration?: number;
  startInView?: boolean;
}

export const AnimatedCounter = ({
  end,
  suffix = "",
  duration = 2,
  startInView = true,
}: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState(() => 0);

  const hasAnimatedRef = useRef(false);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset when end value changes
    hasAnimatedRef.current = false;
    // Avoid setState-on-effect-body warning; initial render shows 0 anyway.




    // Clear any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Start animation if in view and not already animated
    if (startInView && !hasAnimatedRef.current) {
      startTimeRef.current = performance.now();
      const durationMs = duration * 1000;


      const animate = (currentTime: number) => {
        if (!startTimeRef.current) return;

        const elapsed = currentTime - startTimeRef.current;
        const progress = Math.min(elapsed / durationMs, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(easeOutQuart * end);

        setDisplayValue(currentValue);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          hasAnimatedRef.current = true;
          setDisplayValue(end);
        }
      };


      animationRef.current = requestAnimationFrame(animate);
    }

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [end, duration, startInView]);


  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
};
