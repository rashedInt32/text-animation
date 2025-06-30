"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Particles from "./particles";

export default function ScenePage() {
  const searchParams = useSearchParams();
  const text = searchParams.get("text") || "";

  return (
    <>
      <div className="w-full aspect-video relative">
        <div className="absolute top-0 left-0 w-full h-full bg-red-400 opacity-50 flex items-center justify-center z-10"></div>

        <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
          <Particles />
        </Canvas>
      </div>
    </>
  );
}
