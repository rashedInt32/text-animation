"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const SceneRoom = dynamic(() => import("./SceneRoom"), {
  ssr: false,
});

export default function ScenePage() {
  const searchParams = useSearchParams();
  const text = searchParams.get("text") || "";

  return (
    <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
      <SceneRoom inputText={text} />
    </Canvas>
  );
}
