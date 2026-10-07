import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Group, Mesh, PerspectiveCamera, Vector3 } from 'three';
import type { Object3D } from 'three';
import { useJourney } from './useJourney';
import { between, cameraKeys, interpolate, mix, sample } from './timeline';
import { useSceneAssets } from './sceneAssets';
import StudioLighting from './StudioLighting';

function Objects({ onReady }: { onReady: () => void }) {
  const assets = useSceneAssets();
  const articulated = useRef<{ lid?: Object3D; left?: Object3D; right?: Object3D }>({});
  const root = useRef<Group>(null);
  const scope = useRef<Group>(null);
  const crate = useRef<Group>(null);
  const container = useRef<Group>(null);
  const shadow = useRef<Mesh>(null);
  const { invalidate } = useThree();
  const target = useMemo(() => new Vector3(), []);

  useEffect(() => {
    articulated.current = {
      lid: assets.crate.getObjectByName('CrateLid'),
      left: assets.container.getObjectByName('DoorLeft'),
      right: assets.container.getObjectByName('DoorRight'),
    };
    onReady();
    invalidate();
    return useJourney.subscribe(() => invalidate());
  }, [assets, invalidate, onReady]);

  useFrame(({ camera, size }) => {
    if (!root.current || !scope.current || !crate.current || !container.current || !shadow.current) return;
    const p = useJourney.getState().progress;
    const { index, t } = sample(p);
    const first = cameraKeys[index], next = cameraKeys[index + 1];
    const mobile = size.width < 1000;
    const compact = size.height < 650;
    camera.position.set(...first.position.map((value, axis) => mix(value, next.position[axis], t)) as [number, number, number]);
    target.set(...first.target.map((value, axis) => mix(value, next.target[axis], t)) as [number, number, number]);
    camera.lookAt(target);
    (camera as PerspectiveCamera).fov = mix(first.fov, next.fov, t);
    camera.updateProjectionMatrix();

    const packing = between(p, .57, .82);
    const shipping = between(p, .84, .95);
    const close = between(p, .80, .86);
    const scale = mobile ? Math.min(.65, size.width / size.height * 1.05) : compact ? .8 : 1;
    const containerTurn = between(p, .79, .9);
    root.current.position.set(mobile ? -1.49 * scale * containerTurn : interpolate([1.7, -1.7, 1.7, -1.7, 1.45], p), mobile ? (compact ? 1 + .65 * containerTurn : 1.3) : 0, 0);
    root.current.scale.setScalar(scale);
    root.current.rotation.y = mix(0, -.55, containerTurn);

    const scopeScale = mix(interpolate([1.16, 1.12, 1.30, 1, 1], p), .56, packing);
    const scopeY = mix(mix(.12, .62, between(p, .52, .63)), -.24, between(p, .71, .80));
    scope.current.visible = p < .86;
    scope.current.position.set(0, scopeY, -shipping * 2.5);
    scope.current.scale.setScalar(scopeScale);
    scope.current.rotation.set(0, interpolate([-.82, .50, -1.02, -.3, 0], p), 0);

    crate.current.visible = p > .53;
    crate.current.position.set(0, mix(-4.2, -.25, between(p, .53, .67)), -shipping * 2.5);
    const lid = articulated.current.lid;
    if (lid) {
      lid.position.set(0, mix(1.92, .79, close), mix(-.15, 0, close));
      lid.rotation.x = mix(-.1, 0, close);
    }
    container.current.visible = p > .79;
    container.current.position.set(0, mix(-7, -1.55, between(p, .79, .88)), -2.85);
    const doorAngle = (1 - between(p, .955, 1)) * Math.PI * .56;
    if (articulated.current.left) articulated.current.left.rotation.y = -doorAngle;
    if (articulated.current.right) articulated.current.right.rotation.y = doorAngle;

    shadow.current.position.set(0, mix(scopeY - 1.165 * scopeScale, -1.34, between(p, .52, .70)), -shipping * 2.5);
    shadow.current.visible = p < .79;
  });

  return <group ref={root}>
    <group ref={scope}><primitive object={assets.microscope} dispose={null} /></group>
    <group ref={crate}><primitive object={assets.crate} dispose={null} /></group>
    <group ref={container}><primitive object={assets.container} dispose={null} /></group>
    <mesh ref={shadow} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[4.5, 4.5]} /><shadowMaterial transparent opacity={.24} depthWrite={false} />
    </mesh>
  </group>;
}

function ContextGuard({ onFailure }: { onFailure: () => void }) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    canvas.addEventListener('webglcontextlost', lost);
    return () => canvas.removeEventListener('webglcontextlost', lost);
  }, [gl, onFailure]);
  return null;
}

export default function JourneyCanvas(props: { onReady: () => void; onFailure: () => void }) {
  return <Canvas camera={{ position: [0, .25, 8.4], fov: 38 }} dpr={[1, 1.5]} frameloop="demand" shadows="soft" gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }} fallback={null}>
    <ContextGuard onFailure={props.onFailure} />
    <StudioLighting />
    <Suspense fallback={null}><Objects onReady={props.onReady} /></Suspense>
  </Canvas>;
}
