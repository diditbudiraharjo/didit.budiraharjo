import { useMemo } from "react";
import * as THREE from "three";

/**
 * Control points tracing the brand's handwritten "M" signature: an entry
 * flick, two humps, a dropped valley between them, and a long exit tail
 * that kicks up at the tip — the same gesture as the primary logo mark.
 */
const POINTS: [number, number, number][] = [
  [-2.7, -0.05, 0],
  [-2.35, 0.45, 0.05],
  [-1.95, 0.85, 0.1],
  [-1.55, 0.5, 0.05],
  [-1.15, -0.35, -0.05],
  [-0.75, -0.55, -0.1],
  [-0.35, 0.15, -0.05],
  [0.05, 0.8, 0.05],
  [0.45, 0.35, 0.1],
  [0.85, -0.15, 0.05],
  [1.35, -0.4, 0],
  [2.0, -0.2, -0.05],
  [2.6, 0.25, -0.1],
];

export function SignatureMark({ matte = true }: { matte?: boolean }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      POINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
      false,
      "catmullrom",
      0.55
    );
    return new THREE.TubeGeometry(curve, 260, 0.075, 10, false);
  }, []);

  return (
    <mesh geometry={geometry} castShadow={false} receiveShadow={false}>
      <meshStandardMaterial
        color="#f7f6f3"
        roughness={matte ? 0.92 : 0.4}
        metalness={matte ? 0.04 : 0.2}
      />
    </mesh>
  );
}
