"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

export default function TextInputAnimation({ input }: { input: string }) {
  const circleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      gsap.to(textRef.current, {
        y: "-=5",
        repeat: -1,
        yoyo: true,
        duration: 1,
        ease: "sine.inOut",
      });
    }
    if (circleRef.current && containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();

      const baseY = (2 / 3) * height;
      const peakY = (1 / 3) * height;

      gsap.set(circleRef.current, {
        x: 0,
        y: baseY,
      });

      gsap.to(circleRef.current, {
        duration: 8,
        repeat: -1,
        repeatDelay: 1,
        ease: "power1",
        motionPath: {
          path: [
            { x: 0, y: baseY },
            { x: width / 2, y: peakY },
            { x: width - circleRef.current.clientWidth, y: baseY },
          ],
          curviness: 1.5,
          autoRotate: false,
        },
      });
      gsap.to(iconRef.current, {
        duration: 8,
        rotation: 70,
        repeat: -1,
        repeatDelay: 1,
        ease: "power1.inOut",
      });
    }
  }, []);

  return (
    <div ref={containerRef} className="absolute top-0 left-0 w-full h-full">
      <div ref={circleRef} className="absolute h-16  rounded-full">
        <div className="px-6 py-1 rounded-full text-white border-4 border-white ">
          <p ref={textRef} className="font-bold text-xl">
            {input}
          </p>
        </div>
        <Image
          ref={iconRef}
          src="/icon.svg"
          alt="Icon"
          width={100}
          height={50}
          className="inline-block ml-2 rotate-12"
        />
      </div>
    </div>
  );
}
