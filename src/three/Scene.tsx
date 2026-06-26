import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Rain } from './Rain';
import { LivingPainting } from './LivingPainting';
import { scroll } from '../lib/scrollState';

function SceneContents() {
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // a whisper of handheld float so the painting feels alive, not static
    camera.position.x = Math.sin(t * 0.12) * 0.04;
    camera.position.y = Math.sin(t * 0.09 + 1.0) * 0.03 - scroll.storm * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <LivingPainting />
      <Rain />
    </>
  );
}

export function Scene() {
  return (
    <div id="scene-canvas">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 100 }}
      >
        <SceneContents />
      </Canvas>
    </div>
  );
}
