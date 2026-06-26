import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scroll } from '../lib/scrollState';

const COUNT = 1400;

/** Slanted rain that thickens with the storm and all but vanishes in calm. */
export function Rain() {
  const ref = useRef<THREE.Points>(null!);
  const mat = useRef<THREE.PointsMaterial>(null!);

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = 1 + Math.random() * 3; // between plate (z=0) and camera (z=5)
      speeds[i] = 0.4 + Math.random() * 0.9;
    }
    return { positions, speeds };
  }, []);

  useFrame((_, delta) => {
    const storm = scroll.storm;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    const fall = (5.5 + storm * 8) * Math.min(delta, 0.05);
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 1] -= fall * speeds[i];
      arr[i * 3 + 0] -= fall * 0.3 * speeds[i]; // wind slant
      if (arr[i * 3 + 1] < -4.2) {
        arr[i * 3 + 1] = 4.2;
        arr[i * 3 + 0] = (Math.random() - 0.5) * 12;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    if (mat.current) mat.current.opacity = 0.06 + storm * 0.5;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        color="#dce8ec"
        size={0.022}
        transparent
        opacity={0}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
