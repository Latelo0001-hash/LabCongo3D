import { Suspense, useEffect, useMemo, useRef } from 'react';
import { addAfterEffect, Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Box3, BufferGeometry, CanvasTexture, DoubleSide, LineBasicMaterial, LineLoop, Mesh, MeshBasicMaterial, PlaneGeometry, Vector3 } from 'three';
import type { DirectionalLight, Object3D, ShadowMaterial } from 'three';
import { photoCamera, prepareBenchMaterials } from '../../src/features/film/photoScene';
import type { PhotoCalibration } from '../../src/features/film/photoScene';
import { sceneLoads, useSceneAssets } from '../../src/features/film/sceneAssets';
import { useRoomEnvironment } from '../../src/features/film/useRoomEnvironment';

// Installation du matériel dans le laboratoire de l'école (photo générée par l'utilisateur, 1920 × 1072) : les caisses
// de la photo s'ouvrent, le matériel s'élève et se pose sur les paillasses. La collecte du film d'ouverture, à l'envers.
// Rendu image par image (render.mjs), puis intégré au film de l'école comme vidéo pilotée par le défilement.

// Calage : point de fuite des paillasses (x 1052, horizon 438), œil à 1,55 m d'après le rapport plateau / pied des
// paillasses (plateau à 0,9 m). Le champ n'a pas de mesure directe : 48° (vertical), vérifié à l'œil.
const photo: PhotoCalibration = { width: 1920, height: 1072, fov: 48, horizon: 438, eye: 1.55, bench: .9, origin: new Vector3() };
const vanishing = { u: 1052, v: 438 };
const camera = photoCamera(photo);
// Axe de la salle : la direction du point de fuite, à l'horizontale ; la caméra regarde un peu à gauche de cet axe.
const axis = new Vector3((vanishing.u - photo.width / 2) / camera.focal, 0, -1 / Math.cos(camera.pitch)).normalize();
const yaw = Math.atan2(-axis.x, -axis.z);

// Caisses de la photo : bords de la face avant, bas et haut de cette face, arête arrière du dessus (pixels). Le pied de
// la caisse du fond est caché par celle du milieu : estimé d'après les proportions des deux autres.
const photoCrates = [
  { left: 922.5, right: 1147.5, bottom: 995, front: 820, back: 727.5 },
  { left: 987.5, right: 1092.5, bottom: 707.5, front: 622.5, back: 596 },
  { left: 1007, right: 1078, bottom: 613, front: 556, back: 544 },
] as const;

// Destinations du matériel : bas de la silhouette sur le plateau et hauteur à l'écran (pixels), caisse de départ, place
// dans la caisse (repère de la caisse), orientation propre, avancement où l'objet est posé.
// La salle s'équipe de gauche à droite : sur téléphone, le cadre (un quart de la largeur) glisse dans le même sens et
// arrive sur chaque paillasse quand son matériel s'y pose (`pan` de l'installation dans SchoolFilm).
type Spot = { name: string; model: string; u: number; v: number; h: number; crate: number; slot: readonly [number, number]; yaw: number; land: number };
const spots: Spot[] = [
  // Paillasse de gauche, au premier plan (vérifié avec `?empreintes`) : plateau de y 645 au bord côté allée, en biais de
  // (558, 647) à (292, 770) ; évier x 250 à 472, y 668 à 702. Le microscope et la grande fiole tiennent à gauche de
  // l'évier, le reste sur les bandes libres derrière et devant lui. Rien sous x 102 : un écran 16:10 rogne ce bord.
  { name: 'L-scope', model: 'Microscope', u: 166, v: 700, h: 155, crate: 0, slot: [-.45, 0], yaw: 0, land: .4 },
  { name: 'L-flask', model: 'LeftFlask', u: 180, v: 770, h: 120, crate: 0, slot: [.4, -.3], yaw: 0, land: .425 },
  { name: 'L-rack', model: 'BlueRack', u: 412, v: 664, h: 81, crate: 0, slot: [.4, .3], yaw: 0, land: .45 },
  { name: 'L-amber', model: 'AmberFlask', u: 285, v: 662, h: 76, crate: 0, slot: [-.1, -.3], yaw: 0, land: .475 },
  { name: 'L-goggles', model: 'Goggles', u: 305, v: 726, h: 39, crate: 1, slot: [.3, .3], yaw: .3, land: .5 },
  // Rangées du fond, à gauche : les plateaux se resserrent à l'écran, chaque objet garde sa bande sans masquer celui de
  // derrière. Ils se posent presque ensemble, au passage du cadre téléphone.
  { name: 'L2-scope', model: 'Microscope', u: 588, v: 606, h: 100, crate: 1, slot: [.3, -.3], yaw: 0, land: .595 },
  { name: 'L2-red', model: 'RedFlask', u: 640, v: 606, h: 52, crate: 1, slot: [-.3, 0], yaw: 0, land: .61 },
  { name: 'L3-rack', model: 'AmberRack', u: 650, v: 552, h: 41, crate: 2, slot: [-.3, .25], yaw: 0, land: .62 },
  { name: 'L2-yellow', model: 'YellowBeaker', u: 690, v: 606, h: 38, crate: 1, slot: [.3, 0], yaw: 0, land: .63 },
  { name: 'L3-clear', model: 'ClearFlask', u: 700, v: 553, h: 36, crate: 2, slot: [.3, -.25], yaw: 0, land: .64 },
  { name: 'L3-beaker', model: 'BlueBeaker', u: 735, v: 549, h: 24, crate: 2, slot: [-.3, -.2], yaw: 0, land: .655 },
  { name: 'L3-scope', model: 'Microscope', u: 772, v: 547, h: 56, crate: 2, slot: [0, .3], yaw: 0, land: .665 },
  { name: 'L4-scope', model: 'Microscope', u: 820, v: 526, h: 45, crate: 2, slot: [.3, .3], yaw: 0, land: .68 },
  { name: 'L5-scope', model: 'Microscope', u: 860, v: 511, h: 37, crate: 2, slot: [-.3, 0], yaw: 0, land: .695 },
  // Rangées du fond, à droite.
  { name: 'R5-flask', model: 'RedFlask', u: 1270, v: 512, h: 23, crate: 2, slot: [.3, 0], yaw: 0, land: .765 },
  { name: 'R4-scope', model: 'Microscope', u: 1305, v: 528, h: 46, crate: 2, slot: [0, -.3], yaw: Math.PI, land: .775 },
  { name: 'R3-scope', model: 'Microscope', u: 1345, v: 547, h: 56, crate: 2, slot: [.3, -.2], yaw: Math.PI, land: .785 },
  { name: 'R3-rack', model: 'TubeRack', u: 1398, v: 552, h: 41, crate: 1, slot: [-.3, .3], yaw: 0, land: .8 },
  { name: 'R2-blue', model: 'BlueFlask', u: 1430, v: 606, h: 52, crate: 1, slot: [0, .3], yaw: 0, land: .81 },
  { name: 'R4-beaker', model: 'BlueBeaker', u: 1445, v: 530, h: 20, crate: 2, slot: [-.3, .3], yaw: 0, land: .82 },
  { name: 'R2-rack', model: 'SmallRack', u: 1490, v: 606, h: 34, crate: 1, slot: [0, -.3], yaw: 0, land: .83 },
  // Paillasse de droite : plateau de y 650 au bord côté allée, en biais depuis (1535, 652) ; évier x 1628 à 1875, y 673 à
  // 713. Le matériel s'aligne sur la bande libre derrière l'évier (y 650 à 673).
  { name: 'R-scope', model: 'Microscope', u: 1648, v: 671, h: 151, crate: 0, slot: [0, .35], yaw: Math.PI, land: .87 },
  { name: 'R-bottle', model: 'WashBottle', u: 1745, v: 664, h: 97, crate: 0, slot: [-.4, .35], yaw: 0, land: .905 },
  { name: 'R-tubes', model: 'TubeRack', u: 1840, v: 670, h: 84, crate: 0, slot: [0, -.4], yaw: 0, land: .94 },
];

// Avancement de l'animation, de 0 à 1 : réglé par render.mjs (window.installation.set), qui attend que l'image soit
// réellement calculée (rendu logiciel : une image avec beaucoup de verre prend plusieurs centaines de millisecondes).
const progress = { value: 0 };
let rendered = 0;
addAfterEffect(() => { rendered += 1; });
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));
declare global { interface Window { installation?: { ready: boolean; set: (t: number) => Promise<void>; state?: () => unknown } } }

// Contrôle (`?empreintes` dans l'adresse) : l'empreinte au sol de chaque objet, en rouge, pour vérifier qu'il tient sur
// son plateau sans déborder.
const outlines = new URLSearchParams(location.search).has('empreintes');

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const ease = (t: number) => t * t * (3 - 2 * t);
const seg = (t: number, a: number, b: number) => ease(clamp((t - a) / (b - a)));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// Ombre de contact d'un objet posé : un disque flou, plus sombre au centre.
function contactTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  const gradient = context.createRadialGradient(64, 64, 4, 64, 64, 62);
  gradient.addColorStop(0, 'rgba(0,0,0,1)');
  gradient.addColorStop(.55, 'rgba(0,0,0,.45)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  return new CanvasTexture(canvas);
}

function Rig() {
  const { camera: lens } = useThree();
  useEffect(() => {
    lens.position.set(0, photo.eye, 0);
    lens.rotation.set(-camera.pitch, 0, 0);
    lens.updateMatrixWorld();
  }, [lens]);
  return null;
}

// Verre posé sur la photo : le fond du rendu de transmission reste transparent (voir ClearTransmission du film).
function ClearTransmission() {
  const getState = useThree((state) => state.get);
  useEffect(() => {
    const { gl } = getState();
    const setClearColor = gl.setClearColor;
    gl.setClearColor = (color, alpha) => color === 0xffffff && alpha === .5 ? setClearColor.call(gl, 0x000000, 0) : setClearColor.call(gl, color, alpha);
    return () => { gl.setClearColor = setClearColor; };
  }, [getState]);
  return null;
}

function Lights() {
  useRoomEnvironment();
  const key = useRef<DirectionalLight>(null);
  useEffect(() => {
    // Soleil par les fenêtres de gauche, haut : les ombres partent vers la droite, comme celles des caisses de la photo.
    key.current?.position.set(-6, 9, -3);
    key.current?.target.position.set(0, 0, -5);
    key.current?.target.updateMatrixWorld();
  }, []);
  return <>
    <ambientLight intensity={.3} />
    <hemisphereLight args={['#f4efe6', '#8a7d6c', .7]} />
    <directionalLight ref={key} intensity={2.2} color="#fff3e2" castShadow shadow-mapSize={[2048, 2048]}
      shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-camera-near={.5} shadow-camera-far={40}
      shadow-bias={-.0003} shadow-normalBias={.02} />
  </>;
}

function Scene() {
  const assets = useSceneAssets();
  const benchFile = useGLTF(sceneLoads.bench[0], false, true);
  const { invalidate, gl, scene, camera: lens } = useThree();

  // Caisses : notre modèle, couvercle fermé, étiré pour recouvrir exactement chaque caisse de la photo.
  const crates = useMemo(() => photoCrates.map((box) => {
    const root = assets.crate.clone(true);
    const lid = root.getObjectByName('CrateLid');
    lid?.position.set(0, .79, 0);
    lid?.rotation.set(0, 0, 0);
    root.updateMatrixWorld(true);
    const size = new Box3().setFromObject(root).getSize(new Vector3());
    const base = -new Box3().setFromObject(root).min.y;
    const middle = (box.left + box.right) / 2;
    const foot = camera.onPhoto(middle, box.bottom, 0).point;
    const width = camera.onPhoto(box.right, box.bottom, 0).point.distanceTo(camera.onPhoto(box.left, box.bottom, 0).point);
    // Hauteur : celle dont le haut de la face avant tombe sur la ligne relevée.
    let low = .05, high = 3;
    for (let i = 0; i < 40; i += 1) {
      const h = (low + high) / 2;
      if (camera.photoRow(foot.clone().setY(h)) < box.front) high = h; else low = h;
    }
    const height = low;
    // Profondeur : du haut de la face avant à l'arête arrière du dessus, dans l'axe de la salle.
    const back = camera.onPhoto(middle, box.back, height).point;
    const depth = Math.max(.1, back.clone().sub(foot).dot(axis));
    const scale = new Vector3(width / size.x, height / size.y, depth / size.z);
    const at = foot.clone().addScaledVector(axis, depth / 2).setY(base * scale.y);
    root.scale.copy(scale);
    root.position.copy(at);
    root.rotation.set(0, yaw, 0);
    return { root, lid, scale, at };
  }), [assets.crate]);

  const items = useMemo(() => {
    const root = prepareBenchMaterials(benchFile.scene.clone(true));
    const texture = contactTexture();
    return spots.map((spot) => {
      const object = (root.getObjectByName(spot.model) as Object3D).clone(true);
      object.position.set(0, 0, 0);
      if (outlines) {
        object.rotation.set(0, 0, 0);
        object.updateMatrixWorld(true);
        const { min, max } = new Box3().setFromObject(object);
        const outline = new LineLoop(new BufferGeometry().setFromPoints([[min.x, min.z], [max.x, min.z], [max.x, max.z], [min.x, max.z]].map(([x, z]) => new Vector3(x, min.y, z))),
          new LineBasicMaterial({ color: 0xff0000, depthTest: false }));
        outline.renderOrder = 9;
        object.add(outline);
      }
      object.rotation.set(0, yaw + spot.yaw, 0);
      object.scale.setScalar(1);
      object.updateMatrixWorld(true);
      const footprint = new Box3().setFromObject(object).getSize(new Vector3());
      const { start, scale } = camera.fitOnPhoto(object, spot.u, spot.v, spot.h);
      // Les objets posés ne portent pas d'ombre au sol (les paillasses ne sont pas modélisées) : ombre de contact sur le plateau.
      const casters: Mesh[] = [];
      object.traverse((part) => { if (part instanceof Mesh && part.castShadow) casters.push(part); });
      const contact = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, opacity: 0 }));
      const middle = new Box3().setFromObject(object).getCenter(new Vector3());
      contact.position.set(start.x + middle.x * scale, photo.bench + .003, start.z + middle.z * scale);
      contact.rotation.set(-Math.PI / 2, 0, -(yaw + spot.yaw));
      contact.scale.set(footprint.x * scale * 1.35, footprint.z * scale * 1.35, 1);
      contact.renderOrder = 1;
      return { ...spot, object, end: start, scale, casters, contact };
    });
  }, [benchFile.scene]);

  // Ombres portées : sol de l'allée et plateaux des paillasses.
  const tops = useMemo(() => new BufferGeometry().setFromPoints(
    [[[0, 640], [600, 640], [600, 790], [0, 790]], [[1490, 640], [1920, 640], [1920, 790], [1490, 790]], [[560, 596], [760, 596], [760, 616], [560, 616]], [[1380, 596], [1560, 596], [1560, 616], [1380, 616]]]
      .flatMap((quad) => [quad[0], quad[1], quad[2], quad[0], quad[2], quad[3]])
      .map(([u, v]) => camera.onPhoto(u, v, photo.bench + .002).point),
  ), []);
  // Le sol ne reçoit d'ombres que dans l'allée : les paillasses ne sont pas modélisées, l'ombre des objets posés
  // dessus traverserait sinon leur plateau jusqu'au sol.
  const aisle = useMemo(() => new BufferGeometry().setFromPoints(
    [[520, 1072], [1580, 1072], [1125, 452], [985, 452]].flatMap((_, i, quad) => i < 2 ? [quad[0], quad[i + 1], quad[i + 2]] : [])
      .map(([u, v]) => camera.onPhoto(u, v, .002).point),
  ), []);
  const floor = useRef<ShadowMaterial>(null);
  const probe = useMemo(() => ({ from: new Vector3(), above: new Vector3(), over: new Vector3() }), []);

  useEffect(() => {
    window.installation = {
      ready: false,
      set: async (t: number) => {
        progress.value = t;
        const before = rendered;
        invalidate();
        while (rendered === before) await nextFrame();
        gl.getContext().finish();
        await nextFrame();
        await nextFrame();
      },
    };
    // Diagnostic : place, échelle et visibilité de chaque objet.
    window.installation.state = () => ({
      items: items.map((item) => ({ name: item.name, visible: item.object.visible, scale: item.scale, at: item.object.position.toArray().map((v) => +v.toFixed(2)) })),
      lids: crates.map((crate) => crate.lid?.position.toArray().map((v) => +v.toFixed(2))),
    });
    gl.compileAsync(scene, lens).finally(() => {
      if (window.installation) window.installation.ready = true;
      invalidate();
    });
  }, [gl, scene, lens, invalidate, items, crates]);

  useFrame(() => {
    const t = progress.value;
    // Couvercles : soulevés l'un après l'autre, puis posés contre leur caisse.
    crates.forEach((crate, k) => {
      const open = seg(t, .04 + k * .05, .2 + k * .05);
      const side = k % 2 ? -1 : 1;
      crate.lid?.position.set(mix(0, side * 1.36, open), mix(.79, -.2, open) + Math.sin(open * Math.PI) * .6, mix(0, .12, open));
      crate.lid?.rotation.set(0, 0, mix(0, side * -1.15, open));
      crate.root.updateMatrixWorld();
    });
    // Matériel : il sort de sa caisse, passe au-dessus des paillasses et s'y pose, un objet après l'autre.
    items.forEach((item) => {
      const flight = clamp((t - item.land + .26) / .26);
      const crate = crates[item.crate];
      item.object.visible = flight > 0;
      item.contact.visible = flight > .7;
      if (!item.object.visible) return;
      const from = crate.root.localToWorld(probe.from.set(item.slot[0], -.4, item.slot[1]));
      const above = crate.root.localToWorld(probe.above.set(item.slot[0], 1.4, item.slot[1]));
      const over = probe.over.copy(item.end).setY(item.end.y + .35);
      const rise = seg(flight, 0, .3), carry = seg(flight, .25, .8), land = seg(flight, .78, 1);
      const position = item.object.position.copy(from).lerp(above, rise);
      if (carry > 0) {
        position.lerp(over, carry);
        position.y += Math.sin(carry * Math.PI) * .25;
      }
      if (land > 0) position.copy(over).lerp(item.end, land);
      item.object.rotation.set(Math.sin(carry * Math.PI) * .2, yaw + item.yaw - (1 - carry) * 1.2, 0);
      item.object.scale.setScalar(item.scale);
      // Ombre au sol pendant la traversée de l'allée ; au-dessus de sa paillasse, ombre de contact sur le plateau.
      const overBench = carry > .7;
      item.casters.forEach((part) => { part.castShadow = !overBench; });
      (item.contact.material as MeshBasicMaterial).opacity = .5 * land;
    });
    if (floor.current) floor.current.opacity = .32;
  });

  return <>
    {crates.map((crate, k) => <primitive key={k} object={crate.root} dispose={null} />)}
    {items.map((item) => <primitive key={item.name} object={item.object} dispose={null} />)}
    {items.map((item) => <primitive key={`${item.name}-contact`} object={item.contact} />)}
    <mesh geometry={tops} receiveShadow renderOrder={1}>
      <shadowMaterial transparent opacity={.28} depthWrite={false} side={DoubleSide} />
    </mesh>
    <mesh geometry={aisle} receiveShadow>
      <shadowMaterial ref={floor} transparent opacity={.32} depthWrite={false} side={DoubleSide} />
    </mesh>
  </>;
}

export default function Installation() {
  return <div id="stage">
    <img src="/media/parcours/ecole-labo.jpg" alt="" />
    <Canvas dpr={1} frameloop="demand" shadows="soft" gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
      camera={{ fov: photo.fov, near: .05, far: 100, position: [0, photo.eye, 0] }}>
      <Rig />
      <ClearTransmission />
      <Lights />
      <Suspense fallback={null}><Scene /></Suspense>
    </Canvas>
  </div>;
}
