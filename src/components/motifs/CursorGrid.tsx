import { useEffect, useRef } from "react";

// Grille révélée au passage du curseur, à la manière de movix.fun : la cellule survolée s'allume, ses voisines aussi,
// puis elles s'éteignent peu à peu derrière le curseur, qu'un halo accompagne. Elle reprend les hexagones du réseau
// moléculaire de la texture (tuile de 84 × 48). Souris seulement, et rien si les animations sont réduites.
type Cell = { a: number; b: number };

const fade = 700; // durée d'extinction d'une cellule, en ms
const hex = { step: 42, height: 48, side: 28, half: 14, rise: 24 };

// Centre de l'hexagone (colonne a, rangée b) : les colonnes impaires sont décalées d'une demi-hauteur.
const hexCenter = (a: number, b: number) => ({ x: a * hex.step, y: b * hex.height + (Math.abs(a) % 2 === 1 ? hex.rise : 0) });

function locate(x: number, y: number): Cell {
  const around = Math.round(x / hex.step);
  let best: Cell = { a: around, b: 0 }, distance = Infinity;
  for (let a = around - 1; a <= around + 1; a++) {
    const b = Math.round((y - (Math.abs(a) % 2 === 1 ? hex.rise : 0)) / hex.height);
    const center = hexCenter(a, b);
    const d = Math.hypot(center.x - x, center.y - y);
    if (d < distance) { distance = d; best = { a, b }; }
  }
  return best;
}

function neighbors({ a, b }: Cell): Cell[] {
  const shift = Math.abs(a) % 2 === 1 ? 0 : -1;
  return [{ a, b: b - 1 }, { a, b: b + 1 }, { a: a - 1, b: b + shift }, { a: a - 1, b: b + shift + 1 }, { a: a + 1, b: b + shift }, { a: a + 1, b: b + shift + 1 }];
}

function trace(context: CanvasRenderingContext2D, { a, b }: Cell) {
  const { x, y } = hexCenter(a, b);
  context.beginPath();
  context.moveTo(x - hex.side, y);
  context.lineTo(x - hex.half, y - hex.rise);
  context.lineTo(x + hex.half, y - hex.rise);
  context.lineTo(x + hex.side, y);
  context.lineTo(x + hex.half, y + hex.rise);
  context.lineTo(x - hex.half, y + hex.rise);
  context.closePath();
}

export function CursorGrid({ color }: { color: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current, field = element?.parentElement;
    const context = element?.getContext("2d");
    if (!element || !field || !context) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ratio = Math.min(2, window.devicePixelRatio || 1);
    const lit = new Map<string, Cell & { life: number }>();
    let current: string | null = null, pointer: { x: number; y: number } | null = null;
    let frame = 0, last = 0;
    const key = ({ a, b }: Cell) => `${a}:${b}`;

    const resize = () => {
      element.width = Math.round(field.clientWidth * ratio);
      element.height = Math.round(field.clientHeight * ratio);
      draw();
    };
    const draw = () => {
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, element.width, element.height);
      if (pointer) {
        const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 170);
        glow.addColorStop(0, `rgb(${color} / .12)`);
        glow.addColorStop(1, `rgb(${color} / 0)`);
        context.fillStyle = glow;
        context.fillRect(pointer.x - 170, pointer.y - 170, 340, 340);
      }
      context.lineWidth = 1;
      context.lineJoin = "round";
      for (const cell of lit.values()) {
        trace(context, cell);
        context.fillStyle = `rgb(${color} / ${(cell.life * .06).toFixed(3)})`;
        context.fill();
        context.strokeStyle = `rgb(${color} / ${(cell.life * .85).toFixed(3)})`;
        context.stroke();
      }
    };
    const tick = (time: number) => {
      const step = last ? time - last : 16;
      last = time;
      for (const [name, cell] of lit) {
        if (name === current) continue;
        cell.life -= step / fade;
        if (cell.life <= 0) lit.delete(name);
      }
      draw();
      frame = lit.size > (current ? 1 : 0) ? requestAnimationFrame(tick) : 0;
      if (!frame) last = 0;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(tick); };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = field.getBoundingClientRect();
      const x = event.clientX - rect.left, y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        if (pointer) { pointer = null; current = null; schedule(); }
        return;
      }
      pointer = { x, y };
      const cell = locate(x, y), name = key(cell);
      if (name !== current) {
        current = name;
        lit.set(name, { ...cell, life: 1 });
        for (const next of neighbors(cell)) {
          const previous = lit.get(key(next));
          lit.set(key(next), { ...next, life: Math.max(previous?.life ?? 0, .45) });
        }
      }
      if (frame) return;
      draw();
      schedule();
    };
    const leave = () => { if (!pointer) return; pointer = null; current = null; schedule(); };

    const observer = new ResizeObserver(resize);
    observer.observe(field);
    window.addEventListener("pointermove", move, { passive: true });
    // Au défilement, la section glisse sous le curseur : la lumière s'éteint jusqu'au prochain mouvement.
    window.addEventListener("scroll", leave, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", leave);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [color]);
  return <canvas ref={canvas} className="motif-cursor" />;
}
