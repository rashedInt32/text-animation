"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

const NUM_DRONES = 8;
const COLORS = [
  "rgba(255,255,255,0.9)", // White
  "rgba(0,255,255,0.8)", // Cyan
  "rgba(255,200,255,0.85)", // Pink
  "rgba(255,255,150,0.85)", // Warm yellow
  "rgba(150,255,255,0.75)", // Soft teal
];

export default function DroneSwarm() {
  const droneRefs = useRef<HTMLDivElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { width, height } = container.getBoundingClientRect();

    droneRefs.current = droneRefs.current.slice(0, NUM_DRONES);

    droneRefs.current.forEach((drone, i) => {
      const launchDrone = () => {
        const baseY = height / 2;
        const yStart = baseY - 20 + Math.random() * 40;

        const cp1 = {
          x: width * 0.33,
          y: yStart - 50 + Math.random() * 100,
        };
        const cp2 = {
          x: width * 0.66,
          y: yStart - 50 + Math.random() * 100,
        };
        const end = {
          x: width + 100,
          y: yStart + Math.random() * 30 - 15,
        };

        gsap.set(drone, {
          x: -100,
          y: yStart,
          opacity: 0,
        });

        gsap.to(drone, {
          motionPath: {
            path: [
              { x: 0, y: yStart },
              { x: cp1.x, y: cp1.y },
              { x: cp2.x, y: cp2.y },
              { x: end.x, y: end.y },
            ],
            curviness: 1.25,
            autoRotate: false,
          },
          opacity: 1,
          duration: 6 + Math.random() * 2,
          ease: "power2.inOut",
          onComplete: () => {
            setTimeout(launchDrone, 2000 + Math.random() * 3000);
          },
        });
      };

      setTimeout(launchDrone, i * 400);
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-30"
    >
      {Array.from({ length: NUM_DRONES }).map((_, i) => {
        const color = COLORS[i % COLORS.length];
        return (
          <div
            key={i}
            ref={(el) => {
              if (el) droneRefs.current[i] = el;
            }}
            className="absolute w-4 h-4 rounded-full opacity-0"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 24px 8px ${color}`,
              filter: "blur(1px)",
            }}
          />
        );
      })}
    </div>
  );
}
