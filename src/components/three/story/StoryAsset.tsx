import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei/core/Gltf";
import type { Group, Mesh } from "three";
import type { StoryStore } from "../../../features/experience/store";
export type StoryAssetName =
  | "campus"
  | "europe-lab"
  | "packing"
  | "container"
  | "truck"
  | "port"
  | "ship"
  | "school"
  | "classroom"
  | "team-man"
  | "team-woman"
  | "researcher"
  | "teacher"
  | "student";
export type StageAnimator = (group: Group, progress: number) => void;
export default function StoryAsset({
  name,
  store,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  animate,
}: {
  name: StoryAssetName;
  store: StoryStore;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  animate?: StageAnimator;
}) {
  const { scene } = useGLTF(`/models/story/${name}.glb`, false, false);
  const instance = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse((node) => {
      if ((node as Mesh).isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    return copy;
  }, [scene]);
  const ref = useRef<Group>(null);
  useFrame(() => {
    const value = store.getState().progress;
    if (ref.current) animate?.(ref.current, value - Math.floor(value));
  });
  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      <primitive object={instance} dispose={null} />
    </group>
  );
}
