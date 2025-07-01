import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

export default function ParticlesComponent({
  count = 3000,
  rangeX = 30,
  rangeZ = 10,
}: {
  count?: number;
  rangeX?: number;
  rangeZ?: number;
}) {
  const particlesRef = useRef<THREE.Points | null>(null);
  const colorPool = useMemo(
    () => ["#ff007f", "#00ffff", "#ffff00", "#00ff00", "#ff00ff"],
    [],
  );

  const [positions, velocities, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = Math.random() * rangeX - rangeX / 2;
      pos[i * 3 + 1] = Math.random() * 10;
      pos[i * 3 + 2] = Math.random() * rangeZ - rangeZ / 2;
      vel[i] = 0.01 + Math.random() * 0.02;

      const hex = colorPool[Math.floor(Math.random() * colorPool.length)];
      const colValue = parseInt(hex.slice(1), 16);
      col[i * 3] = ((colValue >> 16) & 255) / 255;
      col[i * 3 + 1] = ((colValue >> 8) & 255) / 255;
      col[i * 3 + 2] = (colValue & 255) / 255;
    }

    return [pos, vel, col];
  }, [count, rangeX, rangeZ, colorPool]);

  useFrame(() => {
    const ref = particlesRef.current;
    if (!ref) return;

    const positionAttr = ref.geometry.attributes
      .position as THREE.BufferAttribute;
    const velocityAttr = ref.geometry.attributes
      .velocity as THREE.BufferAttribute;

    const positions = positionAttr.array as Float32Array;
    const velocities = velocityAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] -= velocities[i];
      if (positions[i * 3 + 1] < -1) positions[i * 3 + 1] = 10;
    }

    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-velocity" args={[velocities, 1]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.1} vertexColors transparent opacity={0.9} />
    </points>
  );
}
