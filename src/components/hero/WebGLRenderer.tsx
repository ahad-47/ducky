"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  getFrame,
  getLoopState,
  TOTAL_POINTS,
  FINDING_COUNT,
  type PointFrame,
} from "@/components/hero/choreography";

const WORLD_W = 6;
const WORLD_H = 6;
const WORLD_D = 1;

const vertexShader = `
  attribute float aSize;
  attribute float aAlpha;
  varying float vAlpha;
  void main() {
    vAlpha = aAlpha;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (260.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = length(c);
    float alpha = smoothstep(0.5, 0.15, d) * vAlpha;
    if (alpha <= 0.001) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

function toWorld(point: PointFrame): [number, number, number] {
  return [(point.x - 0.5) * WORLD_W, (0.5 - point.y) * WORLD_H, (point.z - 0.5) * WORLD_D];
}

function PointsLayer({
  ids,
  color,
  additive,
  frameGetter,
  loopAlphaGetter,
}: {
  ids: number[];
  color: string;
  additive: boolean;
  frameGetter: () => Map<number, PointFrame>;
  loopAlphaGetter: () => number;
}) {
  const count = ids.length;
  const geomRef = useRef<THREE.BufferGeometry>(null);

  // These buffers are intentionally mutated in place every frame below
  // instead of reallocated, which is the standard performant approach for
  // animating a WebGL point cloud. `ids` (and therefore `count`) is stable
  // for the lifetime of this component.
  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  const sizes = useMemo(() => new Float32Array(count), [count]);
  const alphas = useMemo(() => new Float32Array(count), [count]);

  /* eslint-disable react-hooks/immutability -- in-place mutation of these typed
     arrays every frame is the standard, allocation-free way to animate a WebGL
     point cloud; `positions`/`sizes`/`alphas` are GPU buffers, not render state. */
  useFrame(() => {
    const frame = frameGetter();
    const loopAlpha = loopAlphaGetter();
    for (let i = 0; i < ids.length; i++) {
      const p = frame.get(ids[i]);
      if (!p) continue;
      const [x, y, z] = toWorld(p);
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      sizes[i] = p.radius;
      alphas[i] = p.alpha * loopAlpha;
    }
    const geom = geomRef.current;
    if (!geom) return;
    (geom.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (geom.attributes.aSize as THREE.BufferAttribute).needsUpdate = true;
    (geom.attributes.aAlpha as THREE.BufferAttribute).needsUpdate = true;
  });
  /* eslint-enable react-hooks/immutability */

  return (
    <points>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aAlpha" args={[alphas, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ uColor: { value: new THREE.Color(color) } }}
        transparent
        depthWrite={false}
        blending={additive ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}

function Baseline() {
  const points = useMemo(
    () => [
      new THREE.Vector3(-2.94, 1.1, 0),
      new THREE.Vector3(-2.94, -1.6, 0),
    ],
    [],
  );
  const vPoints = useMemo(
    () => [new THREE.Vector3(2.4, -1.6, 0), new THREE.Vector3(-2.94, -1.6, 0)],
    [],
  );
  return (
    <>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(points.flatMap((p) => [p.x, p.y, p.z])), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#34363b" transparent opacity={0.5} />
      </line>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(vPoints.flatMap((p) => [p.x, p.y, p.z])), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#24262a" />
      </line>
    </>
  );
}

function Scene({
  elapsedRef,
  playingRef,
}: {
  elapsedRef: React.RefObject<number>;
  playingRef: React.RefObject<boolean>;
}) {
  const frameMapRef = useRef<Map<number, PointFrame>>(new Map());
  const loopAlphaRef = useRef(1);
  const pointer = useRef({ x: 0, y: 0 });
  const cameraTarget = useRef({ x: 0, y: 0 });

  const { observationIds, findingIds } = useMemo(() => {
    const initial = getFrame(0);
    return {
      observationIds: initial.filter((p) => p.kind === "observation").map((p) => p.id),
      findingIds: initial.filter((p) => p.kind === "finding").map((p) => p.id),
    };
  }, []);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ camera }, delta) => {
    if (playingRef.current) {
      elapsedRef.current += delta;
    }
    const { t, loopAlpha } = getLoopState(elapsedRef.current);
    loopAlphaRef.current = loopAlpha;
    const frame = getFrame(t);
    frameMapRef.current = new Map(frame.map((p) => [p.id, p]));

    cameraTarget.current.x += (pointer.current.y * 3 - cameraTarget.current.x) * 0.06;
    cameraTarget.current.y += (-pointer.current.x * 3 - cameraTarget.current.y) * 0.06;
    camera.rotation.x = THREE.MathUtils.degToRad(cameraTarget.current.x);
    camera.rotation.y = THREE.MathUtils.degToRad(cameraTarget.current.y);
  });

  return (
    <>
      <Baseline />
      <PointsLayer
        ids={observationIds}
        color="#a29f98"
        additive={false}
        frameGetter={() => frameMapRef.current}
        loopAlphaGetter={() => loopAlphaRef.current}
      />
      <PointsLayer
        ids={findingIds}
        color="#ff5a1f"
        additive
        frameGetter={() => frameMapRef.current}
        loopAlphaGetter={() => loopAlphaRef.current}
      />
    </>
  );
}

export function WebGLRenderer({
  playing,
  elapsedRef,
}: {
  playing: boolean;
  elapsedRef: React.RefObject<number>;
}) {
  const playingRef = useRef(playing);
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  return (
    <div
      role="img"
      aria-label={`${TOTAL_POINTS} raw observations resolved to ${FINDING_COUNT} confirmed findings.`}
      className="absolute inset-0 h-full w-full"
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 10], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene elapsedRef={elapsedRef} playingRef={playingRef} />
      </Canvas>
    </div>
  );
}
