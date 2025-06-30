"use client";

import { useThree } from "@react-three/fiber";
import Mesh from "./Mesh";
import ParticlesComponent from "./Particles-component";

export default function Particles() {
  const { camera } = useThree();

  // Center camera initially
  camera.position.set(0, 2.5, 10);
  camera.lookAt(0, 2.5, 0);

  return (
    <>
      <Mesh position={[0, 2.5, 0]} />
      <ParticlesComponent count={3000} rangeX={30} rangeZ={10} />

      <ambientLight intensity={0.8} />
      <pointLight position={[0, 5, 5]} intensity={1.5} />
    </>
  );
}
