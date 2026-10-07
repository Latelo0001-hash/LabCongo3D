import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Box3, BoxGeometry, DirectionalLight, ExtrudeGeometry, Group, InstancedMesh, Matrix4, Mesh, MeshStandardMaterial, Quaternion, Shape, Vector3 } from 'three';
import type { Object3D, PerspectiveCamera } from 'three';
import { useRoomEnvironment } from '../immersive/useRoomEnvironment';
import { between, mix } from '../immersive/timeline';
import { useFilm } from './useFilm';
import { fov, framing, road, roadLength, roadPoint, travel } from './filmTimeline';

const files = {
  truck: '/models/immersive/scania-truck.glb',
  chassis: '/models/immersive/container-chassis-v2.glb',
  container: '/models/immersive/container-v2.glb',
};
const up = new Vector3(0, 1, 0);

// Mesures du modèle « Scania truck » (PAndras, CC BY 4.0), en unités du fichier :
// sens de marche (de l'essieu arrière vers l'avant), centre de la sellette et échelle en mètres.
const truckModel = { scale: .18, wheelRadius: .536, forward: new Vector3(-17.96, 0, 15.24).normalize(), fifthWheel: new Vector3(18.25, 6.53, -22.21) };

function shade(scene: Object3D) {
  scene.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    object.castShadow = true;
    object.receiveShadow = true;
    const material = object.material as MeshStandardMaterial;
    material.envMapIntensity = .55;
    if (material.transparent) material.depthWrite = false;
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
  for (let s = -40; s <= roadLength + 40; s += 1) {
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
  for (let s = -30; s < roadLength + 30; s += 7) {
    const a = roadPoint(s), b = roadPoint(s + 3.4);
    const rotation = new Quaternion().setFromAxisAngle(up, -Math.atan2(b.z - a.z, b.x - a.x));
    matrices.push(new Matrix4().compose(new Vector3((a.x + b.x) / 2, .012, (a.z + b.z) / 2), rotation, new Vector3(1, 1, 1)));
  }
  const mesh = new InstancedMesh(new BoxGeometry(3.4, .02, .22), new MeshStandardMaterial({ color: '#cfcdc6', roughness: .85 }), matrices.length);
  matrices.forEach((matrix, i) => mesh.setMatrixAt(i, matrix));
  return mesh;
}

function Convoy({ onReady }: { onReady: () => void }) {
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
  const light = useRef<DirectionalLight>(null);
  const { invalidate } = useThree();
  const target = useMemo(() => new Vector3(), []);

  useEffect(() => {
    joints.current = { wheels: truck.wheels, axle: truck.axle, axles: trailer.axles };
    onReady();
    invalidate();
    return useFilm.subscribe(() => invalidate());
  }, [truck, trailer, invalidate, onReady]);
  useEffect(() => () => {
    surface.dispose();
    markings.geometry.dispose();
    (markings.material as MeshStandardMaterial).dispose();
  }, [surface, markings]);

  useFrame(({ camera, size }) => {
    if (!rig.current || !towed.current || !load.current || !spreader.current || !light.current) return;
    const p = useFilm.getState().progress;
    const s = travel(p);
    // Le tracteur suit la route devant la sellette, la remorque pivote derrière elle.
    const king = roadPoint(s), front = roadPoint(s + 3.75), back = roadPoint(s - 4);
    rig.current.position.set(king.x, 0, king.z);
    rig.current.rotation.y = -Math.atan2(front.z - king.z, front.x - king.x);
    towed.current.position.set(king.x, 0, king.z);
    towed.current.rotation.y = -Math.atan2(king.z - back.z, king.x - back.x);
    const { wheels, axle, axles } = joints.current;
    for (const pivot of wheels) pivot.quaternion.setFromAxisAngle(axle, s / truckModel.wheelRadius);
    for (const trailerAxle of axles) trailerAxle.rotation.set(0, 0, -s / .5);

    // Le conteneur descend sur la remorque, puis le palonnier remonte hors champ.
    const drop = (1 - between(p, .015, .11)) * 9;
    load.current.position.set(-2.2, 1.25 + drop, 0);
    spreader.current.position.set(-2.2, 4.11 + drop + between(p, .11, .17) * 16, 0);
    spreader.current.visible = p < .2;

    // De profil, l'attelage se tient à droite du titre et file vers la droite, puis la caméra s'élève à la verticale.
    const aspect = size.width / size.height;
    const frame = framing(aspect);
    const rise = between(p, .34, .5);
    const elevation = mix(.04, Math.PI / 2, rise);
    const distance = mix(frame.side, frame.top, rise);
    const shift = (aspect > 1 ? 4 + 3 * between(p, .14, .3) : 0) * (1 - between(p, .32, .46));
    target.set(king.x - shift, mix(2, 0, rise), king.z);
    camera.position.set(target.x, target.y + Math.sin(elevation) * distance, target.z + Math.cos(elevation) * distance);
    camera.up.set(0, Math.cos(elevation), -Math.sin(elevation));
    camera.lookAt(target);
    (camera as PerspectiveCamera).fov = fov;
    camera.updateProjectionMatrix();

    light.current.position.set(king.x - 10, 18, king.z + 14);
    light.current.target.position.set(king.x, 0, king.z);
    light.current.target.updateMatrixWorld();
  });

  return <>
    <directionalLight ref={light} intensity={2.1} color="#fff6e7" castShadow
      shadow-mapSize={[1024, 1024]} shadow-camera-left={-9} shadow-camera-right={9}
      shadow-camera-top={9} shadow-camera-bottom={-9} shadow-camera-near={.1} shadow-camera-far={60}
      shadow-bias={-.0002} shadow-normalBias={.02} />
    <mesh geometry={surface} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
      <meshStandardMaterial color="#0c0e11" roughness={.92} />
    </mesh>
    <primitive object={markings} />
    <group ref={rig}><primitive object={truck.root} dispose={null} /></group>
    <group ref={towed}>
      <primitive object={trailer.scene} dispose={null} />
      <group ref={load} rotation={[0, -Math.PI / 2, 0]}><primitive object={container} dispose={null} /></group>
      <group ref={spreader}>
        <mesh castShadow><boxGeometry args={[5.2, .22, 2.5]} /><meshStandardMaterial color="#e2b22c" roughness={.55} metalness={.35} /></mesh>
        {[[-2.3, -1.05], [-2.3, 1.05], [2.3, -1.05], [2.3, 1.05]].map(([x, z]) => <mesh key={`${x}${z}`} position={[x, 13, z]}>
          <cylinderGeometry args={[.025, .025, 26, 6]} /><meshStandardMaterial color="#2a2d31" roughness={.6} metalness={.6} />
        </mesh>)}
      </group>
    </group>
  </>;
}

function Environment() {
  useRoomEnvironment();
  return <>
    <ambientLight intensity={.22} />
    <hemisphereLight args={['#eef3f8', '#3d3a35', .6]} />
  </>;
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
  return <Canvas camera={{ position: [0, 3, 30], fov }} dpr={[1, 1.5]} frameloop="demand" shadows="soft" gl={{ alpha: true, antialias: true }} fallback={null}>
    <ContextGuard onFailure={props.onFailure} />
    <Environment />
    <Suspense fallback={null}><Convoy onReady={props.onReady} /></Suspense>
  </Canvas>;
}
