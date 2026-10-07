import { useMemo } from "react";
import { useGLTF } from "@react-three/drei/core/Gltf";
export function GLBModel({ url }: { url: string }) {
  const { scene } = useGLTF(url, false, false);
  const instance = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={instance} dispose={null} />;
}
export default function MicroscopeModel() {
  return <GLBModel url="/models/microscope.glb" />;
}
