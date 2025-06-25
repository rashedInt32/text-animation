"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const SceneRoom = dynamic(() => import("../../components/SceneRoom"), {
  ssr: false,
});

export default function ScenePage() {
  const searchParams = useSearchParams();
  const text = searchParams.get("text") || "";

  return (
    <div className="w-screen h-screen ">
      <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
        <Suspense fallback={null}>
          <SceneRoom inputText={text} />
        </Suspense>
      </Canvas>
    </div>
  );
}
