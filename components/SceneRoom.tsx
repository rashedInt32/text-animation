// ---- /components/SceneRoom.tsx (Immersive Rain Room Inspired by GIF) ----
"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

export default function SceneRoom({ inputText }: { inputText: string }) {
  const { camera } = useThree();
  const particleRef = useRef<THREE.Points>(null);

  // Generate dense multicolored falling particles
  const particles = useMemo(() => {
    const count = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    const colorPool = ["#ff007f", "#00ffff", "#ffff00", "#00ff00", "#ff00ff"];

    for (let i = 0; i < count; i++) {
      const x = THREE.MathUtils.randFloatSpread(20);
      const y = Math.random() * 10;
      const z = THREE.MathUtils.randFloatSpread(10);
      positions.set([x, y, z], i * 3);
      velocities[i] = 0.01 + Math.random() * 0.02;

      const hex = new THREE.Color(
        colorPool[Math.floor(Math.random() * colorPool.length)],
      );
      colors.set([hex.r, hex.g, hex.b], i * 3);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 1));

    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });

    return new THREE.Points(geometry, material);
  }, []);

  useFrame(() => {
    const positions = particleRef.current!.geometry.attributes
      .position as THREE.BufferAttribute;
    const velocities = particleRef.current!.geometry.attributes
      .velocity as THREE.BufferAttribute;

    for (let i = 0; i < positions.count; i++) {
      let y = positions.getY(i);
      y -= velocities.getX(i);
      if (y < -1) y = 10;
      positions.setY(i, y);
    }

    positions.needsUpdate = true;
  });

  // Center camera
  camera.position.set(0, 2.5, 10);
  camera.lookAt(0, 2.5, 0);

  return (
    <>
      {/* Full 6-Sided Room */}
      <RoomBox />

      {/* Rain Particles */}
      <primitive ref={particleRef} object={particles} />

      {/* Lighting */}
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 5, 5]} intensity={1.5} />
    </>
  );
}

function RoomBox() {
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: "black",
    side: THREE.BackSide,
  });
  return (
    <mesh position={[0, 2.5, 0]}>
      <boxGeometry args={[20, 10, 10]} />
      <primitive object={wallMaterial} attach="material" />
    </mesh>
  );
}
