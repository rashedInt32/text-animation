import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useControls } from "leva";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

export const CanvasComponent = () => {
  const BoxComp = () => {
    const meshRef = useRef(null);
    const colors = [
      "#314158",
      "#1d293d",
      "#0f172b",
      "#314158",
      "#0f172b",
      "#62748e",
    ];

    // Leva controls for position, rotation, scale, and opacity
    const {
      positionX,
      positionY,
      positionZ,
      rotationX,
      rotationY,
      rotationZ,
      scaleX,
      scaleY,
      scaleZ,
      opacity,
    } = useControls("Box Controls", {
      positionX: { value: 0, min: -5, max: 5, step: 0.1, label: "Pos X" },
      positionY: { value: 0, min: -5, max: 5, step: 0.1, label: "Pos Y" },
      positionZ: { value: 0, min: -5, max: 5, step: 0.1, label: "Pos Z" },
      rotationX: {
        value: 0,
        min: -Math.PI,
        max: Math.PI,
        step: 0.1,
        label: "Rot X",
      },
      rotationY: {
        value: 0,
        min: -Math.PI,
        max: Math.PI,
        step: 0.1,
        label: "Rot Y",
      },
      rotationZ: {
        value: 0,
        min: -Math.PI,
        max: Math.PI,
        step: 0.1,
        label: "Rot Z",
      },
      scaleX: { value: 5, min: 0.1, max: 5, step: 0.1, label: "Scale X" },
      scaleY: { value: 4.7, min: 0.1, max: 5, step: 0.1, label: "Scale Y" },
      scaleZ: { value: 3.2, min: 0.1, max: 5, step: 0.1, label: "Scale Z" },
      opacity: {
        value: 0,
        min: 0,
        max: 1,
        step: 0.01,
        label: "Transparent Faces Opacity",
      },
    });

    useFrame(() => {
      if (meshRef.current) {
        // Optional: Uncomment for auto-rotation
        // meshRef.current.rotation.y += 0.01;
        // meshRef.current.rotation.x += 0.01;
      }
    });

    return (
      <mesh
        ref={meshRef}
        position={[positionX, positionY, positionZ]}
        rotation={[rotationX, rotationY, rotationZ]}
        scale={[scaleX, scaleY, scaleZ]}
      >
        <boxGeometry args={[1, 1, 1]} />
        {colors.map((color, index) => (
          <meshBasicMaterial
            attach={`material-${index}`}
            key={index}
            color={color}
            transparent={index === 4} // Transparent for front (4) and back (5)
            opacity={index === 4 ? opacity : 1} // Opacity for transparent faces
            side={THREE.DoubleSide} // Render both sides for visibility
          />
        ))}
      </mesh>
    );
  };

  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      {/* Remove lights since meshBasicMaterial is unlit */}
      <BoxComp />
      <OrbitControls enablePan enableRotate />
    </Canvas>
  );
};
