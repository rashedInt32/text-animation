"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const NUM_COMETS = 4;

export default function MultiComet() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cometRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    cometRefs.current = cometRefs.current.slice(0, NUM_COMETS);

    cometRefs.current.forEach((comet, index) => {
      const animateComet = () => {
        const xTarget = -400 - Math.random() * 200;
        const yTarget = -300 - Math.random() * 100;
        const duration = 4 + Math.random() * 2;

        const tl = gsap.timeline({
          onComplete: () => {
            setTimeout(animateComet, 2000 + Math.random() * 3000);
          },
        });

        tl.set(comet, {
          x: 0,
          y: 0,
          opacity: 0,
        });

        tl.to(comet, {
          opacity: 1,
          duration: 0.5,
          ease: "power1.in",
        });

        tl.to(
          comet,
          {
            x: xTarget,
            y: yTarget,
            duration: duration,
            ease: "power2.out",
          },
          "<",
        ); // start movement at same time as fade in

        tl.to(
          comet,
          {
            opacity: 0,
            duration: 0.8,
            ease: "power1.out",
          },
          `-=${duration * 0.3}`,
        ); // start fading out slightly before end
      };

      animateComet();
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute top-0 left-0 w-full h-full z-20"
    >
      {Array.from({ length: NUM_COMETS }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) cometRefs.current[i] = el;
          }}
          className="absolute bottom-0 right-0 h-1 bg-gradient-to-l from-white to-transparent opacity-0 blur-sm"
          style={{ transform: "rotate(-45deg)", width: "30rem" }}
        />
      ))}
    </div>
  );
}
