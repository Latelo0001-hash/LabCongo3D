import { useEffect, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { DataTexture, Mesh, MeshStandardMaterial, RepeatWrapping, RGBAFormat, SRGBColorSpace, TextureLoader, Vector2 } from 'three';
import type { Material, Object3D, Texture } from 'three';

// Modèles et textures de la scène 3D du film.
export const sceneFiles = {
  truck: '/models/immersive/scania-truck.glb',
  chassis: '/models/immersive/container-chassis-v2.glb',
  container: '/models/immersive/container-v2.glb',
  bench: '/models/immersive/bench-equipment-v1.glb',
  crate: '/models/immersive/crate-v2.glb',
} as const;
const woodTextures = [
  '/textures/immersive/wood-color.webp',
  '/textures/immersive/wood-normal.webp',
  '/textures/immersive/wood-roughness.webp',
];
// Groupes de modèles chargés ensemble : le cache des chargements est rangé par groupe exact.
export const sceneLoads = {
  bench: [sceneFiles.bench],
  convoy: [sceneFiles.truck, sceneFiles.chassis, sceneFiles.container],
  crates: [sceneFiles.crate, sceneFiles.container],
};
// Après un échec (mémoire ou réseau, sur téléphone surtout), vide le cache des chargements, groupe par groupe : un nouvel
// essai de la scène les refait au lieu de retrouver l'erreur.
export function clearSceneCache() {
  Object.values(sceneLoads).forEach((group) => useGLTF.clear(group));
  useLoader.clear(TextureLoader, woodTextures);
}

// Fine relief for paint, rubber and foam. Deterministic, created once per mounting.
function microSurface() {
  const size = 128;
  const bytes = new Uint8Array(size * size * 4);
  let seed = 173;
  for (let i = 0; i < size * size; i++) {
    seed = (1664525 * seed + 1013904223) >>> 0;
    const value = 100 + Math.round(seed / 0xffffffff * 100);
    bytes.set([value, value, value, 255], i * 4);
  }
  const texture = new DataTexture(bytes, size, size, RGBAFormat);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.needsUpdate = true;
  return texture;
}

export function useSceneAssets() {
  const [crateFile, containerFile] = useGLTF(sceneLoads.crates, false, true);
  const woodFiles = useLoader(TextureLoader, woodTextures);
  const assets = useMemo(() => {
    const wood = woodFiles.map((source, i) => {
      const texture = source.clone();
      texture.wrapS = texture.wrapT = RepeatWrapping;
      texture.anisotropy = 4;
      if (i === 0) texture.colorSpace = SRGBColorSpace;
      texture.needsUpdate = true;
      return texture;
    });
    const micro = microSurface();
    const materials = new Map<Material, MeshStandardMaterial>();
    function prepare(source: Object3D) {
      const scene = source.clone(true);
      scene.traverse((object) => {
        if (!(object instanceof Mesh)) return;
        const original = object.material as MeshStandardMaterial;
        let material = materials.get(original);
        if (!material) {
          material = original.clone();
          material.envMapIntensity = .48;
          if (material.name === 'Plywood face' || material.name === 'Pine framing') {
            material.map = wood[0];
            material.normalMap = wood[1];
            material.normalScale = new Vector2(.08, .08);
            material.roughnessMap = wood[2];
            material.roughness = .95;
            material.color.set(material.name === 'Plywood face' ? '#ebe0ce' : '#d6c4a5');
          } else if (['Packing foam', 'Rubber', 'Container enamel'].includes(material.name)) {
            material.bumpMap = micro;
            material.bumpScale = material.name === 'Packing foam' ? .014 : material.name === 'Rubber' ? .002 : .00045;
          }
          if (material.transparent) material.depthWrite = false;
          materials.set(original, material);
        }
        object.material = material;
        object.castShadow = !material.transparent;
        object.receiveShadow = !material.transparent;
      });
      return scene;
    }
    return { crate: prepare(crateFile.scene), container: prepare(containerFile.scene), materials, textures: [...wood, micro] as Texture[] };
  }, [crateFile.scene, containerFile.scene, woodFiles]);
  useEffect(() => () => {
    assets.materials.forEach((material) => material.dispose());
    assets.textures.forEach((texture) => texture.dispose());
  }, [assets]);
  return assets;
}
