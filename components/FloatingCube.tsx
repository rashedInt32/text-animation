// components/FloatingCube.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function FloatingCube() {
  const cubeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cubeRef.current) {
      gsap.to(cubeRef.current, {
        y: -10,
        rotation: 180,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        duration: 3,
      });
    }
  }, []);

  return (
    <div
      ref={cubeRef}
      className="absolute bottom-4 right-4 w-12 h-12 border-2 border-indigo-600 shadow-lg rotate-45 rounded-sm"
    />
  );
}
