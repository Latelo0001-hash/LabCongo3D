// Allège les tracés des provinces (public/maps/rdc-provinces.json) par l'algorithme de Douglas-Peucker.
// Tolérance par défaut : 0,3 unité du repère 720 × 650, soit moins d'un demi-pixel sur la plus grande carte du site.
// Chaque anneau est simplifié séparément ; un nouveau passage avec la même tolérance ne retire presque plus rien.
// Usage : node scripts/simplify-provinces.mjs [tolérance]
import console from "node:console";
import { readFile, writeFile } from "node:fs/promises";
import process from "node:process";
import { URL } from "node:url";

const file = new URL("../public/maps/rdc-provinces.json", import.meta.url);
const tolerance = Number(process.argv[2] ?? 0.3);

function simplify(points) {
  if (points.length < 3) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = points[a], [bx, by] = points[b];
    const dx = bx - ax, dy = by - ay, length = Math.hypot(dx, dy);
    let farthest = -1, index = -1;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = points[i];
      const distance = length ? Math.abs(dy * px - dx * py + bx * ay - by * ax) / length : Math.hypot(px - ax, py - ay);
      if (distance > farthest) { farthest = distance; index = i; }
    }
    if (farthest > tolerance) {
      keep[index] = 1;
      stack.push([a, index], [index, b]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

const shapes = JSON.parse(await readFile(file, "utf8"));
let before = 0, after = 0;
const simplified = shapes.map(({ code, path }) => ({
  code,
  path: path.match(/M[^M]*/g).map((ring) => {
    const points = [...ring.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map((m) => [Number(m[1]), Number(m[2])]);
    const kept = simplify(points);
    before += points.length;
    after += kept.length;
    return "M" + kept.map(([x, y]) => `${x},${y}`).join("L") + (ring.trimEnd().endsWith("Z") ? "Z" : "");
  }).join(""),
}));
await writeFile(file, JSON.stringify(simplified));
console.log(`${before} points → ${after} (tolérance ${tolerance})`);
