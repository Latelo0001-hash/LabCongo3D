import { useEffect, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { DataTexture, Mesh, MeshStandardMaterial, RepeatWrapping, RGBAFormat, SRGBColorSpace, TextureLoader, Vector2 } from 'three';
import type { Material, Object3D, Texture } from 'three';
import { models } from './timeline';

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
  const [scopeFile, crateFile, containerFile] = useGLTF([models.microscope, models.crate, models.container], false, true);
  const woodFiles = useLoader(TextureLoader, [
    '/textures/immersive/wood-color.webp',
    '/textures/immersive/wood-normal.webp',
    '/textures/immersive/wood-roughness.webp',
  ]);
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
          } else if (['Packing foam', 'Rubber', 'Container enamel', 'Ivory enamel', 'Blue grey casting'].includes(material.name)) {
            material.bumpMap = micro;
            material.bumpScale = material.name === 'Packing foam' ? .014 : material.name === 'Rubber' ? .002 : .00045;
          }
          if (material.name === 'Ivory enamel') {
            material.color.set('#b9b6ab');
            material.roughness = .38;
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
    return { microscope: prepare(scopeFile.scene), crate: prepare(crateFile.scene), container: prepare(containerFile.scene), materials, textures: [...wood, micro] as Texture[] };
  }, [scopeFile.scene, crateFile.scene, containerFile.scene, woodFiles]);
  useEffect(() => () => {
    assets.materials.forEach((material) => material.dispose());
    assets.textures.forEach((texture) => texture.dispose());
  }, [assets]);
  return assets;
}
