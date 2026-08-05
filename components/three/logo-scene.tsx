"use client";

import { Suspense, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { SignatureMark } from "./signature-mark";
import { logoStore } from "./logo-store";

const AUTO_ROTATE_SPEED = 0.12;

function Rig({ children }: { children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const autoAngle = useRef(0);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    autoAngle.current += delta * AUTO_ROTATE_SPEED;
    const scrollProgress = logoStore.getState().scrollProgress;

    // Pointer tilt: the mark leans toward wherever the cursor is.
    const pointerYaw = state.pointer.x * 0.55;
    const pointerPitch = -state.pointer.y * 0.22;
    // Scrolling past the hero keeps advancing the signature's spin, so
    // hovering + scrolling together read as the mark "following" the
    // combined gesture rather than two unrelated inputs.
    const scrollYaw = scrollProgress * Math.PI * 0.85;

    const targetY = autoAngle.current + pointerYaw + scrollYaw;
    const targetX = pointerPitch;

    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 3, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 3, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, scrollProgress * -0.35, 3, delta);
  });

  return <group ref={group}>{children}</group>;
}

type Props = { onReady?: () => void };

export function LogoScene({ onReady }: Props) {
  const [dpr, setDpr] = useState<[number, number]>([1, 1.75]);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0.05, 9], fov: 30 }}
      frameloop="always"
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={onReady}
    >
      <ambientLight intensity={0.35} color="#f7f6f3" />
      <directionalLight position={[4, 5, 6]} intensity={1.35} color="#ffffff" />
      <directionalLight position={[-5, -2, -3]} intensity={0.4} color="#f7f6f3" />
      <pointLight position={[0, 0, 4]} intensity={0.5} color="#ffffff" />

      <PerformanceMonitor onIncline={() => setDpr([1, 1.75])} onDecline={() => setDpr([1, 1])}>
        <Suspense fallback={null}>
          <Rig>
            <Float speed={1.1} rotationIntensity={0.12} floatingRange={[-0.05, 0.05]}>
              <SignatureMark />
            </Float>
          </Rig>
        </Suspense>
      </PerformanceMonitor>
    </Canvas>
  );
}
