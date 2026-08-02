"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import type { Mesh } from "three";

function DistortedBlob() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.08;
    meshRef.current.rotation.y += delta * 0.12;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.9}>
      <mesh ref={meshRef} scale={2.1}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#d7ff3f"
          roughness={0.2}
          metalness={0.1}
          distort={0.42}
          speed={1.6}
        />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 5.5], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <directionalLight
        position={[-4, -2, -3]}
        intensity={0.8}
        color="#7fd7ff"
      />
      <pointLight position={[0, 0, 4]} intensity={0.6} color="#ffffff" />
      <DistortedBlob />
    </Canvas>
  );
}
