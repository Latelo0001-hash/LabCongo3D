// Original illustrative geometry for LabCongo; no external model assets.
import { mkdir, writeFile } from "node:fs/promises";
import { Buffer } from "node:buffer";
import { URL } from "node:url";
import {
  Group,
  Mesh,
  MeshStandardMaterial,
  BoxGeometry,
  CylinderGeometry,
  TorusGeometry,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
// The exporter uses FileReader in browsers. Blob.arrayBuffer provides the same data in Node.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((data) => {
      this.result = data;
      this.onloadend?.();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((data) => {
      this.result = `data:${blob.type};base64,${Buffer.from(data).toString("base64")}`;
      this.onloadend?.();
    });
  }
};
const materials = {
  white: new MeshStandardMaterial({
    color: "#e8edf3",
    roughness: 0.36,
    metalness: 0.2,
  }),
  blue: new MeshStandardMaterial({
    color: "#0054a6",
    roughness: 0.4,
    metalness: 0.25,
  }),
  dark: new MeshStandardMaterial({ color: "#162b46", roughness: 0.5 }),
  metal: new MeshStandardMaterial({
    color: "#97aabd",
    roughness: 0.25,
    metalness: 0.8,
  }),
  yellow: new MeshStandardMaterial({ color: "#fff200", roughness: 0.4 }),
  glass: new MeshStandardMaterial({
    color: "#82c9db",
    roughness: 0.25,
    metalness: 0.15,
  }),
  wood: new MeshStandardMaterial({ color: "#c8a884", roughness: 0.85 }),
};
function part(
  parent,
  name,
  geometry,
  material,
  position,
  rotation = [0, 0, 0],
) {
  const mesh = new Mesh(geometry, materials[material]);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  parent.add(mesh);
  return mesh;
}
function box(parent, name, size, mat, pos, radius = 0.025) {
  return part(
    parent,
    name,
    mergeVertices(new RoundedBoxGeometry(...size, 1, radius)),
    mat,
    pos,
  );
}
function cylinder(parent, name, r1, r2, height, mat, pos, rot = [0, 0, 0]) {
  return part(
    parent,
    name,
    new CylinderGeometry(r1, r2, height, 24),
    mat,
    pos,
    rot,
  );
}
function microscope() {
  const g = new Group();
  g.name = "Microscope illustratif";
  box(g, "Base", [1.25, 0.19, 0.95], "white", [0, -1.0, 0], 0.07);
  for (const x of [-0.43, 0.43])
    for (const z of [-0.3, 0.3])
      cylinder(g, "Pied", 0.09, 0.09, 0.06, "dark", [x, -1.12, z]);
  box(
    g,
    "Colonne",
    [0.23, 1.43, 0.3],
    "blue",
    [0.42, -0.23, -0.1],
    0.07,
  ).rotation.z = -0.16;
  box(g, "Bras supérieur", [0.67, 0.22, 0.3], "blue", [0.22, 0.47, -0.1], 0.05);
  box(g, "Platine", [1.0, 0.09, 0.75], "dark", [-0.13, -0.3, 0]);
  for (const z of [-0.19, 0.19])
    box(g, "Pince", [0.39, 0.018, 0.03], "metal", [-0.16, -0.24, z], 0.005);
  box(g, "Lame", [0.32, 0.015, 0.13], "glass", [-0.27, -0.237, 0], 0.002);
  cylinder(g, "Lampe", 0.17, 0.21, 0.19, "white", [-0.28, -0.81, 0]);
  cylinder(
    g,
    "Lentille éclairage",
    0.13,
    0.13,
    0.015,
    "glass",
    [-0.28, -0.7, 0],
  );
  const tube = new Group();
  tube.position.set(-0.22, 0.54, 0);
  tube.rotation.z = -0.25;
  g.add(tube);
  cylinder(tube, "Corps optique", 0.15, 0.17, 0.66, "white", [0, 0.05, 0]);
  cylinder(tube, "Bague", 0.159, 0.159, 0.08, "blue", [0, 0.34, 0]);
  cylinder(tube, "Oculaire", 0.105, 0.105, 0.21, "dark", [0, 0.46, 0]);
  cylinder(
    tube,
    "Lentille oculaire",
    0.086,
    0.086,
    0.015,
    "glass",
    [0, 0.575, 0],
  );
  cylinder(g, "Tourelle", 0.22, 0.19, 0.1, "metal", [-0.3, 0.15, 0]);
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI * 2) / 3;
    const x = -0.3 + Math.cos(a) * 0.13,
      z = Math.sin(a) * 0.13;
    cylinder(g, "Objectif", 0.047, 0.064, 0.23 + i * 0.035, "metal", [
      x,
      -0.015,
      z,
    ]);
    cylinder(g, "Bague objectif", 0.052, 0.068, 0.032, "blue", [x, -0.09, z]);
  }
  for (const z of [-0.32, 0.2]) {
    cylinder(
      g,
      "Mise au point",
      0.18,
      0.18,
      0.12,
      "dark",
      [0.5, -0.09, z],
      [Math.PI / 2, 0, 0],
    );
    cylinder(
      g,
      "Réglage fin",
      0.09,
      0.09,
      0.16,
      "metal",
      [0.5, -0.09, z],
      [Math.PI / 2, 0, 0],
    );
  }
  part(
    g,
    "Graduation",
    new TorusGeometry(0.14, 0.008, 8, 24),
    "yellow",
    [0.5, -0.09, 0.266],
  );
  return g;
}
function flask(g, x, y, z) {
  cylinder(g, "Flacon", 0.1, 0.19, 0.3, "glass", [x, y, z]);
  cylinder(g, "Col", 0.06, 0.06, 0.18, "glass", [x, y + 0.22, z]);
  cylinder(g, "Bouchon", 0.073, 0.073, 0.055, "blue", [x, y + 0.32, z]);
}
function laboratory() {
  const g = new Group();
  g.name = "Laboratoire scolaire illustratif";
  box(g, "Sol", [3.2, 0.12, 2.3], "white", [0, -0.9, 0]);
  box(g, "Mur du fond", [3.2, 1.9, 0.09], "white", [0, 0.1, -1.1]);
  box(g, "Tableau", [1.15, 0.64, 0.06], "blue", [-0.71, 0.52, -1.03]);
  for (let i = 0; i < 3; i++)
    box(
      g,
      "Trait tableau",
      [0.73 - i * 0.12, 0.013, 0.01],
      "white",
      [-0.76, 0.68 - i * 0.13, -0.99],
      0.002,
    );
  box(g, "Étagère", [0.98, 0.065, 0.35], "wood", [0.83, 0.35, -0.85]);
  for (let i = 0; i < 3; i++) flask(g, 0.56 + i * 0.25, 0.53, -0.85);
  box(g, "Paillasse", [2.5, 0.13, 0.76], "dark", [0, -0.13, 0.05]);
  for (const x of [-1.08, 1.08])
    for (const z of [-0.21, 0.3])
      box(g, "Pied de table", [0.07, 0.67, 0.07], "metal", [x, -0.52, z]);
  const scope = microscope();
  scope.scale.setScalar(0.3);
  scope.position.set(-0.65, 0.26, 0.06);
  g.add(scope);
  flask(g, 0.51, 0.09, 0.05);
  flask(g, 0.94, 0.09, -0.07);
  for (const x of [-0.6, 0.6]) {
    cylinder(g, "Tabouret", 0.25, 0.25, 0.08, "blue", [x, -0.43, 0.79]);
    for (const dx of [-0.14, 0.14])
      box(g, "Pied de tabouret", [0.05, 0.4, 0.05], "metal", [
        x + dx,
        -0.66,
        0.79,
      ]);
  }
  return g;
}
function crate() {
  const g = new Group();
  g.name = "Caisse de transport illustrative";
  box(g, "Caisse", [1.6, 1.15, 1.2], "wood", [0, 0, 0]);
  for (const x of [-0.68, 0.68]) {
    box(g, "Renfort dessus", [0.12, 0.08, 1.25], "white", [x, 0.62, 0]);
    for (const z of [-0.64, 0.64])
      box(g, "Renfort vertical", [0.12, 1.21, 0.065], "white", [x, 0, z]);
  }
  for (const y of [-0.48, 0.48])
    for (const z of [-0.63, 0.63])
      box(g, "Traverse", [1.6, 0.11, 0.07], "white", [0, y, z]);
  box(g, "Étiquette", [0.49, 0.36, 0.022], "blue", [0.06, 0.08, 0.615]);
  for (const x of [-0.05, 0.16]) {
    box(
      g,
      "Flèche montant",
      [0.024, 0.2, 0.028],
      "yellow",
      [x, 0.08, 0.638],
      0.001,
    );
    part(
      g,
      "Pointe",
      new BoxGeometry(0.07, 0.07, 0.025),
      "yellow",
      [x, 0.18, 0.638],
      [0, 0, Math.PI / 4],
    );
  }
  for (const x of [-0.62, 0, 0.62])
    box(g, "Palette", [0.16, 0.12, 1.28], "wood", [x, -0.68, 0]);
  return g;
}
const out = new URL("../public/models/", import.meta.url);
await mkdir(out, { recursive: true });
for (const [name, scene] of [
  ["microscope", microscope()],
  ["laboratory", laboratory()],
  ["transport-crate", crate()],
]) {
  scene.updateMatrixWorld(true);
  const buffer = await new GLTFExporter().parseAsync(scene, {
    binary: true,
    onlyVisible: true,
  });
  await writeFile(new URL(`${name}.glb`, out), Buffer.from(buffer));
}
