// Original procedural animatic assets. Detailed production characters can replace these GLBs.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { Buffer } from "node:buffer";
import { URL } from "node:url";
import {
  Group,
  Mesh,
  MeshStandardMaterial,
  BoxGeometry,
  CylinderGeometry,
  SphereGeometry,
  Shape,
  ExtrudeGeometry,
} from "three";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((value) => {
      this.result = value;
      this.onloadend?.();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((value) => {
      this.result = `data:${blob.type};base64,${Buffer.from(value).toString("base64")}`;
      this.onloadend?.();
    });
  }
};
const palette = {
  white: "#eef3f8",
  wall: "#d7e0e8",
  blue: "#0054a6",
  dark: "#193449",
  glass: "#90bccb",
  yellow: "#fff200",
  wood: "#c6a780",
  steel: "#6b8496",
  skin: "#8d573a",
  hair: "#262121",
  ground: "#d3dcd6",
  leaf: "#78927d",
  red: "#e21a22",
};
const mats = Object.fromEntries(
  Object.entries(palette).map(([key, color]) => [
    key,
    new MeshStandardMaterial({
      color,
      roughness: key === "glass" ? 0.23 : 0.65,
      metalness: key === "steel" ? 0.5 : 0.04,
    }),
  ]),
);
const geometries = new Map();
function geo(key, build) {
  if (!geometries.has(key)) geometries.set(key, build());
  return geometries.get(key);
}
function mesh(parent, name, geometry, mat, position, rotation = [0, 0, 0]) {
  const m = new Mesh(geometry, mats[mat]);
  m.name = name;
  m.position.set(...position);
  m.rotation.set(...rotation);
  parent.add(m);
  return m;
}
function box(parent, name, size, mat, pos) {
  return mesh(
    parent,
    name,
    geo("b" + size, () => new BoxGeometry(...size)),
    mat,
    pos,
  );
}
function tube(parent, name, top, bottom, height, mat, pos, rot = [0, 0, 0]) {
  return mesh(
    parent,
    name,
    geo(
      `c${top},${bottom},${height}`,
      () => new CylinderGeometry(top, bottom, height, 16),
    ),
    mat,
    pos,
    rot,
  );
}
function ball(parent, name, r, mat, pos, scale = [1, 1, 1]) {
  const m = mesh(
    parent,
    name,
    geo("s" + r, () => new SphereGeometry(r, 16, 12)),
    mat,
    pos,
  );
  m.scale.set(...scale);
  return m;
}
function group(parent, name, pos = [0, 0, 0]) {
  const g = new Group();
  g.name = name;
  g.position.set(...pos);
  if (parent) parent.add(g);
  return g;
}
const scopeBytes = await readFile(
  new URL("../public/models/microscope.glb", import.meta.url),
);
const scope = (
  await new GLTFLoader().parseAsync(
    scopeBytes.buffer.slice(
      scopeBytes.byteOffset,
      scopeBytes.byteOffset + scopeBytes.byteLength,
    ),
    "",
  )
).scene;
function microscope(g, pos) {
  const copy = scope.clone(true);
  copy.name = "Microscope";
  copy.scale.setScalar(0.21);
  copy.position.set(...pos);
  g.add(copy);
}
function flask(g, x, y, z) {
  tube(g, "Flask", 0.055, 0.12, 0.22, "glass", [x, y + 0.11, z]);
  tube(g, "Neck", 0.035, 0.035, 0.13, "glass", [x, y + 0.285, z]);
  tube(g, "Lip", 0.045, 0.045, 0.02, "blue", [x, y + 0.36, z]);
}
function gear(g, pos) {
  const tools = group(g, "Instruments", pos);
  microscope(tools, [-0.65, 0.245, 0]);
  for (let i = 0; i < 3; i++) flask(tools, 0.25 + i * 0.25, 0, -0.05);
  box(tools, "Balance", [0.45, 0.09, 0.37], "white", [-0.06, 0.055, 0.1]);
  tube(tools, "Pan", 0.14, 0.14, 0.03, "steel", [-0.06, 0.11, 0.1]);
  box(tools, "Meter", [0.2, 0.12, 0.15], "yellow", [0.7, 0.08, 0.25]);
  return tools;
}
function table(g, x, z) {
  box(g, "Worktop", [2.55, 0.12, 1.0], "dark", [x, 0.98, z]);
  for (const dx of [-1.1, 1.1])
    for (const dz of [-0.35, 0.35])
      box(g, "TableLeg", [0.065, 0.9, 0.065], "steel", [x + dx, 0.48, z + dz]);
}
function crate(parent, name, pos) {
  const g = group(parent, name, pos);
  box(g, "Box", [0.85, 0.67, 0.65], "wood", [0, 0.39, 0]);
  for (const x of [-0.32, 0.32])
    for (const z of [-0.35, 0.35])
      box(g, "Batten", [0.075, 0.71, 0.05], "white", [x, 0.39, z]);
  box(g, "Label", [0.24, 0.18, 0.015], "blue", [0, 0.4, 0.336]);
  const lid = group(g, "Lid", [0, 0.745, -0.33]);
  box(lid, "LidPanel", [0.89, 0.065, 0.69], "wood", [0, 0, 0.33]);
  for (const x of [-0.32, 0.32])
    box(lid, "LidBatten", [0.075, 0.025, 0.69], "white", [x, 0.05, 0.33]);
  return g;
}
function tree(g, x, z) {
  tube(g, "Trunk", 0.07, 0.1, 1, "wood", [x, 0.5, z]);
  ball(g, "Canopy", 0.65, "leaf", [x, 1.65, z], [0.7, 1.3, 0.7]);
}
function exterior(school = false) {
  const g = group(null, school ? "School" : "Campus");
  box(g, "Site", [12, 0.15, 9], "ground", [0, -0.13, 0]);
  box(g, "Building", [8, 3.5, 2.8], school ? "wood" : "white", [0, 1.75, -1.8]);
  box(g, "Roof", [8.7, 0.18, 3.4], "blue", [0, 3.55, -1.8]);
  for (const x of [-3, -1.8, 1.8, 3]) {
    box(g, "WindowFrame", [0.97, 1.44, 0.12], "white", [x, 1.9, -0.34]);
    box(g, "Window", [0.83, 1.3, 0.13], "glass", [x, 1.9, -0.26]);
    box(g, "WindowMullion", [0.04, 1.34, 0.14], "white", [x, 1.9, -0.2]);
  }
  box(g, "Entrance", [1.2, 2.4, 0.08], "dark", [0, 1.2, -0.32]);
  box(g, "DoorGlass", [1.04, 2.1, 0.09], "glass", [0, 1.1, -0.26]);
  box(g, "EntryStep", [2, 0.12, 1.2], "white", [0, 0.025, 0.1]);
  box(g, "EntryCanopy", [2.7, 0.15, 1.7], "white", [0, 2.9, 0.1]);
  for (const x of [-1.15, 1.15])
    box(g, "Column", [0.08, 2.8, 0.08], "steel", [x, 1.4, 0.7]);
  box(g, "Walkway", [2, 0.025, 4.5], "white", [0, -0.03, 2.5]);
  for (const x of [-4.8, 4.8]) tree(g, x, 0);
  for (let i = 0; i < 3; i++)
    box(g, "BlueSign", [0.14, 0.4, 0.025], i === 2 ? "yellow" : "blue", [
      -0.25 + i * 0.22,
      3.2,
      -0.32,
    ]);
  return g;
}
function room(school = false) {
  const g = group(null, school ? "Classroom" : "Laboratory");
  box(g, "Floor", [7.7, 0.12, 6.2], "white", [0, -0.1, 0]);
  box(g, "RearWall", [7.7, 3.7, 0.12], school ? "wood" : "wall", [0, 1.75, -3]);
  box(g, "SideWall", [0.12, 3.7, 3.4], "wall", [-3.8, 1.75, -1.3]);
  for (const x of [-2.8, 2.6]) {
    box(g, "Window", [1.4, 1.4, 0.08], "glass", [x, 2.15, -2.9]);
    box(g, "WindowCross", [1.45, 0.065, 0.09], "white", [x, 2.15, -2.84]);
    box(g, "WindowCross", [0.065, 1.45, 0.09], "white", [x, 2.15, -2.84]);
  }
  box(g, "Board", [2.2, 1.15, 0.1], "blue", [-0.1, 2.1, -2.89]);
  for (let i = 0; i < 3; i++)
    box(g, "BoardLine", [1.4 - i * 0.2, 0.018, 0.025], "white", [
      -0.2,
      2.4 - i * 0.21,
      -2.82,
    ]);
  for (const [x, z] of [
    [-1.65, -0.65],
    [1.65, 0.65],
  ]) {
    table(g, x, z);
    for (const dx of [-0.6, 0.6]) {
      tube(g, "Stool", 0.22, 0.22, 0.07, "blue", [x + dx, 0.52, z + 0.87]);
      for (const x1 of [-0.12, 0.12])
        box(g, "StoolLeg", [0.04, 0.5, 0.04], "steel", [
          x + dx + x1,
          0.25,
          z + 0.87,
        ]);
    }
  }
  const instruments = group(g, "Equipment");
  gear(instruments, [-1.65, 1.05, -0.65]);
  gear(instruments, [1.65, 1.05, 0.65]);
  if (!school) {
    box(g, "Cabinet", [1.8, 0.9, 0.55], "white", [2.4, 0.46, -2.5]);
    for (let i = 0; i < 4; i++) flask(g, 1.9 + i * 0.3, 0.94, -2.5);
  }
  return g;
}
function packing() {
  const g = group(null, "Packing");
  box(g, "Floor", [7.5, 0.1, 6], "wall", [0, -0.1, 0]);
  table(g, -1, -1.3);
  const equipment = gear(g, [-1, 1.05, -1.3]);
  equipment.name = "ToPack";
  for (let i = 0; i < 3; i++) crate(g, "Package" + i, [1.5, 0, -1.5 + i * 1.3]);
  box(g, "Protection", [1.2, 0.08, 0.65], "white", [-2.1, 1.09, -1.3]);
  box(g, "Inventory", [0.35, 0.015, 0.5], "blue", [-0.2, 1.065, -1.3]);
  return g;
}
function container() {
  const g = group(null, "Container");
  const w = 2.7,
    h = 2.8,
    d = 4.9;
  box(g, "ContainerFloor", [w, 0.12, d], "steel", [0, 0.16, 0]);
  box(g, "ContainerRoof", [w, 0.1, d], "blue", [0, h, 0]);
  box(g, "ContainerBack", [w, h, 0.08], "blue", [0, h / 2, -d / 2]);
  for (const x of [-w / 2, w / 2]) {
    box(g, "ContainerWall", [0.08, h, d], "blue", [x, h / 2, 0]);
    for (let i = 0; i < 18; i++)
      box(g, "Rib", [0.08, h - 0.12, 0.08], "blue", [
        x + (x > 0 ? 0.055 : -0.055),
        h / 2,
        -2.25 + i * 0.265,
      ]);
  }
  for (const [name, x, sign] of [
    ["DoorLeft", -w / 2, 1],
    ["DoorRight", w / 2, -1],
  ]) {
    const door = group(g, name, [x, 0, d / 2]);
    box(door, "DoorPanel", [w / 2 - 0.02, h - 0.1, 0.08], "blue", [
      (sign * w) / 4,
      h / 2,
      0,
    ]);
    for (const dx of [0.2, 0.48, 0.78, 1.05])
      box(door, "DoorRib", [0.05, h - 0.2, 0.04], "steel", [
        sign * dx,
        h / 2,
        0.07,
      ]);
    box(door, "Handle", [0.06, 0.45, 0.07], "yellow", [sign * 1.1, 1.2, 0.13]);
  }
  for (let i = 0; i < 4; i++)
    crate(g, "InsideCrate" + i, [
      i % 2 === 0 ? -0.7 : 0.65,
      0.22,
      -1.3 + Math.floor(i / 2) * 1.1,
    ]);
  return g;
}
function truck() {
  const g = group(null, "Truck");
  box(g, "Chassis", [2.15, 0.23, 7.5], "dark", [0, 0.67, 0]);
  box(g, "Cab", [2.05, 1.9, 1.75], "white", [0, 1.7, -2.7]);
  box(g, "Windscreen", [1.8, 0.82, 0.06], "glass", [0, 2.03, -3.61]);
  box(g, "Grille", [1.7, 0.35, 0.08], "dark", [0, 1.11, -3.62]);
  for (const x of [-0.78, 0.78])
    box(g, "Headlight", [0.25, 0.15, 0.08], "yellow", [x, 1.32, -3.63]);
  for (const z of [-2.8, 0.7, 2.1])
    for (const x of [-1.06, 1.06]) {
      const wheel = group(g, "Wheel", [x, 0.53, z]);
      tube(
        wheel,
        "Tyre",
        0.48,
        0.48,
        0.24,
        "dark",
        [0, 0, 0],
        [0, 0, Math.PI / 2],
      );
      tube(
        wheel,
        "Hub",
        0.24,
        0.24,
        0.255,
        "steel",
        [0, 0, 0],
        [0, 0, Math.PI / 2],
      );
    }
  const cargo = container();
  cargo.scale.setScalar(0.76);
  cargo.position.set(0, 0.86, 0.6);
  g.add(cargo);
  return g;
}
function port() {
  const g = group(null, "Port");
  box(g, "Pier", [9, 0.4, 9], "wall", [0, -0.18, 0]);
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 2; j++)
      box(g, "StackedContainer", [1.7, 1.5, 3.3], i % 2 ? "white" : "blue", [
        -3 + i * 1.9,
        0.76 + j * 1.53,
        -2.6,
      ]);
  for (const x of [-3.8, 3.8])
    box(g, "CraneLeg", [0.17, 5.5, 0.17], "yellow", [x, 2.75, 1]);
  box(g, "CraneBeam", [8, 0.25, 0.3], "yellow", [0, 5.5, 1]);
  box(g, "CraneRail", [0.2, 0.2, 4], "yellow", [0, 5.35, 2]);
  box(g, "CraneCable", [0.025, 2, 0.025], "dark", [0, 4.2, 2.6]);
  box(g, "Spreader", [1.2, 0.08, 0.7], "steel", [0, 3.2, 2.6]);
  return g;
}
function ship() {
  const g = group(null, "Ship");
  const shape = new Shape();
  shape.moveTo(-1.6, -3.5);
  shape.lineTo(-1.6, 2.8);
  shape.lineTo(0, 4.4);
  shape.lineTo(1.6, 2.8);
  shape.lineTo(1.6, -3.5);
  shape.closePath();
  mesh(
    g,
    "Hull",
    new ExtrudeGeometry(shape, { depth: 0.85, bevelEnabled: false }),
    "blue",
    [0, 0.15, 0],
    [-Math.PI / 2, 0, 0],
  );
  box(g, "Deck", [3.05, 0.12, 6.25], "steel", [0, 1.03, 0.1]);
  box(g, "Bridge", [2.7, 1.45, 1.3], "white", [0, 1.8, 2.4]);
  box(g, "BridgeWindows", [2.5, 0.4, 0.05], "glass", [0, 2.05, 1.73]);
  box(g, "Funnel", [0.5, 1.0, 0.6], "red", [0, 2.9, 2.75]);
  for (let i = 0; i < 3; i++)
    for (const x of [-0.77, 0.77])
      for (let j = 0; j < 2; j++)
        box(g, "Cargo", [1.4, 0.7, 1.3], (i + j) % 2 ? "white" : "blue", [
          x,
          1.42 + j * 0.74,
          -2.4 + i * 1.38,
        ]);
  return g;
}
function person(role) {
  const g = group(null, "Person");
  const woman = role === "team-woman";
  const pupil = role === "student";
  const coat = role === "researcher";
  const cloth = coat || pupil ? "white" : "blue";
  const torso = group(g, "Torso", [0, 0.95, 0]);
  box(torso, "Shirt", [0.43, 0.52, 0.25], cloth, [0, 0.23, 0]);
  box(torso, "Collar", [0.12, 0.06, 0.26], "white", [0, 0.51, 0]);
  tube(g, "Neck", 0.067, 0.067, 0.11, "skin", [0, 1.52, 0]);
  ball(g, "Head", 0.155, "skin", [0, 1.7, 0], [0.86, 1.12, 0.87]);
  ball(g, "Hair", 0.157, "hair", [0, 1.76, -0.016], [0.88, 0.8, 0.86]);
  if (woman)
    ball(g, "HairBack", 0.13, "hair", [0, 1.62, -0.14], [0.8, 1.4, 0.8]);
  for (const x of [-0.115, 0.115]) {
    const leg = group(g, x < 0 ? "LeftLeg" : "RightLeg", [x, 0.94, 0]);
    box(leg, "Trousers", [0.16, 0.75, 0.19], "dark", [0, -0.36, 0]);
    box(leg, "Shoe", [0.17, 0.11, 0.31], "dark", [0, -0.81, 0.05]);
  }
  for (const x of [-0.27, 0.27]) {
    const arm = group(g, x < 0 ? "LeftArm" : "RightArm", [x, 1.41, 0]);
    tube(arm, "Sleeve", 0.087, 0.07, 0.44, cloth, [0, -0.2, 0]);
    tube(
      arm,
      "Forearm",
      0.06,
      0.052,
      0.21,
      coat ? "white" : "skin",
      [0, -0.5, 0],
    );
    ball(arm, "Hand", 0.057, "skin", [0, -0.635, 0], [0.8, 1.2, 0.7]);
  }
  box(g, "Badge", [0.08, 0.1, 0.02], "yellow", [-0.11, 1.3, 0.139]);
  if (coat) box(g, "CoatSkirt", [0.48, 0.32, 0.28], "white", [0, 0.82, 0]);
  if (pupil) g.scale.setScalar(0.79);
  return g;
}
const out = new URL("../public/models/story/", import.meta.url);
await mkdir(out, { recursive: true });
const models = [
  ["campus", exterior()],
  ["europe-lab", room()],
  ["packing", packing()],
  ["container", container()],
  ["truck", truck()],
  ["port", port()],
  ["ship", ship()],
  ["school", exterior(true)],
  ["classroom", room(true)],
  ...["team-man", "team-woman", "researcher", "teacher", "student"].map(
    (role) => [role, person(role)],
  ),
];
for (const [name, scene] of models) {
  scene.updateMatrixWorld(true);
  const buffer = await new GLTFExporter().parseAsync(scene, {
    binary: true,
    onlyVisible: true,
  });
  await writeFile(new URL(`${name}.glb`, out), Buffer.from(buffer));
}
