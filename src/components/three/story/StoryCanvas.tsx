import { Suspense, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { useStore } from "zustand";
import type { StoryStore } from "../../../features/experience/store";
import { storyChapters } from "../../../features/experience/scenario";
import StoryStages from "./StoryStages";
function StageLoading() {
  return (
    <mesh position={[0, 0.3, 0]}>
      <boxGeometry args={[1, 0.6, 0.7]} />
      <meshStandardMaterial color="#c6a780" />
    </mesh>
  );
}
function Cinematography({
  store,
  onFailure,
}: {
  store: StoryStore;
  onFailure: () => void;
}) {
  const { camera, invalidate, gl, size } = useThree();
  const vectors = useMemo(
    () => ({ from: new Vector3(), to: new Vector3(), target: new Vector3() }),
    [],
  );
  useEffect(() => store.subscribe(() => invalidate()), [store, invalidate]);
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onFailure]);
  useFrame(() => {
    const value = store.getState().progress,
      index = Math.floor(value),
      local = value - index;
    const shot = storyChapters[index].camera;
    vectors.from.set(...shot.from);
    vectors.to.set(...shot.to);
    vectors.target.set(...shot.target);
    const p = local * local * (3 - 2 * local);
    camera.position.lerpVectors(vectors.from, vectors.to, p);
    if (index === 0 && local >= 0.58) {
      camera.position.set(
        5.7 - (local - 0.58) * 2,
        3.7,
        8 - (local - 0.58) * 3,
      );
      vectors.target.set(0, 1.2, 0);
    }
    if (size.width / size.height < 1.15)
      camera.position
        .sub(vectors.target)
        .multiplyScalar(1.3)
        .add(vectors.target);
    camera.lookAt(vectors.target);
    camera.updateMatrixWorld();
  });
  return null;
}
function Stage({ store }: { store: StoryStore }) {
  const chapter = useStore(store, (state) => Math.floor(state.progress));
  return (
    <Suspense fallback={<StageLoading />}>
      <StoryStages key={chapter} chapter={chapter} store={store} />
    </Suspense>
  );
}
export default function StoryCanvas({
  store,
  onFailure,
}: {
  store: StoryStore;
  onFailure: () => void;
}) {
  return (
    <Canvas
      camera={{ position: [10, 6, 13], fov: 39, near: 0.1, far: 90 }}
      shadows
      dpr={[1, 1.5]}
      frameloop="demand"
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={["#eaf1f7"]} />
      <fog attach="fog" args={["#eaf1f7", 25, 65]} />
      <hemisphereLight args={["#ffffff", "#c4ced4", 2.4]} />
      <directionalLight
        position={[5, 12, 6]}
        intensity={2.7}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-normalBias={0.045}
      />
      <directionalLight
        position={[-6, 4, -3]}
        intensity={1.1}
        color="#afcbe4"
      />
      <mesh
        position={[0, -0.2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial color="#e5ecf1" roughness={1} />
      </mesh>
      <Cinematography store={store} onFailure={onFailure} />
      <Stage store={store} />
    </Canvas>
  );
}
