"use client";

import { Canvas } from "@react-three/fiber";
import { useSearchParams } from "next/navigation";
import Particles from "./particles";
import TextInputAnimation from "./TextInputAnimation";
import FloatingCube from "./FloatingCube";
import MultiComet from "./MultiComet";
import DroneSwarm from "./Droneswarn";

export default function AnimateView() {
  const searchParams = useSearchParams();
  const textInput = searchParams.get("text") || "";

  return (
    <>
      <div className="w-full aspect-video relative">
        <div className="absolute top-0 left-0 w-full h-full  flex items-center justify-center z-10">
          <TextInputAnimation input={textInput} />
          <FloatingCube />
          <MultiComet />
          <DroneSwarm />
        </div>

        <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
          <Particles />
        </Canvas>
      </div>
    </>
  );
}
