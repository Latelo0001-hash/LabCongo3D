import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Box3, BoxGeometry, DirectionalLight, ExtrudeGeometry, Group, InstancedMesh, Matrix4, Mesh, MeshStandardMaterial, Quaternion, Shape, Vector3 } from 'three';
import type { Object3D, PerspectiveCamera } from 'three';
import { useRoomEnvironment } from '../immersive/useRoomEnvironment';
import { useSceneAssets } from '../immersive/sceneAssets';
import { mix } from '../immersive/timeline';
import { useFilm } from './useFilm';
import { at, fov, framing, road, roadLength, roadPoint, seg, travel, workshop } from './filmTimeline';

const files = {
  truck: '/models/immersive/scania-truck.glb',
  chassis: '/models/immersive/container-chassis-v2.glb',
  container: '/models/immersive/container-v2.glb',
  labware: '/models/immersive/labware-v2.glb',
};
const up = new Vector3(0, 1, 0);
type Vec = readonly [number, number, number];

// Mesures du modèle « Scania truck » (PAndras, CC BY 4.0), en unités du fichier :
// sens de marche (de l'essieu arrière vers l'avant), centre de la sellette et échelle en mètres.
const truckModel = { scale: .18, wheelRadius: .536, forward: new Vector3(-17.96, 0, 15.24).normalize(), fifthWheel: new Vector3(18.25, 6.53, -22.21) };

// Récolte : place dans l'arc (par rapport à son centre), point d'entrée, arrivée et mise en caisse, en écrans.
const gathered: { name: string; slot: Vec; from: Vec; arrive: readonly [number, number]; pack: readonly [number, number]; scale: number; base: number }[] = [
  { name: 'Microscope', slot: [0, .62, -.2], from: [0, .25, .7], arrive: [.8, 1.3], pack: [3.45, 3.8], scale: .7, base: .79 },
  { name: 'Flask', slot: [-1.8, -.35, .2], from: [-9, -1, 2], arrive: [.9, 1.35], pack: [3.6, 3.95], scale: 1.6, base: 0 },
  { name: 'Beaker', slot: [-.95, .15, 0], from: [-5, 6, 0], arrive: [1.3, 1.75], pack: [3.75, 4.1], scale: 1.6, base: 0 },
  { name: 'Balance', slot: [.95, .2, 0], from: [5, 6, 0], arrive: [1.7, 2.15], pack: [3.9, 4.2], scale: 1.6, base: 0 },
  { name: 'Cylinder', slot: [1.8, -.35, .2], from: [9, -1, 2], arrive: [2.1, 2.55], pack: [4, 4.3], scale: 1.6, base: 0 },
];
const crateAt = { y: -.9, z: .3, scale: .9 } as const;
const containerZ = crateAt.z - 5;

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

function Workshop() {
  const assets = useSceneAssets();
  const labwareFile = useGLTF(files.labware, false, true);
  const labware = useMemo(() => shade(labwareFile.scene.clone(true)), [labwareFile.scene]);
  const items = useMemo(() => [assets.microscope, ...gathered.slice(1).map((item) => labware.getObjectByName(item.name))]
    .filter((item): item is Object3D => Boolean(item)), [assets.microscope, labware]);
  const parts = useRef<{ items: Object3D[]; lid?: Object3D; left?: Object3D; right?: Object3D }>({ items: [] });
  const crate = useRef<Group>(null);
  const container = useRef<Group>(null);
  const spreader = useRef<Group>(null);

  useEffect(() => {
    parts.current = {
      items,
      lid: assets.crate.getObjectByName('CrateLid'),
      left: assets.container.getObjectByName('DoorLeft'),
      right: assets.container.getObjectByName('DoorRight'),
    };
  }, [items, assets]);

  useFrame(() => {
    if (!crate.current || !container.current || !spreader.current) return;
    const x = at(useFilm.getState().progress);
    const { items: objects, lid, left, right } = parts.current;
    const cx = workshop.arcX, cy = workshop.arcY;
    const crateY = cy + mix(crateAt.y - 4, crateAt.y, seg(x, 3, 3.4)) + .12 * seg(x, 5.15, 5.25);
    const crateZ = mix(crateAt.z, containerZ + .3, seg(x, 5.25, 5.7));

    objects.forEach((object, i) => {
      const item = gathered[i];
      const next = gathered[i + 1]?.arrive[1] ?? 3.2;
      const arrive = seg(x, item.arrive[0], item.arrive[1]);
      const feature = seg(x, item.arrive[1] - .15, item.arrive[1]) * (1 - seg(x, next - .15, next));
      const pack = seg(x, item.pack[0], item.pack[1]);
      // Arrivée en tournoyant, puis mise en avant tant que l'objet suivant n'est pas arrivé.
      let px = mix(item.from[0], item.slot[0], arrive), py = mix(item.from[1], item.slot[1], arrive) + item.base, pz = mix(item.from[2], item.slot[2], arrive) + .45 * feature;
      let scale = (i === 0 ? mix(.82, item.scale, arrive) : item.scale) * (1 + .14 * feature);
      // Mise en caisse : au-dessus de l'ouverture, puis descente à l'intérieur.
      const above = Math.min(1, pack * 2), inside = Math.max(0, pack * 2 - 1);
      px = mix(px, 0, above);
      py = mix(mix(py, crateAt.y + 2.2, above), crateAt.y + .2, inside);
      pz = mix(pz, crateAt.z, above);
      scale *= mix(1, .4, inside);
      object.position.set(cx + px, cy + py, pz);
      object.scale.setScalar(scale);
      object.rotation.set(0, (i === 0 ? -.6 : (1 - arrive) * 5) + x * .35 - pack * 1.2, 0);
      object.visible = (i === 0 || x > item.arrive[0] - .05) && pack < .97;
    });

    crate.current.visible = x > 2.95 && x < 6.3;
    crate.current.position.set(cx, crateY, crateZ);
    const close = seg(x, 4.25, 4.6);
    lid?.position.set(0, mix(2.72, .79, close), 0);
    lid?.rotation.set(mix(-.1, 0, close), 0, 0);

    // Le conteneur arrive par la droite, avale la caisse, se ferme, puis est hissé hors champ.
    const lift = seg(x, 6.15, 6.45);
    container.current.visible = x > 4.7 && x < 6.5;
    container.current.position.set(cx + 12 * (1 - seg(x, 4.75, 5.15)), 16 * lift, containerZ);
    container.current.rotation.y = -Math.PI / 2 * lift;
    const doors = Math.PI * .56 * (seg(x, 5, 5.25) - seg(x, 5.7, 6));
    left?.rotation.set(0, -doors, 0);
    right?.rotation.set(0, doors, 0);
    spreader.current.visible = x > 5.95 && x < 6.5;
    spreader.current.position.set(cx, 2.9 + 16 * lift + 12 * (1 - seg(x, 6, 6.15)), containerZ);
    spreader.current.rotation.y = -Math.PI / 2 * lift;
  });

  return <>
    {items.map((item) => <primitive key={item.uuid} object={item} dispose={null} />)}
    <group ref={crate} scale={crateAt.scale}><primitive object={assets.crate} dispose={null} /></group>
    <group ref={container}><primitive object={assets.container} dispose={null} /></group>
    <group ref={spreader}><Spreader length={2.5} width={5.2} cable={26} /></group>
    <mesh position={[workshop.arcX, .002, containerZ / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} /><shadowMaterial transparent opacity={.18} depthWrite={false} />
    </mesh>
  </>;
}

function Convoy() {
  const [truckFile, chassisFile, containerFile] = useGLTF([files.truck, files.chassis, files.container], false, true);
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
    const drop = (1 - seg(x, 6.75, 7.05)) * 12;
    load.current.position.set(-2.2, 1.25 + drop, 0);
    spreader.current.position.set(-2.2, 4.11 + drop + seg(x, 7.05, 7.5) * 16, 0);
    spreader.current.visible = x < 7.6;
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

// Une seule caméra enchaîne quatre plans : atelier, trois-quarts du conteneur, profil du camion, vue du ciel.
function CameraRig() {
  const key = useRef<DirectionalLight>(null);
  const rim = useRef<DirectionalLight>(null);
  const target = useMemo(() => new Vector3(), []);
  const { invalidate } = useThree();
  useEffect(() => useFilm.subscribe(() => invalidate()), [invalidate]);

  useFrame(({ camera, size }) => {
    if (!key.current || !rim.current) return;
    const x = at(useFilm.getState().progress);
    const aspect = size.width / size.height;
    const frame = framing(aspect);
    const wide = aspect > 1;
    const king = roadPoint(travel(x));
    const shift = (wide ? 4 + 3 * seg(x, 7.2, 8.8) : 0) * (1 - seg(x, 9, 10.4));
    const studio: Shot = { x: wide ? workshop.x : workshop.arcX, y: workshop.arcY + mix(wide ? .6 : 0, .1, seg(x, 3, 3.5)), z: 0, distance: frame.studio, elevation: mix(.06, .2, seg(x, 3, 3.6)), azimuth: 0 };
    const loading: Shot = { x: workshop.arcX, y: 1.4, z: containerZ / 2, distance: frame.studio * 1.05, elevation: .24, azimuth: .55 };
    const side: Shot = { x: king.x - shift, y: 2, z: king.z, distance: frame.side, elevation: .04, azimuth: 0 };
    const top: Shot = { x: king.x, y: 0, z: king.z, distance: frame.top, elevation: Math.PI / 2, azimuth: 0 };
    const shot = blend(blend(blend(studio, loading, seg(x, 4.6, 5.2)), side, seg(x, 6.45, 7)), top, seg(x, 9.2, 10.8));
    const { distance, elevation, azimuth } = shot;
    target.set(shot.x, shot.y, shot.z);
    camera.position.set(
      target.x + Math.sin(azimuth) * Math.cos(elevation) * distance,
      target.y + Math.sin(elevation) * distance,
      target.z + Math.cos(azimuth) * Math.cos(elevation) * distance,
    );
    camera.up.set(-Math.sin(azimuth) * Math.sin(elevation), Math.cos(elevation), -Math.cos(azimuth) * Math.sin(elevation));
    camera.lookAt(target);
    (camera as PerspectiveCamera).fov = fov;
    camera.updateProjectionMatrix();

    key.current.position.set(target.x - 10, target.y + 18, target.z + 14);
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

function Ready({ onReady }: { onReady: () => void }) {
  const { invalidate } = useThree();
  useEffect(() => {
    onReady();
    invalidate();
  }, [onReady, invalidate]);
  return null;
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

export default function FilmCanvas(props: { onReady: () => void; onFailure: () => void }) {
  return <Canvas camera={{ position: [workshop.x, 2.5, 14], fov }} dpr={[1, 1.5]} frameloop="demand" shadows="soft" gl={{ alpha: true, antialias: true }} fallback={null}>
    <ContextGuard onFailure={props.onFailure} />
    <Environment />
    <CameraRig />
    <Suspense fallback={null}>
      <Workshop />
      <Convoy />
      <Ready onReady={props.onReady} />
    </Suspense>
  </Canvas>;
}
