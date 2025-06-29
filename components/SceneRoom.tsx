// ---- /components/SceneRoom.tsx (Immersive Rain Room with Expanded Particles) ----
"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

export default function SceneRoom({ inputText }: { inputText: string }) {
  const { camera } = useThree();
  const particleRef = useRef<THREE.Points>(null);
  const roomRef = useRef<THREE.Mesh>(null);

  // Generate dense multicolored falling particles with wider x-range
  const particles = useMemo(() => {
    const count = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    const colorPool = ["#ff007f", "#00ffff", "#ffff00", "#00ff00", "#ff00ff"];

    for (let i = 0; i < count; i++) {
      const x = THREE.MathUtils.randFloatSpread(30); // Increased from 20 to 30
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

  // Particle animation (kept with useFrame for performance)
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

  // GSAP Animations
  useEffect(() => {
    // Create a target vector for the camera to look at
    const lookAtTarget = new THREE.Vector3(-5, 2.5, 0); // Start looking slightly left

    // Camera animation: Left-to-right pan with dynamic lookAt
    gsap.to(camera.position, {
      x: 5, // Move from x = 0 to x = 5 (right)
      duration: 4,
      ease: "sine.inOut",
      onUpdate: () => {
        // Update lookAt target to move with camera, slightly ahead
        lookAtTarget.x = camera.position.x + 2; // Look slightly ahead of camera's x position
        camera.lookAt(lookAtTarget);
      },
    });

    // Room animation: Subtle rotation for immersive effect
    if (roomRef.current) {
      gsap.to(roomRef.current.rotation, {
        y: Math.PI * 0.1, // Small rotation
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }
  }, [camera]);

  // Center camera initially
  camera.position.set(0, 2.5, 10);
  camera.lookAt(-5, 2.5, 0); // Initial lookAt slightly left

  return (
    <>
      {/* Full 6-Sided Room */}
      <RoomBox ref={roomRef} />

      {/* Rain Particles */}
      <primitive ref={particleRef} object={particles} />

      {/* Lighting */}
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 5, 5]} intensity={1.5} />
    </>
  );
}

function RoomBox({ ...props }) {
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: "black",
    side: THREE.BackSide,
  });

  return (
    <mesh {...props} position={[0, 2.5, 0]}>
      <boxGeometry args={[20, 10, 10]} />
      <primitive object={wallMaterial} attach="material" />
    </mesh>
  );
}
