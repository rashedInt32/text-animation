"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export default function Text() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const split = new SplitText(textRef.current, { type: "chars, words" });
      gsap.from(split.chars, {
        x: 100,
        opacity: 0,
        stagger: 0.05,
        duration: 1,
        ease: "power4.out",
      });
    }
  }, []);

  return (
    <div
      ref={textRef}
      className="text-white text-[40px] text-uppercase font-bold"
    >
      Hello, SplitText!
    </div>
  );
}
