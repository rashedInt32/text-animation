"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useSearchParams } from "next/navigation";
import Particles from "./particles";
import Text from "./text";

export default function ScenePage() {
  const searchParams = useSearchParams();
  const text = searchParams.get("text") || "";

  return (
    <>
      <div className="w-full aspect-video relative">
        <div className="absolute top-0 left-0 w-full h-full  flex items-center justify-center z-10">
          <Text />
        </div>

        <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
          <Particles />
        </Canvas>
      </div>
    </>
  );
}
