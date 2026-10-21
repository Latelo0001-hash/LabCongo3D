import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { AlwaysStencilFunc, Box3, BoxGeometry, BufferGeometry, CustomBlending, ShaderChunk, DirectionalLight, DoubleSide, DstAlphaFactor, EqualStencilFunc, ExtrudeGeometry, Group, InstancedMesh, Matrix4, Mesh, MeshStandardMaterial, OneFactor, OneMinusSrcAlphaFactor, Quaternion, ReplaceStencilOp, Shape, Vector3, ZeroFactor } from 'three';
import type { MeshPhysicalMaterial, Object3D, PerspectiveCamera, ShaderMaterial, ShadowMaterial } from 'three';
import { useRoomEnvironment } from './useRoomEnvironment';
import { sceneLoads, useSceneAssets } from './sceneAssets';
import { useFilm } from './useFilm';
import { at, clamp, collect, exitCovers, fov, framing, lab, labFocal, labFrame, labPitch, laneOffset, mix, openingMask, road, roadLength, roadPoint, sceneShown, seg, travel, yard } from './filmTimeline';

const up = new Vector3(0, 1, 0);

// Mesures du modèle « Scania truck » (PAndras, CC BY 4.0), en unités du fichier :
// sens de marche (de l'essieu arrière vers l'avant), centre de la sellette et échelle en mètres.
const truckModel = { scale: .18, wheelRadius: .536, forward: new Vector3(-17.96, 0, 15.24).normalize(), fifthWheel: new Vector3(18.25, 6.53, -22.21) };

// Laboratoire de la photo, placé dans le monde : ses caisses se posent juste devant la cour de chargement,
// où le conteneur (porte vers +Z) vient les chercher.
const labOrigin = new Vector3(yard.x - .2, 0, 2.3);
const containerZ = -4.7;

// Point d'un plan horizontal de hauteur `y` (en mètres) vu au pixel (u, v) de la photo, dans le repère du laboratoire.
function onLab(u: number, v: number, y: number) {
  const dx = (u - lab.width / 2) / labFocal, dy = -(v - lab.height / 2) / labFocal;
  const c = Math.cos(labPitch), s = Math.sin(labPitch);
  const direction = new Vector3(dx, dy * c - s, -dy * s - c);
  const depth = (y - lab.eye) / direction.y;
  return { point: new Vector3(direction.x * depth, y, direction.z * depth).add(labOrigin) };
}
// Ligne de la photo où se voit un point du laboratoire : l'inverse de `onLab`.
function labRow(point: Vector3) {
  const c = Math.cos(labPitch), s = Math.sin(labPitch);
  const y = point.y - lab.eye, z = point.z - labOrigin.z;
  return lab.height / 2 - labFocal * (y * c - z * s) / (-y * s - z * c);
}

// Tables de la photo : fenêtre de départ de leur matériel (en écrans), durée d'un envol, plateau sur la photo vidée
// (pixels) qui reçoit les ombres et les reflets. Sur les tables lointaines, objets, ombres et reflets ne font que
// quelques pixels : ils n'ont ni reflet ni ombre portée, ce qui allège le rendu. Les tables partent par vagues, intercalées : sur un écran large, la
// paillasse du premier plan se vide d'abord par la gauche, avant que le cadre ne glisse vers les tables de droite.
const tables = {
  front: { leave: [.75, 1.75], flight: .5, reflect: true, top: [[-300, 571], [645, 574], [292, 788], [80, 941], [-300, 941]] },
  middle: { leave: [1, 1.75], flight: .55, reflect: false, top: [[350, 462], [725, 462], [725, 470], [682, 501], [350, 501]] },
  right: { leave: [1.1, 1.85], flight: .55, reflect: false, top: [[995, 452], [1290, 452], [1388, 504], [1062, 504]] },
  back: { leave: [1.25, 1.95], flight: .55, reflect: false, top: [[1280, 434], [1672, 442], [1672, 471], [1280, 438]] },
  corner: { leave: [1.35, 2], flight: .5, reflect: true, top: [[1320, 548], [1672, 538], [1672, 700], [1400, 700]] },
} as const;
type Table = keyof typeof tables;
type BenchItem = { name: string; model?: string; table: Table; u: number; v: number; h: number; crate: number; slot?: readonly [number, number]; yaw: number };

// Matériel : bas de sa silhouette et hauteur à l'écran sur la photo (voir `fitOnLab`), table, caisse, place dans la caisse
// (repère de la caisse, sinon une place libre est attribuée), orientation, et modèle quand il en reprend un autre.
// Dans une table, l'ordre est l'ordre de départ.
const benchItems: BenchItem[] = [
  { name: 'LeftFlask', table: 'front', u: 4, v: 646, h: 96, crate: 0, slot: [.28, -.3], yaw: 0 },
  { name: 'BlueRack', table: 'front', u: -35, v: 722, h: 120, crate: 0, slot: [.24, .24], yaw: 0 },
  { name: 'Microscope', table: 'front', u: 100, v: 688, h: 205, crate: 0, slot: [-.18, 0], yaw: Math.PI },
  { name: 'Goggles', table: 'front', u: 274, v: 746, h: 64, crate: 1, slot: [.22, -.22], yaw: .25 },
  { name: 'WashBottle', table: 'front', u: 476, v: 637, h: 106, crate: 1, slot: [-.3, -.25], yaw: 0 },
  { name: 'TubeRack', table: 'front', u: 234, v: 640, h: 97, crate: 1, slot: [0, .25], yaw: 0 },
  { name: 'SwabCup', table: 'front', u: 426, v: 641, h: 75, crate: 2, slot: [.05, -.3], yaw: 0 },
  { name: 'ClearFlask', table: 'front', u: 313, v: 656, h: 85, crate: 2, slot: [.28, .2], yaw: 0 },
  { name: 'BlueFlask', table: 'front', u: 365, v: 638, h: 116, crate: 2, slot: [-.2, .12], yaw: 0 },
  // Paillasse du milieu.
  { name: 'MiddleSpray', model: 'SprayBottle', table: 'middle', u: 572, v: 484, h: 48, crate: 0, yaw: 0 },
  { name: 'MiddleRed', model: 'RedFlask', table: 'middle', u: 530, v: 487, h: 53, crate: 0, yaw: 0 },
  { name: 'MiddleYellow', model: 'YellowBeaker', table: 'middle', u: 482, v: 487, h: 40, crate: 0, yaw: 0 },
  { name: 'MiddleBlue', model: 'BlueBeaker', table: 'middle', u: 505, v: 487, h: 35, crate: 0, yaw: 0 },
  { name: 'MiddleTall', model: 'LeftFlask', table: 'middle', u: 546, v: 486, h: 50, crate: 0, yaw: 0 },
  { name: 'MiddleTubes', model: 'SmallRack', table: 'middle', u: 684, v: 468, h: 28, crate: 0, yaw: 0 },
  { name: 'MiddleScope', model: 'Microscope', table: 'middle', u: 622, v: 482, h: 85, crate: 0, yaw: Math.PI - .3 },
  // Paillasse de droite.
  { name: 'RightRed', model: 'RedFlask', table: 'right', u: 1124, v: 481, h: 57, crate: 1, yaw: 0 },
  { name: 'RightBlue', model: 'BlueFlask', table: 'right', u: 1102, v: 480, h: 36, crate: 1, yaw: 0 },
  { name: 'RightTall', model: 'LeftFlask', table: 'right', u: 1142, v: 481, h: 56, crate: 1, yaw: 0 },
  { name: 'RightRack', model: 'BlueRack', table: 'right', u: 1172, v: 480, h: 34, crate: 1, yaw: 0 },
  { name: 'RightEmpty', model: 'EmptyRack', table: 'right', u: 1214, v: 486, h: 36, crate: 1, yaw: 0 },
  { name: 'RightScope', model: 'Microscope', table: 'right', u: 1063, v: 460, h: 64, crate: 1, yaw: 0 },
  // Comptoir du fond, à droite.
  { name: 'BackScope', model: 'Microscope', table: 'back', u: 1437, v: 448, h: 65, crate: 2, yaw: 0 },
  { name: 'BackAmber', model: 'AmberRack', table: 'back', u: 1364, v: 437, h: 30, crate: 2, yaw: 0 },
  { name: 'BackFlask', model: 'AmberFlask', table: 'back', u: 1398, v: 439, h: 30, crate: 2, yaw: 0 },
  { name: 'BackWash', model: 'WashBottle', table: 'back', u: 1476, v: 455, h: 51, crate: 2, yaw: 0 },
  { name: 'BackBlue', model: 'BlueFlask', table: 'back', u: 1505, v: 458, h: 49, crate: 2, yaw: 0 },
  { name: 'BackRack', model: 'EmptyRack', table: 'back', u: 1545, v: 464, h: 55, crate: 2, yaw: 0 },
  // Comptoir de droite, au premier plan. Au bord de l'image générée, la perspective est moins régulière : repères
  // corrigés d'après la superposition de la 3D à la photo (décalés de 15 px vers la droite, hauteurs réduites d'un dixième).
  { name: 'CornerBlue', model: 'BlueFlask', table: 'corner', u: 1520, v: 578, h: 66, crate: 2, yaw: 0 },
  { name: 'CornerRed', model: 'RedFlask', table: 'corner', u: 1555, v: 579, h: 66, crate: 2, yaw: 0 },
  { name: 'CornerBottle', model: 'WashBottle', table: 'corner', u: 1589, v: 574, h: 70, crate: 2, yaw: 0 },
  { name: 'CornerRack', model: 'EmptyRack', table: 'corner', u: 1602, v: 593, h: 57, crate: 2, yaw: 0 },
];
// Places libres au fond des caisses (repère de la caisse), attribuées dans l'ordre aux objets qui n'en ont pas.
const crateSlots = [[-.55, -.42], [.55, -.42], [0, .45], [-.55, .42], [.55, .42], [0, -.45], [-.6, 0], [.6, 0], [-.3, .2], [.3, -.2], [.3, .2], [-.3, -.2], [0, 0]] as const;
// Symétrie par rapport au plan de la paillasse : reflets du matériel dans son vernis.
const benchMirror = new Matrix4().set(1, 0, 0, 0, 0, -1, 0, 2 * lab.bench, 0, 0, 1, 0, 0, 0, 0, 1);

// Caisses dans l'allée, d'après la photo avec caisses : milieu de l'arête avant de leur base, hauteur à l'écran (jusqu'à
// l'arête arrière du dessus), orientation et côté du couvercle posé.
const crateSpots = [
  { u: 800, v: 672, h: 175, yaw: .25, lid: -1 },
  { u: 990, v: 872, h: 272, yaw: -.05, lid: 1 },
  { u: 1255, v: 712, h: 197, yaw: -.35, lid: 1 },
] as const;
// Caisse du modèle : du dessous des patins au bord supérieur, et du centre au fond intérieur, en unités du modèle.
const crateBody = { height: 1.79, depth: 1.84, floor: -.85, rim: .73, base: 1.06 } as const;
// Caisses alignées devant le conteneur, puis rangées du fond vers la porte.
const lineup = (k: number) => new Vector3(yard.x + (k - 1) * 1.7, 0, -.4);
const stowed = (k: number) => new Vector3(yard.x, 0, containerZ - 1.35 + k * 1.35);
const crateLoaded = .7;

// Objet posé sur la paillasse : le pixel relevé est le bas de sa silhouette, soit le milieu de l'arête avant de sa base,
// et la hauteur relevée va de là au point le plus haut à l'écran, profondeur comprise (vue d'en haut, des lunettes couchées
// paraissent plus hautes qu'elles ne le sont). On cherche l'échelle qui donne cette hauteur, d'après les sommets du modèle,
// puis l'origine du modèle.
function fitOnLab(object: Object3D, u: number, v: number, pixels: number) {
  const box = new Box3().setFromObject(object);
  const { point } = onLab(u, v, lab.bench);
  const middle = (box.min.x + box.max.x) / 2;
  const vertices: Vector3[] = [];
  object.traverse((part) => {
    if (!(part instanceof Mesh)) return;
    const position = (part.geometry as BufferGeometry).attributes.position;
    for (let i = 0; i < position.count; i += 3) vertices.push(new Vector3().fromBufferAttribute(position, i).applyMatrix4(part.matrixWorld));
  });
  const corner = new Vector3();
  const top = (scale: number) => vertices.reduce((row, vertex) =>
    Math.min(row, labRow(corner.set(vertex.x - middle, vertex.y, vertex.z - box.max.z).multiplyScalar(scale).add(point))), Infinity);
  let low = .01, high = 20;
  for (let i = 0; i < 40; i += 1) {
    const scale = (low + high) / 2;
    if (top(scale) < v - pixels) high = scale; else low = scale;
  }
  return { start: point.clone().sub(new Vector3(middle, 0, box.max.z).multiplyScalar(low)), scale: low };
}

// Caisse posée au sol, vue d'en haut : à l'écran, elle s'étend de l'arête avant de sa base à l'arête arrière de son dessus.
// On cherche la hauteur qui donne cette étendue, puis on recule la caisse de sa demi-profondeur, dans l'axe du regard.
function crateOnLab(u: number, v: number, pixels: number) {
  const { point } = onLab(u, v, 0);
  const back = point.clone().sub(labOrigin).setY(0).normalize();
  const top = new Vector3();
  let low = .1, high = 2;
  for (let i = 0; i < 30; i += 1) {
    const height = (low + high) / 2;
    top.copy(point).addScaledVector(back, height * crateBody.depth / crateBody.height).setY(height);
    if (labRow(top) < v - pixels) high = height; else low = height;
  }
  return { point, back, height: low };
}

function shade(scene: Object3D) {
  scene.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    object.castShadow = true;
    object.receiveShadow = true;
    const material = object.material as MeshStandardMaterial;
    material.envMapIntensity = .55;
    if (material.transparent) material.depthWrite = false;
    // Le verre doit rester lisible sur le fond sombre de l'atelier.
    if (material.name === 'Laboratory glass') {
      material.envMapIntensity = 1.8;
      material.opacity = .42;
    }
  });
  return scene;
}

function prepareTruck(source: Object3D) {
  const model = shade(source.clone(true));
  model.updateMatrixWorld(true);
  // Chaque groupe de roues reçoit un pivot sur son essieu pour tourner pendant le trajet.
  const groups: Object3D[] = [];
  model.traverse((object) => {
    if (object.name.startsWith('kerek') && !object.parent?.name.startsWith('kerek')) groups.push(object);
  });
  const wheels = groups.map((node) => {
    const pivot = new Group();
    pivot.position.copy(new Box3().setFromObject(node).getCenter(new Vector3()));
    model.add(pivot);
    pivot.updateMatrixWorld(true);
    pivot.attach(node);
    return pivot;
  });
  // Remet le camion dans l'axe +X, à l'échelle, la sellette à l'origine de l'attelage.
  const heading = Math.atan2(truckModel.forward.z, truckModel.forward.x);
  const fifth = truckModel.fifthWheel.clone().applyAxisAngle(up, heading).multiplyScalar(truckModel.scale);
  model.rotation.y = heading;
  model.scale.setScalar(truckModel.scale);
  model.position.set(-fifth.x, 0, -fifth.z);
  const root = new Group();
  root.add(model);
  return { root, wheels, axle: new Vector3(truckModel.forward.z, 0, -truckModel.forward.x) };
}

function roadGeometry() {
  const left: [number, number][] = [];
  const right: [number, number][] = [];
  for (let s = -10; s <= roadLength + 40; s += 1) {
    const a = roadPoint(s), b = roadPoint(s + .5);
    const length = Math.hypot(b.x - a.x, b.z - a.z) || 1;
    const nx = -(b.z - a.z) / length, nz = (b.x - a.x) / length;
    left.push([a.x + nx * road.width / 2, a.z + nz * road.width / 2]);
    right.push([a.x - nx * road.width / 2, a.z - nz * road.width / 2]);
  }
  const shape = new Shape();
  shape.moveTo(...left[0]);
  for (const point of [...left.slice(1), ...right.reverse()]) shape.lineTo(...point);
  shape.closePath();
  // Extrudée vers le bas : sa face avant forme le bandeau noir de la vue de profil.
  return new ExtrudeGeometry(shape, { depth: road.depth, bevelEnabled: false, curveSegments: 1 });
}

function roadMarkings() {
  const matrices: Matrix4[] = [];
  for (let s = -8; s < roadLength + 30; s += 7) {
    const a = roadPoint(s), b = roadPoint(s + 3.4);
    const rotation = new Quaternion().setFromAxisAngle(up, -Math.atan2(b.z - a.z, b.x - a.x));
    matrices.push(new Matrix4().compose(new Vector3((a.x + b.x) / 2, .012, (a.z + b.z) / 2), rotation, new Vector3(1, 1, 1)));
  }
  const mesh = new InstancedMesh(new BoxGeometry(3.4, .02, .22), new MeshStandardMaterial({ color: '#cfcdc6', roughness: .85 }), matrices.length);
  matrices.forEach((matrix, i) => mesh.setMatrixAt(i, matrix));
  return mesh;
}

function Spreader({ length, width, cable }: { length: number; width: number; cable: number }) {
  return <>
    <mesh castShadow><boxGeometry args={[length, .22, width]} /><meshStandardMaterial color="#e2b22c" roughness={.55} metalness={.35} /></mesh>
    {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([x, z]) => <mesh key={`${x}${z}`} position={[x * (length / 2 - .3), cable / 2, z * (width / 2 - .2)]}>
      <cylinderGeometry args={[.025, .025, cable, 6]} /><meshStandardMaterial color="#2a2d31" roughness={.6} metalness={.6} />
    </mesh>)}
  </>;
}

// Sur un objet fin (tube, bécher), three.js ajoute à la rugosité celle due à la courbure à l'écran : l'image vue au
// travers du verre se floute et la couleur des solutions se dilue. La transmission garde ici la rugosité du verre.
// Devant la photo, le verre n'ajouterait que ses reflets : sur un fond clair (mur, meubles), la partie vide d'un flacon
// soulevé disparaissait. Il garde un corps léger, plus dense sur les bords vus en biais, comme l'épaisseur du verre :
// un contour un peu plus sombre que le fond clair, un peu plus clair que le fond sombre.
function sharpTransmission(shader: { fragmentShader: string }) {
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <transmission_fragment>', ShaderChunk.transmission_fragment.replace('n, v, material.roughness,', 'n, v, roughnessFactor,'))
    .replace('#include <opaque_fragment>', `#include <opaque_fragment>
      float glassEdge = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 2.0);
      float glassBody = (0.06 + 0.5 * glassEdge) * (1.0 - gl_FragColor.a);
      gl_FragColor.rgb += vec3(0.6, 0.68, 0.72) * glassBody * 0.35;
      gl_FragColor.a += glassBody;`);
}

// Reflet dans le vernis : il s'estompe en s'éloignant du point de contact, sur 15 cm sous le plan de la paillasse.
function fadeReflection(shader: { vertexShader: string; fragmentShader: string }) {
  shader.vertexShader = shader.vertexShader
    .replace('void main() {', 'varying float vDrop;\nvoid main() {')
    .replace('#include <project_vertex>', '#include <project_vertex>\nvDrop = (modelMatrix * vec4(transformed, 1.0)).y;');
  shader.fragmentShader = shader.fragmentShader
    .replace('void main() {', 'varying float vDrop;\nvoid main() {')
    .replace('#include <opaque_fragment>', `#include <opaque_fragment>\ngl_FragColor.a *= clamp(1.0 - (${lab.bench.toFixed(3)} - vDrop) / 0.15, 0.0, 1.0);`);
}

// Collecte puis chargement : le matériel 3D prend la place de celui de la photo et s'envole dans les caisses posées
// dans l'allée, dont les couvercles se ferment ; les caisses rejoignent ensuite la cour, entrent dans le conteneur,
// qui se ferme puis est hissé hors champ.
function Collection() {
  const assets = useSceneAssets();
  const benchFile = useGLTF(sceneLoads.bench[0], false, true);
  const items = useMemo(() => {
    const root = benchFile.scene.clone(true);
    root.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      const material = object.material as MeshPhysicalMaterial;
      // Le verre transmet la lumière : la photo reste visible au travers, il ne porte pas d'ombre. Ses reflets restent
      // mesurés, pour ne pas blanchir les solutions ; celles-ci ne reflètent presque rien.
      const clear = material.transmission > 0;
      material.envMapIntensity = clear ? .22 : material.vertexColors ? .25 : .9;
      // Le tone mapping délave les couleurs vives et fortement éclairées : solutions et verre (qui les laisse voir) y
      // échappent, pour garder les couleurs franches de la photo.
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
    const used = [0, 0, 0];
    return benchItems.map((item) => {
      // Chaque objet est une copie de son modèle (géométries et matériaux partagés).
      const object = (root.getObjectByName(item.model ?? item.name) as Object3D).clone(true);
      const table = tables[item.table];
      const order = benchItems.filter((other) => other.table === item.table);
      const k = order.indexOf(item);
      const leave = table.leave[0] + k * (table.leave[1] - table.leave[0] - table.flight) / Math.max(1, order.length - 1);
      const slot = item.slot ?? crateSlots[used[item.crate]++ % crateSlots.length];
      // Calé tel qu'il est orienté sur la photo.
      object.position.set(0, 0, 0);
      object.rotation.set(0, item.yaw, 0);
      object.scale.setScalar(1);
      object.updateMatrixWorld(true);
      const { start, scale } = fitOnLab(object, item.u, item.v, item.h);
      if (!table.reflect) object.traverse((part) => { part.castShadow = false; });
      // Reflet dans le vernis de la paillasse, comme sur la photo : copie retournée sous le plan de travail, translucide,
      // limitée au plateau par le pochoir qu'écrit le plan d'ombre. Le verre n'y paraît pas, les solutions si.
      const mirror = object.clone(true);
      const tints: MeshPhysicalMaterial[] = [];
      mirror.traverse((part) => {
        if (!(part instanceof Mesh)) return;
        const source = part.material as MeshPhysicalMaterial;
        if (source.transmission > 0) { part.visible = false; return; }
        const tint = source.clone();
        Object.assign(tint, { transparent: true, depthWrite: false, stencilWrite: true, stencilRef: 1, stencilFunc: EqualStencilFunc, stencilWriteMask: 0 });
        tint.onBeforeCompile = fadeReflection;
        tint.customProgramCacheKey = () => 'bench-reflection';
        Object.assign(part, { material: tint, castShadow: false, receiveShadow: false, renderOrder: 2 });
        tints.push(tint);
      });
      mirror.matrixAutoUpdate = false;
      return { ...item, object, mirror, tints, start, scale, slot, leave, flight: table.flight, reflect: table.reflect };
    });
  }, [benchFile.scene]);
  const crates = useMemo(() => {
    // La perspective de l'image générée n'est pas tout à fait régulière : chaque caisse garde la taille trouvée sur la photo,
    // puis les trois prennent la même en rejoignant la cour.
    return crateSpots.map((spot, k) => {
      const { point, back, height } = crateOnLab(spot.u, spot.v, spot.h);
      const root = assets.crate.clone(true);
      const scale = height / crateBody.height;
      const at = point.clone().addScaledVector(back, crateBody.depth * scale / 2);
      // Elles arrivent de derrière le spectateur, glissées au sol jusqu'à leur place.
      const from = labOrigin.clone().addScaledVector(back, -.3);
      return { spot, root, lid: root.getObjectByName('CrateLid'), at, from, scale, lineup: lineup(k), stowed: stowed(k) };
    });
  }, [assets.crate]);
  // Ombres portées sur la paillasse de la photo : un plan à sa hauteur, limité à son plateau (éventail de triangles).
  const benchShadow = useMemo(() => new BufferGeometry().setFromPoints(
    Object.values(tables).flatMap(({ top }) => top.slice(1, -1).flatMap((corner, i) => [top[0], corner, top[i + 2]])).map(([u, v]) => onLab(u, v, lab.bench + .002).point),
  ), []);
  useEffect(() => () => benchShadow.dispose(), [benchShadow]);
  const doors = useMemo(() => ({ left: assets.container.getObjectByName('DoorLeft'), right: assets.container.getObjectByName('DoorRight') }), [assets.container]);
  const container = useRef<Group>(null);
  const spreader = useRef<Group>(null);
  const benchPlane = useRef<Mesh>(null);
  const floor = useRef<ShadowMaterial>(null);
  const probe = useMemo(() => ({ slot: new Vector3(), above: new Vector3(), lifted: new Vector3(), front: new Vector3(yard.x, 0, -1.8) }), []);

  useFrame(() => {
    if (!container.current || !spreader.current || !benchPlane.current || !floor.current) return;
    const x = at(useFilm.getState().progress);
    const leave = seg(x, collect.leave[0], collect.leave[1]);
    benchPlane.current.visible = x < collect.fade[1];
    // Sur la photo, les caisses posent au sol par une ombre courte et nette ; dans la cour, elle s'adoucit.
    floor.current.opacity = mix(.34, .18, leave);

    // Caisses : elles glissent jusqu'à l'allée, se ferment, rejoignent la cour en grandissant, puis entrent dans le conteneur.
    crates.forEach((crate, k) => {
      const landing = collect.crates[0] + k * .1;
      const land = seg(x, landing, landing + .32);
      const close = seg(x, collect.close[0] + k * .1, collect.close[0] + k * .1 + .18);
      const enter = seg(x, 3 + k * .2, 3.32 + k * .2);
      const scale = mix(crate.scale, crateLoaded, leave);
      const position = crate.root.position.copy(crate.from).lerp(crate.at, land).lerp(crate.lineup, leave);
      if (enter > 0) position.lerp(probe.front, Math.min(1, enter * 2)).lerp(crate.stowed, Math.max(0, enter * 2 - 1));
      position.y = crateBody.base * scale;
      crate.root.rotation.y = mix(crate.spot.yaw, 0, leave);
      crate.root.scale.setScalar(scale);
      crate.root.visible = x > landing - .01 && x < 4;
      // Couvercle posé contre la caisse, du côté de la photo, puis soulevé et refermé.
      const side = crate.spot.lid;
      crate.lid?.position.set(mix(side * 1.36, 0, close), mix(-.2, .79, close) + Math.sin(close * Math.PI) * .55, mix(.12, 0, close));
      crate.lid?.rotation.set(0, 0, mix(side * -1.15, 0, close));
      crate.root.updateMatrixWorld();
    });

    // Matériel : il se soulève de sa table, passe au-dessus de sa caisse, puis y descend ; un objet après l'autre dans chaque
    // table, les tables par vagues intercalées.
    items.forEach((item) => {
      const crate = crates[item.crate];
      const t = clamp((x - item.leave) / item.flight);
      item.object.visible = x > collect.swap[0] - .02 && x < collect.close[0] + item.crate * .1 + .18;
      item.mirror.visible = false;
      if (!item.object.visible) return;
      const slot = crate.root.localToWorld(probe.slot.set(item.slot[0], crateBody.floor, item.slot[1]));
      const above = crate.root.localToWorld(probe.above.set(item.slot[0], crateBody.rim + .45, item.slot[1]));
      const lift = seg(t, 0, .22), carry = seg(t, .22, .78), drop = seg(t, .78, 1);
      const position = item.object.position.copy(item.start).lerp(probe.lifted.copy(item.start).setY(item.start.y + .14), lift);
      if (carry > 0) {
        position.lerp(above, carry);
        position.y += Math.sin(carry * Math.PI) * .2;
      }
      if (drop > 0) position.copy(above).lerp(slot, drop);
      item.object.rotation.set(Math.sin(carry * Math.PI) * .25, item.yaw + carry * 1.3, 0);
      item.object.scale.setScalar(item.scale);
      // Le reflet s'efface à mesure que l'objet quitte la paillasse.
      const shine = 1 - clamp((position.y - lab.bench) / .2);
      if (!item.reflect || shine <= .01) return;
      item.object.updateMatrixWorld();
      item.mirror.matrix.multiplyMatrices(benchMirror, item.object.matrixWorld);
      item.mirror.visible = true;
      item.tints.forEach((tint) => { tint.opacity = .42 * shine; });
    });

    // Le conteneur arrive par la droite, avale les caisses, se ferme, puis est hissé hors champ.
    const hoist = seg(x, 4.15, 4.45);
    container.current.visible = x > 2.45 && x < 4.5;
    container.current.position.set(yard.x + 12 * (1 - seg(x, 2.5, 2.9)), 16 * hoist, containerZ);
    container.current.rotation.y = -Math.PI / 2 * hoist;
    const open = Math.PI * .56 * (seg(x, 2.75, 3) - seg(x, 3.7, 4));
    doors.left?.rotation.set(0, -open, 0);
    doors.right?.rotation.set(0, open, 0);
    spreader.current.visible = x > 3.95 && x < 4.5;
    spreader.current.position.set(yard.x, 2.9 + 16 * hoist + 12 * (1 - seg(x, 4, 4.15)), containerZ);
    spreader.current.rotation.y = -Math.PI / 2 * hoist;
  });

  return <>
    {items.map((item) => <primitive key={item.name} object={item.object} dispose={null} />)}
    {items.map((item) => <primitive key={`${item.name}-mirror`} object={item.mirror} dispose={null} />)}
    {crates.map((crate, k) => <primitive key={k} object={crate.root} dispose={null} />)}
    <mesh ref={benchPlane} geometry={benchShadow} receiveShadow renderOrder={1}>
      <shadowMaterial transparent opacity={.22} depthWrite={false} side={DoubleSide} stencilWrite stencilRef={1} stencilFunc={AlwaysStencilFunc} stencilZPass={ReplaceStencilOp} />
    </mesh>
    <group ref={container}><primitive object={assets.container} dispose={null} /></group>
    <group ref={spreader}><Spreader length={2.5} width={5.2} cable={26} /></group>
    <mesh position={[yard.x, .002, containerZ / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} /><shadowMaterial ref={floor} transparent opacity={.18} depthWrite={false} />
    </mesh>
  </>;
}

// Masque marine de la photo (film.css, `.film-opening::after`), reporté sur la 3D posée dessus : sans lui, le matériel
// resterait clair là où la photo s'assombrit, côté texte. Il ne fait qu'assombrir ce que la scène a déjà dessiné, sans
// toucher à sa transparence : la photo, sous le canevas, garde son propre masque.
const gradeShader = {
  vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }',
  fragmentShader: `
    uniform float strength; uniform float narrow; varying vec2 vUv;
    float stops(float t, vec4 at, vec4 alpha) {
      if (t <= at.x) return alpha.x;
      if (t <= at.y) return mix(alpha.x, alpha.y, (t - at.x) / (at.y - at.x));
      if (t <= at.z) return mix(alpha.y, alpha.z, (t - at.y) / (at.z - at.y));
      if (t <= at.w) return mix(alpha.z, alpha.w, (t - at.z) / (at.w - at.z));
      return alpha.w;
    }
    void main() {
      float side = stops(vUv.x, vec4(0., .28, .48, .68), vec4(.949, .702, .251, 0.));
      float bottom = stops(vUv.y, vec4(0., .32, 1., 1.), vec4(.8, 0., 0., 0.));
      float wide = 1. - (1. - side) * (1. - bottom);
      float top = 1. - vUv.y;
      float tall = top < .38 ? stops(top, vec4(0., .2, .38, .38), vec4(.8, .2, 0., 0.)) : stops(top, vec4(.38, .58, 1., 1.), vec4(0., .6, .96, .96));
      float shade = mix(wide, tall, narrow) * strength;
      gl_FragColor = vec4(vec3(3., 27., 78.) / 255. * shade, shade);
    }`,
};
function LabGrade() {
  const shade = useRef<ShaderMaterial>(null);
  const quad = useRef<Mesh>(null);
  const shader = useMemo(() => ({ ...gradeShader, uniforms: { strength: { value: 0 }, narrow: { value: 0 } } }), []);
  useFrame(({ size }) => {
    if (!quad.current || !shade.current) return;
    const x = at(useFilm.getState().progress);
    const strength = openingMask(x, size.width / size.height) * (1 - seg(x, ...collect.fade));
    quad.current.visible = strength > .001;
    shade.current.uniforms.strength.value = strength;
    // Même seuil que la feuille de style : sous 1000 px, le masque devient vertical.
    shade.current.uniforms.narrow.value = size.width < 1000 ? 1 : 0;
  });
  return <mesh ref={quad} frustumCulled={false} renderOrder={1000}>
    <planeGeometry args={[2, 2]} />
    <shaderMaterial ref={shade} args={[shader]} transparent depthTest={false} depthWrite={false}
      blending={CustomBlending} blendSrc={DstAlphaFactor} blendDst={OneMinusSrcAlphaFactor} blendSrcAlpha={ZeroFactor} blendDstAlpha={OneFactor} />
  </mesh>;
}

function Convoy() {
  const [truckFile, chassisFile, containerFile] = useGLTF(sceneLoads.convoy, false, true);
  const truck = useMemo(() => prepareTruck(truckFile.scene), [truckFile.scene]);
  const trailer = useMemo(() => {
    const scene = shade(chassisFile.scene.clone(true));
    return { scene, axles: ['AxleFront', 'AxleRear'].map((name) => scene.getObjectByName(name)).filter((axle): axle is Object3D => Boolean(axle)) };
  }, [chassisFile.scene]);
  const container = useMemo(() => shade(containerFile.scene.clone(true)), [containerFile.scene]);
  const surface = useMemo(() => roadGeometry(), []);
  const markings = useMemo(() => roadMarkings(), []);
  const joints = useRef<{ wheels: Object3D[]; axle: Vector3; axles: Object3D[] }>({ wheels: [], axle: new Vector3(), axles: [] });
  const rig = useRef<Group>(null);
  const towed = useRef<Group>(null);
  const load = useRef<Group>(null);
  const spreader = useRef<Group>(null);

  useEffect(() => {
    joints.current = { wheels: truck.wheels, axle: truck.axle, axles: trailer.axles };
  }, [truck, trailer]);
  useEffect(() => () => {
    surface.dispose();
    markings.geometry.dispose();
    (markings.material as MeshStandardMaterial).dispose();
  }, [surface, markings]);

  useFrame(() => {
    if (!rig.current || !towed.current || !load.current || !spreader.current) return;
    const x = at(useFilm.getState().progress);
    const s = travel(x);
    // Le tracteur suit la route devant la sellette, la remorque pivote derrière elle.
    const king = roadPoint(s), front = roadPoint(s + 3.75), back = roadPoint(s - 4);
    rig.current.position.set(king.x, 0, king.z);
    rig.current.rotation.y = -Math.atan2(front.z - king.z, front.x - king.x);
    towed.current.position.set(king.x, 0, king.z);
    towed.current.rotation.y = -Math.atan2(king.z - back.z, king.x - back.x);
    const { wheels, axle, axles } = joints.current;
    for (const pivot of wheels) pivot.quaternion.setFromAxisAngle(axle, s / truckModel.wheelRadius);
    for (const trailerAxle of axles) trailerAxle.rotation.set(0, 0, -s / .5);
    // Le conteneur hissé dans l'atelier redescend sur la remorque quand la caméra arrive, puis le palonnier remonte.
    const drop = (1 - seg(x, 4.4, 4.7)) * 12;
    load.current.position.set(-2.2, 1.25 + drop, 0);
    spreader.current.position.set(-2.2, 4.11 + drop + seg(x, 4.7, 4.89) * 16, 0);
    spreader.current.visible = x < 4.92;
  });

  return <>
    <mesh geometry={surface} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
      <meshStandardMaterial color="#0c0e11" roughness={.92} />
    </mesh>
    <primitive object={markings} />
    <group ref={rig}><primitive object={truck.root} dispose={null} /></group>
    <group ref={towed}>
      <primitive object={trailer.scene} dispose={null} />
      <group ref={load} rotation={[0, -Math.PI / 2, 0]}><primitive object={container} dispose={null} /></group>
      <group ref={spreader}><Spreader length={5.2} width={2.5} cable={26} /></group>
    </group>
  </>;
}

type Shot = { x: number; y: number; z: number; distance: number; elevation: number; azimuth: number };
const blend = (a: Shot, b: Shot, t: number): Shot => ({
  x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), z: mix(a.z, b.z, t),
  distance: mix(a.distance, b.distance, t), elevation: mix(a.elevation, b.elevation, t), azimuth: mix(a.azimuth, b.azimuth, t),
});

// Une seule caméra enchaîne quatre plans : la photo du laboratoire (sa perspective et le cadrage de l'écran, repris
// tels quels), trois-quarts du conteneur, profil du camion, vue du ciel.
function CameraRig() {
  const key = useRef<DirectionalLight>(null);
  const rim = useRef<DirectionalLight>(null);
  const target = useMemo(() => new Vector3(), []);
  const { invalidate } = useThree();
  useEffect(() => useFilm.subscribe((state) => {
    const x = at(state.progress);
    if (sceneShown(x) && !(state.exitReady && exitCovers(x))) invalidate();
  }), [invalidate]);

  useFrame(({ camera, size }) => {
    if (!key.current || !rim.current) return;
    const x = at(useFilm.getState().progress);
    const aspect = size.width / size.height;
    const frame = framing(aspect);
    const wide = aspect > 1;
    const king = roadPoint(travel(x));
    const shift = (wide ? 4 + 3 * seg(x, 4.81, 5.24) : 0) * (1 - seg(x, 5.29, 5.95));
    const leave = seg(x, collect.leave[0], collect.leave[1]);
    // Photo : la caméra est à hauteur d'œil au-dessus du laboratoire, inclinée comme la photo ; sa cible est 3 m devant.
    const photo: Shot = { x: labOrigin.x, y: lab.eye - 3 * Math.sin(labPitch), z: labOrigin.z - 3 * Math.cos(labPitch), distance: 3, elevation: labPitch, azimuth: 0 };
    // Sur un écran large, la cible glisse vers la gauche de l'image : le conteneur laisse la place au texte du chapitre.
    // Chargement : la caméra tourne autour de la cour, d'un trois-quarts haut, presque de face, vers un trois-quarts plus
    // bas ; elle s'avance pendant que les caisses entrent, puis recule quand les portes se ferment.
    const turn = seg(x, 2.6, 4.1);
    const around = mix(1.05, .42, turn);
    const aside = wide ? mix(.8, 1.3, turn) : 0;
    const loading: Shot = {
      x: yard.x - aside * Math.cos(around), y: 1.4, z: containerZ / 2 + aside * Math.sin(around),
      distance: frame.loading * mix(1.18, .92, seg(x, 2.9, 3.7)) * mix(1, 1.1, seg(x, 3.7, 4.1)),
      elevation: mix(.36, .15, seg(x, 2.7, 4)), azimuth: around,
    };
    const side: Shot = { x: king.x - shift, y: 2, z: king.z, distance: frame.side, elevation: .04, azimuth: 0 };
    // Vue du ciel, la route se place dans le couloir du navire filmé (voir deckLane).
    const top: Shot = { x: king.x + laneOffset(aspect), y: 0, z: king.z, distance: frame.top, elevation: Math.PI / 2, azimuth: 0 };
    // La caméra part vers la route pendant que le conteneur monte encore : pas de temps mort sur un décor vide.
    const shot = blend(blend(blend(photo, loading, leave), side, seg(x, 4.18, 4.65)), top, seg(x, 5.35, 6.17));
    const { distance, elevation, azimuth } = shot;
    target.set(shot.x, shot.y, shot.z);
    camera.position.set(
      target.x + Math.sin(azimuth) * Math.cos(elevation) * distance,
      target.y + Math.sin(elevation) * distance,
      target.z + Math.cos(azimuth) * Math.cos(elevation) * distance,
    );
    camera.up.set(-Math.sin(azimuth) * Math.sin(elevation), Math.cos(elevation), -Math.cos(azimuth) * Math.sin(elevation));
    camera.lookAt(target);
    const lens = camera as PerspectiveCamera;
    lens.fov = mix(lab.fov, fov, leave);
    // Tant que la photo est là, la caméra rend la portion de la photo affichée à l'écran (mêmes coupes que l'image) ;
    // elle retrouve son cadre normal en reculant.
    if (leave < 1) {
      const view = labFrame(size.width, size.height, x);
      const fullWidth = mix(view.w, size.width, leave), fullHeight = mix(view.h, size.height, leave);
      lens.aspect = fullWidth / fullHeight;
      lens.setViewOffset(fullWidth, fullHeight, mix(-view.left, 0, leave), mix(-view.top, 0, leave), size.width, size.height);
    } else {
      if (lens.view) lens.clearViewOffset();
      lens.aspect = aspect;
    }
    lens.updateProjectionMatrix();

    // Au laboratoire, le soleil entre haut par les fenêtres de gauche : ombres courtes, qui restent dans l'allée de la photo ;
    // dehors, la lumière vient de l'avant gauche.
    key.current.position.set(target.x + mix(-5, -10, leave), target.y + mix(14, 18, leave), target.z + mix(-2, 14, leave));
    key.current.target.position.copy(target);
    key.current.target.updateMatrixWorld();
    rim.current.position.set(target.x + 7, target.y + 6, target.z - 12);
    rim.current.target.position.copy(target);
    rim.current.target.updateMatrixWorld();
  });

  return <>
    <directionalLight ref={key} intensity={2.1} color="#fff6e7" castShadow
      shadow-mapSize={[1024, 1024]} shadow-camera-left={-9} shadow-camera-right={9}
      shadow-camera-top={9} shadow-camera-bottom={-9} shadow-camera-near={.1} shadow-camera-far={60}
      shadow-bias={-.0002} shadow-normalBias={.02} />
    <directionalLight ref={rim} intensity={.9} color="#a9c8ff" />
  </>;
}

function Environment() {
  useRoomEnvironment();
  return <>
    <ambientLight intensity={.22} />
    <hemisphereLight args={['#eef3f8', '#3d3a35', .6]} />
  </>;
}

// Les matériaux (verre, solutions, reflets) sont compilés pendant l'écran de chargement, objets cachés compris : sans quoi
// leur première apparition, au raccord avec la photo, figerait l'image le temps de la compilation.
function Ready({ onReady }: { onReady: () => void }) {
  const getState = useThree((state) => state.get);
  useEffect(() => {
    const { gl, scene, camera, invalidate } = getState();
    const hidden: Object3D[] = [];
    scene.traverse((object) => {
      if (object.visible) return;
      hidden.push(object);
      object.visible = true;
    });
    let live = true;
    gl.compileAsync(scene, camera).catch(() => undefined).finally(() => {
      hidden.forEach((object) => { object.visible = false; });
      if (!live) return;
      onReady();
      invalidate();
    });
    return () => { live = false; };
  }, [onReady, getState]);
  return null;
}

// Verre posé sur la photo : sur un canevas transparent, three.js remplit le fond de son rendu de transmission en blanc
// à 50 %, et le verre paraît laiteux. Ce fond reste ici transparent : à travers le verre, on voit la photo, sous le canevas.
// Ce rendu, qui ne sert qu'aux solutions vues au travers du verre, se fait à mi-résolution : il coûte trois fois moins.
function ClearTransmission() {
  const getState = useThree((state) => state.get);
  useEffect(() => {
    const { gl } = getState();
    gl.transmissionResolutionScale = .5;
    const setClearColor = gl.setClearColor;
    gl.setClearColor = (color, alpha) => color === 0xffffff && alpha === .5 ? setClearColor.call(gl, 0x000000, 0) : setClearColor.call(gl, color, alpha);
    return () => { gl.setClearColor = setClearColor; };
  }, [getState]);
  return null;
}

// Un téléphone à court de mémoire peut retirer le contexte WebGL en plein défilement. La scène se masque
// le temps que le navigateur le rétablisse, sans remplacer le film : la page garde sa longueur.
function ContextGuard({ onLost }: { onLost: (lost: boolean) => void }) {
  const { gl, invalidate } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => { event.preventDefault(); onLost(true); };
    const restored = () => { onLost(false); invalidate(); };
    canvas.addEventListener('webglcontextlost', lost);
    canvas.addEventListener('webglcontextrestored', restored);
    return () => {
      canvas.removeEventListener('webglcontextlost', lost);
      canvas.removeEventListener('webglcontextrestored', restored);
    };
  }, [gl, invalidate, onLost]);
  return null;
}

export default function FilmCanvas(props: { onReady: () => void; onLost: (lost: boolean) => void }) {
  return <Canvas camera={{ position: [labOrigin.x, lab.eye, labOrigin.z], fov: lab.fov }} dpr={[1, 1.5]} frameloop="demand" shadows="soft" gl={{ alpha: true, antialias: true, stencil: true }} fallback={null}>
    <ContextGuard onLost={props.onLost} />
    <ClearTransmission />
    <Environment />
    <CameraRig />
    <Suspense fallback={null}>
      <Collection />
      <LabGrade />
      <Convoy />
      <Ready onReady={props.onReady} />
    </Suspense>
  </Canvas>;
}
