import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import type { StoryStore } from "../../../features/experience/store";
import StoryAsset from "./StoryAsset";
import { StoryPerson, StoryTeam } from "./StoryPeople";
const smooth = (value: number) => {
  const x = Math.max(0, Math.min(1, value));
  return x * x * (3 - 2 * x);
};
function doors(root: Group, angle: number) {
  const left = root.getObjectByName("DoorLeft"),
    right = root.getObjectByName("DoorRight");
  if (left) left.rotation.y = -angle;
  if (right) right.rotation.y = angle;
}
function Arrival({ store }: { store: StoryStore }) {
  const exterior = useRef<Group>(null),
    interior = useRef<Group>(null);
  useFrame(() => {
    const p = store.getState().progress % 1;
    if (exterior.current) exterior.current.visible = p < 0.58;
    if (interior.current) interior.current.visible = p >= 0.58;
  });
  return (
    <>
      <group ref={exterior}>
        <StoryAsset name="campus" store={store} />
        <StoryTeam store={store} walk z={3.1} />
      </group>
      <group ref={interior} visible={false}>
        <StoryAsset name="europe-lab" store={store} />
        <StoryTeam store={store} walk z={2.8} />
        <StoryPerson role="researcher" store={store} position={[-2.8, 0, -1]} />
        <StoryPerson
          role="researcher"
          store={store}
          position={[2.7, 0, -1.2]}
        />
      </group>
    </>
  );
}
function Selection({ store }: { store: StoryStore }) {
  return (
    <>
      <StoryAsset name="europe-lab" store={store} />
      <StoryPerson role="researcher" store={store} position={[-1.7, 0, -1.7]} />
      <StoryPerson
        role="researcher"
        store={store}
        position={[2.8, 0, -0.2]}
        rotation={-0.6}
      />
      <StoryPerson
        role="team-man"
        store={store}
        position={[-2.8, 0, 0.2]}
        rotation={1}
      />
      <StoryPerson
        role="team-man"
        store={store}
        position={[0.2, 0, 0.8]}
        rotation={-1}
      />
      <StoryPerson
        role="team-woman"
        store={store}
        position={[1.6, 0, 1.7]}
        rotation={Math.PI}
      />
    </>
  );
}
function Preparation({ store }: { store: StoryStore }) {
  return (
    <>
      <StoryAsset
        name="packing"
        store={store}
        animate={(root, p) => {
          const part = root.getObjectByName("ToPack");
          const t = smooth((p - 0.12) / 0.64);
          if (part)
            part.position.set(
              -1 + 2.5 * t,
              1.05 + Math.sin(t * Math.PI) * 0.38 - 0.65 * t,
              -1.3,
            );
          for (let i = 0; i < 3; i++) {
            const lid = root
              .getObjectByName("Package" + i)
              ?.getObjectByName("Lid");
            if (lid)
              lid.rotation.x =
                -1.8 * (1 - smooth((p - 0.62 + i * 0.08) / 0.28));
          }
        }}
      />
      <StoryPerson
        role="team-man"
        store={store}
        position={[-1, 0, -2.2]}
        carry
      />
      <StoryPerson
        role="team-woman"
        store={store}
        position={[2.3, 0, 0.5]}
        carry
        rotation={-Math.PI / 2}
      />
    </>
  );
}
function ContainerScene({
  store,
  unload = false,
}: {
  store: StoryStore;
  unload?: boolean;
}) {
  return (
    <>
      <StoryAsset
        name="container"
        store={store}
        animate={(root, p) => {
          doors(
            root,
            unload
              ? 1.8 * smooth(p / 0.28)
              : 1.8 * (1 - smooth((p - 0.76) / 0.22)),
          );
          for (let i = 0; i < 4; i++) {
            const item = root.getObjectByName("InsideCrate" + i);
            if (item) {
              const base = -1.3 + Math.floor(i / 2) * 1.1;
              const t = smooth((p - (unload ? 0.28 : 0) - i * 0.085) / 0.3);
              item.position.z = base + (unload ? t : 1 - t) * (4.8 - base);
            }
          }
        }}
      />
      <StoryPerson
        role="team-man"
        store={store}
        position={[-2.15, 0, 2.6]}
        carry
        rotation={Math.PI / 2}
      />
      <StoryPerson
        role="team-woman"
        store={store}
        position={[2.2, 0, 2.1]}
        carry
        rotation={-Math.PI / 2}
      />
    </>
  );
}
function Road({
  store,
  local = false,
}: {
  store: StoryStore;
  local?: boolean;
}) {
  return (
    <>
      <mesh position={[0, -0.03, 0]} receiveShadow>
        <boxGeometry args={[19, 0.06, 4.9]} />
        <meshStandardMaterial color="#6f8190" roughness={1} />
      </mesh>
      {[-7, -4, -1, 2, 5, 8].map((x) => (
        <mesh key={x} position={[x, 0.012, 0]}>
          <boxGeometry args={[1.5, 0.025, 0.055]} />
          <meshStandardMaterial color="#f6faff" />
        </mesh>
      ))}
      <StoryAsset
        name="truck"
        store={store}
        scale={0.62}
        rotation={[0, -Math.PI / 2, 0]}
        animate={(root, p) => {
          root.position.x = -3.5 + 7 * p;
          root.traverse((node) => {
            if (node.name.startsWith("Wheel")) node.rotation.x = -p * 20;
          });
        }}
      />
      <StoryAsset
        name={local ? "school" : "port"}
        store={store}
        position={[3, 0, -5.8]}
        scale={0.65}
      />
    </>
  );
}
function Sea({ store }: { store: StoryStore }) {
  return (
    <>
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[60, 0.08, 60]} />
        <meshStandardMaterial
          color="#82afc4"
          roughness={0.48}
          metalness={0.14}
        />
      </mesh>
      <StoryAsset name="port" store={store} position={[-8, 0, 0]} scale={0.8} />
      <StoryAsset
        name="ship"
        store={store}
        animate={(root, p) => {
          root.position.set(
            smooth((p - 0.3) / 0.7) * 2,
            Math.sin(p * Math.PI * 3) * 0.035,
            -smooth((p - 0.3) / 0.7) * 5,
          );
          root.rotation.z = Math.sin(p * Math.PI * 2) * 0.01;
        }}
      />
      <StoryAsset
        name="container"
        store={store}
        scale={0.35}
        animate={(root, p) => {
          root.visible = p < 0.32;
          const t = smooth(p / 0.32);
          root.position.set(-5 * (1 - t), 5 - 2.9 * t, 0);
        }}
      />
    </>
  );
}
function SchoolArrival({ store }: { store: StoryStore }) {
  return (
    <>
      <StoryAsset name="school" store={store} />
      <StoryAsset
        name="truck"
        store={store}
        scale={0.4}
        rotation={[0, Math.PI / 2, 0]}
        animate={(root, p) => {
          root.position.set(-2.8 - 2 * (1 - smooth(p / 0.4)), 0, 2.1);
        }}
      />
      <StoryPerson role="teacher" store={store} position={[0.9, 0, 0.8]} />
      <StoryTeam store={store} walk carry z={3.4} />
    </>
  );
}
function Classroom({ store, chapter }: { store: StoryStore; chapter: number }) {
  return (
    <>
      <StoryAsset
        name="classroom"
        store={store}
        animate={(root, p) => {
          const equipment = root.getObjectByName("Equipment");
          if (equipment) {
            equipment.visible = chapter !== 9 || p > 0.22;
            equipment.children.forEach((part, index) => {
              const t =
                chapter === 9 ? smooth((p - 0.22 - index * 0.2) / 0.4) : 1;
              part.visible = t > 0;
              part.scale.setScalar(Math.max(0.001, t));
              part.position.y = 1.05 + (1 - t) * 0.8;
            });
          }
        }}
      />
      <StoryPerson role="teacher" store={store} position={[-1.1, 0, -1.8]} />
      {chapter === 9 ? (
        <>
          <StoryPerson
            role="team-man"
            store={store}
            position={[-2.8, 0, 0.25]}
            carry
            rotation={1}
          />
          <StoryPerson
            role="team-woman"
            store={store}
            position={[2.8, 0, 0.2]}
            carry
            rotation={-1}
          />
        </>
      ) : (
        <>
          {[
            [-2.2, 0.2],
            [-1, 0.2],
            [1.1, 1.5],
            [2.3, 1.5],
          ].map(([x, z], i) => (
            <StoryPerson
              key={i}
              role="student"
              store={store}
              position={[x, 0, z + (chapter === 10 ? 0.7 : 0)]}
              rotation={Math.PI}
              walk={chapter === 10}
              distance={chapter === 10 ? 0.7 : 0}
            />
          ))}
        </>
      )}
    </>
  );
}
export default function StoryStages({
  chapter,
  store,
}: {
  chapter: number;
  store: StoryStore;
}) {
  switch (chapter) {
    case 0:
      return <Arrival store={store} />;
    case 1:
      return <Selection store={store} />;
    case 2:
      return <Preparation store={store} />;
    case 3:
      return <ContainerScene store={store} />;
    case 4:
      return <Road store={store} />;
    case 5:
      return <Sea store={store} />;
    case 6:
      return <ContainerScene store={store} unload />;
    case 7:
      return <Road store={store} local />;
    case 8:
      return <SchoolArrival store={store} />;
    default:
      return <Classroom store={store} chapter={chapter} />;
  }
}
