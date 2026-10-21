import type { CSSProperties } from "react";
import { CursorGrid } from "./CursorGrid";
import "./motifs.css";

// Motifs du thème : instruments de laboratoire au trait fin, dessinés en SVG dans un carré de 48 unités.
// Purement décoratifs : masqués aux technologies d'assistance, immobiles si les animations sont réduites.
const instruments = {
  erlenmeyer: "M18 5h12M20 5v13L9.5 38.6A3 3 0 0 0 12.2 43h23.6a3 3 0 0 0 2.7-4.4L28 18V5M13.6 31h20.8M22 37.5h.01M27 35h.01",
  becher: "M10 7h4v33a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7h4M14 14h5M14 20h7M14 26h5M14 32h20",
  eprouvette: "M18 5h12M20 5v33a4 4 0 0 0 8 0V5M20 27h8",
  microscope: "M10 43h26M29 43v-9c6-4 6-12 0-16M15 31h16M18 8l6-2 6 17-6 2zM17 5l6-2M24 25l1 4M29 26a2 2 0 1 0 4 0a2 2 0 1 0-4 0",
  balance: "M24 10v33M16 43h16M8 14h32M22 8a2 2 0 1 0 4 0a2 2 0 1 0-4 0M12 14l-5 12M12 14l5 12M36 14l-5 12M36 14l5 12M5 26h14a7 4 0 0 1-14 0M29 26h14a7 4 0 0 1-14 0",
  molecule: "M10 15a4 4 0 1 0 8 0a4 4 0 1 0-8 0M31 13a4 4 0 1 0 8 0a4 4 0 1 0-8 0M20 33a5 5 0 1 0 10 0a5 5 0 1 0-10 0M5 38a3 3 0 1 0 6 0a3 3 0 1 0-6 0M18 14.5l13-1M16.5 18.5l6 10.5M33 16.5l-5.5 12M20.3 34.8 11 37.3",
} as const;

// Position du centre (en % du cadre), taille (px), rotation (degrés), profondeur de parallaxe ;
// `accent` passe le motif en jaune ; `wide` le réserve aux écrans larges, `narrow` aux téléphones.
type Placement = { name: keyof typeof instruments; x: number; y: number; size: number; rotate?: number; depth?: number; accent?: boolean; wide?: boolean; narrow?: boolean };

const sets = {
  // Sur ordinateur, au-dessus et au-dessous du message ; sur téléphone, à droite du titre, sous le visage de l'enfant.
  hero: [
    { name: "molecule", x: 10, y: 9, size: 62, accent: true, depth: 1.3, wide: true },
    { name: "erlenmeyer", x: 42, y: 6, size: 54, rotate: 10, depth: .8, wide: true },
    { name: "microscope", x: 72, y: 11, size: 78, rotate: -6, depth: 1.5, wide: true },
    { name: "becher", x: 8, y: 91, size: 51, rotate: -8, depth: .7, wide: true },
    { name: "eprouvette", x: 54, y: 89, size: 59, rotate: 28, depth: 1.1, wide: true },
    { name: "balance", x: 88, y: 92, size: 68, depth: 1.2, wide: true },
    { name: "erlenmeyer", x: 91, y: 24, size: 40, rotate: 12, depth: .8, narrow: true },
    { name: "molecule", x: 89, y: 33, size: 40, accent: true, depth: 1.2, narrow: true },
  ],
  access: [
    { name: "becher", x: 4, y: 7, size: 46, rotate: -10, depth: .6, wide: true },
    { name: "eprouvette", x: 50, y: 9, size: 54, rotate: 30, depth: .9, wide: true },
    { name: "microscope", x: 67, y: 18, size: 108, rotate: -6, depth: 1.4 },
    { name: "erlenmeyer", x: 93, y: 7, size: 59, rotate: 14, depth: .8 },
    { name: "molecule", x: 60, y: 62, size: 78, accent: true, depth: 1.1, wide: true },
  ],
  problem: [
    { name: "becher", x: 86, y: 11, size: 65, rotate: -6, depth: 1 },
    { name: "molecule", x: 73, y: 19, size: 54, depth: 1.3, wide: true },
    { name: "eprouvette", x: 95, y: 26, size: 49, rotate: 22, depth: .8, wide: true },
  ],
  mission: [
    { name: "balance", x: 93, y: 9, size: 76, depth: 1.2 },
    { name: "eprouvette", x: 97, y: 68, size: 54, rotate: -20, depth: .9, wide: true },
    { name: "molecule", x: 50, y: 93, size: 59, accent: true, depth: 1, wide: true },
  ],
  impact: [
    { name: "erlenmeyer", x: 52, y: 5, size: 49, rotate: -12, depth: .8, wide: true },
    { name: "microscope", x: 92, y: 8, size: 86, rotate: 6, depth: 1.3 },
    { name: "molecule", x: 4, y: 96, size: 65, accent: true, depth: 1, wide: true },
  ],
  cta: [
    { name: "erlenmeyer", x: 64, y: 32, size: 94, rotate: -8, depth: 1.2, wide: true },
    { name: "microscope", x: 84, y: 22, size: 130, rotate: 4, depth: 1.5 },
    { name: "becher", x: 60, y: 74, size: 62, rotate: 10, depth: .8, wide: true },
    { name: "balance", x: 77, y: 68, size: 86, depth: 1, wide: true },
    { name: "molecule", x: 93, y: 60, size: 76, accent: true, depth: 1.3 },
  ],
} satisfies Record<string, Placement[]>;

// Fil du voyage de l'appel au don : la même route jaune en pointillés que sur la carte du film, à travers les instruments.
const thread = { path: "M42 100C50 88 56 78 64 70S80 56 86 42", end: { x: 86, y: 42 } };

// Textures de fond : trame de points sur les sections claires (dans l'esprit de rarsm.org), réseau moléculaire,
// rayons et halos sur les sections bleues, réseau et points scintillants autour du message d'accueil.
type Texture = "dots" | "lattice" | "hero";

// `bleed` étend le cadre à toute la largeur de l'écran, pour les sections limitées à la largeur du contenu.
export function MotifField({ set, texture, drift = true, route = false, bleed = false }: { set?: keyof typeof sets; texture?: Texture; drift?: boolean; route?: boolean; bleed?: boolean }) {
  const placements: Placement[] = set ? sets[set] : [];
  return (
    <div className={`motif-field${set ? ` is-${set}` : ""}${drift ? " is-drifting" : ""}${bleed ? " is-bleed" : ""}`} aria-hidden="true">
      {texture && <div className={`motif-texture is-${texture}`} />}
      {/* Au passage de la souris, le réseau moléculaire s'allume autour du curseur ; la trame de points reste fixe. */}
      {texture === "lattice" && <CursorGrid color="255 242 0" />}
      {route && (
        <>
          <svg className="motif-thread" viewBox="0 0 100 100" preserveAspectRatio="none"><path d={thread.path} /></svg>
          <span className="motif-stop" style={{ left: `${thread.end.x}%`, top: `${thread.end.y}%` }} />
        </>
      )}
      {placements.map((item, i) => (
        <svg
          key={i}
          className={`motif${item.accent ? " is-accent" : ""}${item.wide ? " is-wide" : ""}${item.narrow ? " is-narrow" : ""}`}
          viewBox="0 0 48 48"
          style={{ left: `${item.x}%`, top: `${item.y}%`, width: item.size, height: item.size, "--motif-rotate": `${item.rotate ?? 0}deg`, "--motif-depth": item.depth ?? 1 } as CSSProperties}
        >
          <path d={instruments[item.name]} />
        </svg>
      ))}
    </div>
  );
}
