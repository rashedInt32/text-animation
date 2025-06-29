// ---- /components/SceneRoom.tsx (Immersive Rain Room with Closer Text and 5 Animations) ----
"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { Text } from "@react-three/drei";

export default function SceneRoom({ inputText }: { inputText: string }) {
  const { camera } = useThree();
  const particleRef = useRef<THREE.Points>(null);
  const roomRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Generate dense multicolored falling particles with wider x-range
  const particles = useMemo(() => {
    const count = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    const colorPool = ["#ff007f", "#00ffff", "#ffff00", "#00ff00", "#ff00ff"];

    for (let i = 0; i < count; i++) {
      const x = THREE.MathUtils.randFloatSpread(30);
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
    // 1. Camera animation: Left-to-right pan with dynamic lookAt
    const lookAtTarget = new THREE.Vector3(-5, 2.5, 0);
    gsap.to(camera.position, {
      x: 5,
      duration: 4,
      ease: "sine.inOut",
      onUpdate: () => {
        lookAtTarget.x = camera.position.x + 2;
        camera.lookAt(lookAtTarget);
      },
    });

    // 2. Room animation: Subtle rotation
    if (roomRef.current) {
      gsap.to(roomRef.current.rotation, {
        y: Math.PI * 0.1,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }

    // 3 & 4 & 5. Text animations: Parabolic path + typewriter effect + character rotation
    if (textRef.current) {
      // 3. Parabolic path: x from -5 to 5, y rises to 5 then falls to 4
      const pathTl = gsap.timeline();
      pathTl.to(
        textRef.current.position,
        {
          x: 5,
          duration: 4,
          ease: "sine.inOut",
        },
        0,
      );
      pathTl.to(
        textRef.current.position,
        {
          y: 5,
          duration: 2,
          ease: "power2.out",
        },
        0,
      );
      pathTl.to(
        textRef.current.position,
        {
          y: 4,
          duration: 2,
          ease: "power2.in",
        },
        2,
      );

      // 4. Typewriter effect + 5. Character rotation
      const chars = textRef.current.children as THREE.Mesh[];
      chars.forEach((char, i) => {
        // Typewriter: Fade in and slide down
        gsap.from(char, {
          opacity: 0,
          y: 1,
          duration: 0.5,
          delay: i * 0.1,
          ease: "power2.out",
        });
        // Character rotation: Subtle y-axis wobble
        gsap.to(char.rotation, {
          y: Math.PI * 0.2,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.05,
        });
      });
    }

    // 6. Light animation: Flicker effect
    if (lightRef.current) {
      const tl = gsap.timeline({ repeat: -1 });
      tl.to(lightRef.current, {
        intensity: 2.0,
        duration: 0.3,
        ease: "power1.in",
      })
        .to(lightRef.current, {
          intensity: 1.2,
          duration: 0.5,
          ease: "power1.out",
        })
        .to(lightRef.current, {
          intensity: 1.8,
          duration: 0.2,
          ease: "power1.in",
        })
        .to(lightRef.current, {
          intensity: 1.5,
          duration: 0.4,
          ease: "power1.out",
        });
    }
  }, [camera]);

  // Center camera initially
  camera.position.set(0, 2.5, 10);
  camera.lookAt(-5, 2.5, 0);

  // Split inputText into characters for individual meshes with closer spacing
  const textMeshes = inputText.split("").map((char, i) => (
    <Text
      key={i}
      position={[i * 1.5 - (inputText.length * 0.3) / 2, 0, 0]} // Reduced spacing from 0.5 to 0.3
      fontSize={1.5}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      {char}
    </Text>
  ));

  return (
    <>
      {/* Full 6-Sided Room */}
      <RoomBox ref={roomRef} />

      {/* Rain Particles */}
      <primitive ref={particleRef} object={particles} />

      {/* 2D Text Group (positioned to start at x = -5) */}
      <group ref={textRef} position={[-5, 4, 0]}>
        {textMeshes}
      </group>

      {/* Lighting */}
      <ambientLight intensity={0.8} />
      <pointLight ref={lightRef} position={[0, 5, 5]} intensity={1.5} />
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
