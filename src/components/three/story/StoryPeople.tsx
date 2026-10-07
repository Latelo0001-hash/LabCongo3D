import StoryAsset from "./StoryAsset";
import type { StageAnimator, StoryAssetName } from "./StoryAsset";
import type { StoryStore } from "../../../features/experience/store";
import type { Group } from "three";
function pose(root: Group, amount: number, walk: boolean, carry: boolean) {
  const stride = walk ? Math.sin(amount * Math.PI * 10) * 0.32 : 0;
  const move = (name: string, value: number) => {
    const joint = root.getObjectByName(name);
    if (joint) joint.rotation.x = value;
  };
  move("LeftLeg", stride);
  move("RightLeg", -stride);
  move("LeftArm", carry ? -1.15 : -stride * 0.7 - 0.1);
  move("RightArm", carry ? -1.15 : stride * 0.7 - 0.16);
  const torso = root.getObjectByName("Torso");
  if (torso) torso.rotation.x = walk ? 0 : Math.sin(amount * Math.PI) * 0.045;
}
export function StoryPerson({
  role,
  store,
  position,
  rotation = 0,
  walk = false,
  carry = false,
  distance = 0,
}: {
  role: StoryAssetName;
  store: StoryStore;
  position: [number, number, number];
  rotation?: number;
  walk?: boolean;
  carry?: boolean;
  distance?: number;
}) {
  const animate: StageAnimator = (root, p) => {
    root.position.z = position[2] - p * distance;
    pose(root, p, walk, carry);
  };
  return (
    <StoryAsset
      name={role}
      store={store}
      position={position}
      rotation={[0, rotation, 0]}
      animate={animate}
    />
  );
}
export function StoryTeam({
  store,
  walk = false,
  carry = false,
  z = 2.8,
}: {
  store: StoryStore;
  walk?: boolean;
  carry?: boolean;
  z?: number;
}) {
  return (
    <>
      <StoryPerson
        role="team-man"
        store={store}
        position={[-0.85, 0, z]}
        walk={walk}
        carry={carry}
        distance={walk ? 2 : 0}
        rotation={walk ? Math.PI : 0}
      />
      <StoryPerson
        role="team-man"
        store={store}
        position={[0.7, 0, z + 0.2]}
        walk={walk}
        carry={carry}
        distance={walk ? 2 : 0}
        rotation={walk ? Math.PI : 0}
      />
      <StoryPerson
        role="team-woman"
        store={store}
        position={[0, 0, z + 1]}
        walk={walk}
        carry={carry}
        distance={walk ? 2 : 0}
        rotation={walk ? Math.PI : 0}
      />
    </>
  );
}
