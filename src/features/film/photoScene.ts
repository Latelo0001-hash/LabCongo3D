import { Box3, Mesh, ShaderChunk, Vector3 } from 'three';
import type { BufferGeometry, MeshPhysicalMaterial, Object3D } from 'three';

// Scène 3D posée sur une photo : la caméra reprend sa perspective (champ vertical en degrés, ligne d'horizon en pixels,
// hauteur d'œil en mètres), et le matériel se pose sur ses paillasses (plateau à `bench` mètres). Servi par la salle de
// la collecte (film d'ouverture) et par le laboratoire de l'école (installation, rendue à l'avance).
export type PhotoCalibration = { width: number; height: number; fov: number; horizon: number; eye: number; bench: number; origin: Vector3 };

// Caisse du modèle : du dessous des patins au bord supérieur, et du centre au fond intérieur, en unités du modèle.
export const crateBody = { height: 1.79, depth: 1.84, floor: -.85, rim: .73, base: 1.06 } as const;

export function photoCamera(photo: PhotoCalibration) {
  const focal = photo.height / 2 / Math.tan(photo.fov / 2 * Math.PI / 180);
  const pitch = Math.atan((photo.height / 2 - photo.horizon) / focal);
  const c = Math.cos(pitch), s = Math.sin(pitch);

  // Point d'un plan horizontal de hauteur `y` (en mètres) vu au pixel (u, v) de la photo.
  function onPhoto(u: number, v: number, y: number) {
    const dx = (u - photo.width / 2) / focal, dy = -(v - photo.height / 2) / focal;
    const direction = new Vector3(dx, dy * c - s, -dy * s - c);
    const depth = (y - photo.eye) / direction.y;
    return { point: new Vector3(direction.x * depth, y, direction.z * depth).add(photo.origin) };
  }
  // Ligne de la photo où se voit un point : l'inverse de `onPhoto`.
  function photoRow(point: Vector3) {
    const y = point.y - photo.eye, z = point.z - photo.origin.z;
    return photo.height / 2 - focal * (y * c - z * s) / (-y * s - z * c);
  }
  // Objet posé sur la paillasse : le pixel relevé est le bas de sa silhouette, soit le milieu de l'arête avant de sa base,
  // et la hauteur relevée va de là au point le plus haut à l'écran, profondeur comprise (vue d'en haut, des lunettes couchées
  // paraissent plus hautes qu'elles ne le sont). On cherche l'échelle qui donne cette hauteur, d'après les sommets du
  // modèle, puis l'origine du modèle.
  function fitOnPhoto(object: Object3D, u: number, v: number, pixels: number) {
    const box = new Box3().setFromObject(object);
    const { point } = onPhoto(u, v, photo.bench);
    const middle = (box.min.x + box.max.x) / 2;
    const vertices: Vector3[] = [];
    object.traverse((part) => {
      if (!(part instanceof Mesh)) return;
      const position = (part.geometry as BufferGeometry).attributes.position;
      for (let i = 0; i < position.count; i += 3) vertices.push(new Vector3().fromBufferAttribute(position, i).applyMatrix4(part.matrixWorld));
    });
    const corner = new Vector3();
    const top = (scale: number) => vertices.reduce((row, vertex) =>
      Math.min(row, photoRow(corner.set(vertex.x - middle, vertex.y, vertex.z - box.max.z).multiplyScalar(scale).add(point))), Infinity);
    let low = .01, high = 20;
    for (let i = 0; i < 40; i += 1) {
      const scale = (low + high) / 2;
      if (top(scale) < v - pixels) high = scale; else low = scale;
    }
    return { start: point.clone().sub(new Vector3(middle, 0, box.max.z).multiplyScalar(low)), scale: low };
  }
  // Caisse posée au sol, vue d'en haut : à l'écran, elle s'étend de l'arête avant de sa base à l'arête arrière de son
  // dessus. On cherche la hauteur qui donne cette étendue, puis on recule la caisse de sa demi-profondeur.
  function crateOnPhoto(u: number, v: number, pixels: number) {
    const { point } = onPhoto(u, v, 0);
    const back = point.clone().sub(photo.origin).setY(0).normalize();
    const top = new Vector3();
    let low = .1, high = 2;
    for (let i = 0; i < 30; i += 1) {
      const height = (low + high) / 2;
      top.copy(point).addScaledVector(back, height * crateBody.depth / crateBody.height).setY(height);
      if (photoRow(top) < v - pixels) high = height; else low = height;
    }
    return { point, back, height: low };
  }
  return { focal, pitch, onPhoto, photoRow, fitOnPhoto, crateOnPhoto };
}

// Verre et solutions : par défaut, three.js règle le flou de la transmission sur la rugosité de la géométrie ; ce qui est vu
// au travers du verre se floute et la couleur des solutions se dilue. La transmission garde ici la rugosité du verre.
// Devant la photo, le verre n'ajouterait que ses reflets : sur un fond clair (mur, meubles), la partie vide d'un flacon
// soulevé disparaissait. Il garde un corps léger, plus dense sur les bords vus en biais, comme l'épaisseur du verre :
// un contour un peu plus sombre que le fond clair, un peu plus clair que le fond sombre.
export function sharpTransmission(shader: { fragmentShader: string }) {
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <transmission_fragment>', ShaderChunk.transmission_fragment.replace('n, v, material.roughness,', 'n, v, roughnessFactor,'))
    .replace('#include <opaque_fragment>', `#include <opaque_fragment>
      float glassEdge = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 2.0);
      float glassBody = (0.06 + 0.5 * glassEdge) * (1.0 - gl_FragColor.a);
      gl_FragColor.rgb += vec3(0.6, 0.68, 0.72) * glassBody * 0.35;
      gl_FragColor.a += glassBody;`);
}

// Reflet dans le vernis : il s'estompe en s'éloignant du point de contact, sur 15 cm sous le plan de la paillasse.
export const fadeReflection = (bench: number) => (shader: { vertexShader: string; fragmentShader: string }) => {
  shader.vertexShader = shader.vertexShader
    .replace('void main() {', 'varying float vDrop;\nvoid main() {')
    .replace('#include <project_vertex>', '#include <project_vertex>\nvDrop = (modelMatrix * vec4(transformed, 1.0)).y;');
  shader.fragmentShader = shader.fragmentShader
    .replace('void main() {', 'varying float vDrop;\nvoid main() {')
    .replace('#include <opaque_fragment>', `#include <opaque_fragment>\ngl_FragColor.a *= clamp(1.0 - (${bench.toFixed(3)} - vDrop) / 0.15, 0.0, 1.0);`);
};

// Matériaux du matériel des paillasses (bench-equipment) : le verre transmet la lumière, la photo reste visible au
// travers et il ne porte pas d'ombre. Ses reflets restent mesurés, pour ne pas blanchir les solutions ; celles-ci ne
// reflètent presque rien. Le tone mapping délave les couleurs vives et fortement éclairées : solutions et verre (qui les
// laisse voir) y échappent, pour garder les couleurs franches de la photo.
export function prepareBenchMaterials(root: Object3D) {
  root.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    const material = object.material as MeshPhysicalMaterial;
    const clear = material.transmission > 0;
    material.envMapIntensity = clear ? .22 : material.vertexColors ? .25 : .9;
    if (clear || material.vertexColors) material.toneMapped = false;
    if (clear) {
      material.onBeforeCompile = sharpTransmission;
      material.customProgramCacheKey = () => 'sharp-transmission-body';
      // Le verre n'écrit pas la profondeur : l'eau translucide du flacon, dessinée après lui, reste visible au travers.
      material.depthWrite = false;
    }
    object.castShadow = !clear && !material.transparent;
    object.receiveShadow = !clear && !material.transparent;
  });
  return root;
}
