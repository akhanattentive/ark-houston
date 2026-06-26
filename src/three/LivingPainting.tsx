import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { scroll } from '../lib/scrollState';

// — Tunables (in UV space, origin bottom-left) — fitted to the reference
// framing; nudge these once the real plates are in. The ark sits center,
// rising out of the lower sea, so we protect a box around it from the flow.
const HORIZON = 0.46; // water lives below this; sky above
const ARK_BOX = { x0: 0.24, x1: 0.86, y0: 0.26, y1: 0.9 };

const STORM_URL = `${import.meta.env.BASE_URL}art/storm.jpg`;
const CLEARING_URL = `${import.meta.env.BASE_URL}art/clearing.jpg`;

/** Soft vertical gradient stand-in until the real artwork is dropped in. */
function makeGradient(top: string, mid: string, bottom: string): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = 16;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, top);
  g.addColorStop(0.5, mid);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 16, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Loads an image into a texture, returning a gradient placeholder until it
 * arrives (and keeping the placeholder if the file is missing) so the scene
 * never breaks. Reports the image aspect for cover-fitting.
 */
function useImageTexture(url: string, fallback: THREE.Texture) {
  const [tex, setTex] = useState<THREE.Texture>(fallback);
  const aspect = useRef(16 / 9);
  useEffect(() => {
    let alive = true;
    new THREE.TextureLoader().load(
      url,
      (t) => {
        if (!alive) return;
        t.colorSpace = THREE.SRGBColorSpace;
        t.minFilter = THREE.LinearMipmapLinearFilter;
        t.generateMipmaps = true;
        const img = t.image as HTMLImageElement;
        if (img?.width) aspect.current = img.width / img.height;
        setTex(t);
      },
      undefined,
      () => {
        /* missing file — keep the gradient placeholder */
      },
    );
    return () => {
      alive = false;
    };
  }, [url]);
  return { tex, aspect };
}

export function LivingPainting() {
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const { viewport } = useThree();

  const stormFallback = useMemo(
    () => makeGradient('#39424b', '#5b6470', '#14202c'),
    [],
  );
  const goldFallback = useMemo(
    () => makeGradient('#f0d9a8', '#d9b877', '#9c7b46'),
    [],
  );
  const { tex: stormTex, aspect: stormAspect } = useImageTexture(STORM_URL, stormFallback);
  const { tex: goldTex, aspect: goldAspect } = useImageTexture(CLEARING_URL, goldFallback);

  const uniforms = useMemo(
    () => ({
      uStorm: { value: 0 },
      uTime: { value: 0 },
      uZoom: { value: 1 },
      uScreenAspect: { value: 1.78 },
      uStormTex: { value: stormTex },
      uGoldTex: { value: goldTex },
      uStormAspect: { value: 1.78 },
      uGoldAspect: { value: 1.78 },
      uHorizon: { value: HORIZON },
      uArkMin: { value: new THREE.Vector2(ARK_BOX.x0, ARK_BOX.y0) },
      uArkMax: { value: new THREE.Vector2(ARK_BOX.x1, ARK_BOX.y1) },
    }),
    // intentionally created once; texture values are swapped in useFrame
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame((state) => {
    const u = mat.current.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uStorm.value = THREE.MathUtils.lerp(u.uStorm.value, scroll.storm, 0.05);
    // slow cinematic push-in across the whole journey
    u.uZoom.value = 1 + scroll.progress * 0.08;
    u.uScreenAspect.value = viewport.width / viewport.height;
    u.uStormTex.value = stormTex;
    u.uGoldTex.value = goldTex;
    u.uStormAspect.value = stormAspect.current;
    u.uGoldAspect.value = goldAspect.current;
  });

  return (
    <mesh position={[0, 0, 0]} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        depthWrite={false}
      />
    </mesh>
  );
}

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform sampler2D uStormTex;
  uniform sampler2D uGoldTex;
  uniform float uStorm;
  uniform float uTime;
  uniform float uZoom;
  uniform float uScreenAspect;
  uniform float uStormAspect;
  uniform float uGoldAspect;
  uniform float uHorizon;
  uniform vec2 uArkMin;
  uniform vec2 uArkMax;
  varying vec2 vUv;

  // — value noise / fbm —
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  float noise(vec2 p){
    vec2 i=floor(p), f=fract(p);
    float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
    vec2 u=f*f*(3.-2.*f);
    return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
  }
  float fbm(vec2 p){
    float v=0.0, a=0.5;
    for(int i=0;i<4;i++){ v+=a*noise(p); p*=2.0; a*=0.5; }
    return v;
  }

  // cover-fit a uv (0..1) against an image whose aspect differs from screen
  vec2 coverUv(vec2 uv, float imgAspect, float scrAspect){
    vec2 s = scrAspect > imgAspect
      ? vec2(1.0, imgAspect/scrAspect)
      : vec2(scrAspect/imgAspect, 1.0);
    return (uv - 0.5) / s + 0.5;
  }

  // soft 1-inside box mask
  float boxMask(vec2 uv, vec2 lo, vec2 hi, float soft){
    vec2 a = smoothstep(lo - soft, lo + soft, uv);
    vec2 b = smoothstep(hi + soft, hi - soft, uv);
    return a.x * a.y * b.x * b.y;
  }

  void main(){
    // push-in zoom about the centre
    vec2 uv = (vUv - 0.5) / uZoom + 0.5;

    // region masks (uv origin bottom-left)
    float water = smoothstep(uHorizon + 0.05, uHorizon - 0.05, uv.y); // 1 below horizon
    float ark = boxMask(uv, uArkMin, uArkMax, 0.04);
    float flowMask = water * (1.0 - ark * 0.9);
    float sky = smoothstep(uHorizon - 0.02, uHorizon + 0.18, uv.y);

    float t = uTime;

    // — water flow: domain-warped scrolling noise displaces the painted sea —
    vec2 q = uv * vec2(3.0, 5.0);
    vec2 warp = vec2(
      fbm(q + vec2(0.0, t * 0.12)),
      fbm(q + vec2(5.2, -t * 0.10))
    );
    vec2 flow = vec2(
      fbm(q * 1.7 + warp * 1.5 + vec2(t * 0.16, 0.0)),
      fbm(q * 1.7 + warp * 1.5 + vec2(0.0, t * 0.10))
    ) - 0.5;
    float amp = (0.004 + uStorm * 0.020);
    vec2 disp = flow * flowMask * amp;

    // — clouds drift slowly across the sky —
    vec2 skyDisp = vec2(t * 0.004 + sin(t * 0.05) * 0.01, sin(t * 0.07) * 0.004) * sky;

    vec2 finalUv = uv + disp + skyDisp;

    // sample both plates with cover-fit, crossfade by storm
    vec3 stormCol = texture2D(uStormTex, coverUv(finalUv, uStormAspect, uScreenAspect)).rgb;
    vec3 goldCol  = texture2D(uGoldTex,  coverUv(finalUv, uGoldAspect,  uScreenAspect)).rgb;
    vec3 col = mix(goldCol, stormCol, clamp(uStorm, 0.0, 1.0));

    // — foam shimmer: fine sparkle riding the crests —
    float shimmer = (fbm(uv * vec2(22.0, 34.0) + t * vec2(0.4, 0.7)) - 0.5);
    col += flowMask * shimmer * (0.05 + uStorm * 0.05);

    // gentle storm desaturation + darken so the leaden plate broods more
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(col, vec3(luma), uStorm * 0.12);
    col *= 1.0 - uStorm * 0.06;

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;
