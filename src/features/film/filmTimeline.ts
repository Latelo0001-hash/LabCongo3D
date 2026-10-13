export const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
export const mix = (from: number, to: number, t: number) => from + (to - from) * t;
const ease = (t: number) => t * t * (3 - 2 * t);

// Le film se mesure en écrans de défilement : le progrès 0 → 1 couvre `screens` écrans.
export const screens = 12.92;
export const at = (p: number) => p * screens;
// Avancement adouci de 0 à 1 entre deux repères, en écrans.
export const seg = (x: number, from: number, to: number) => ease(clamp((x - from) / (to - from)));

export const chapters = [
  { label: 'Récolte', start: 0 },
  { label: 'Matériel', start: 1 },
  { label: 'Assemblage', start: 3.2 },
  { label: 'Conteneur', start: 4.9 },
  { label: 'Route', start: 6.9 },
  { label: 'Navire', start: 8.92 },
  { label: 'Traversée', start: 10.52 },
  { label: 'Arrivée', start: 12.12 },
] as const;
export const chapterAt = (x: number) => chapters.reduce((current, chapter, i) => x >= chapter.start - .05 ? i : current, 0);

// Message d'accueil, au-dessus du film : il s'efface à `to`, puis le premier chapitre prend le relais.
// Jusqu'à `cue`, la barre des chapitres laisse la place à l'invitation à défiler.
export const hero = { to: .34, cue: .12 } as const;

export const cards = [
  { id: 'recolte', from: .32, to: .8, place: 'left', tone: 'light', kicker: '01 / Europe · La récolte', title: 'Tout commence en Europe.', accent: 'en Europe.', text: 'Dans les laboratoires d’Europe, du matériel scientifique encore fonctionnel attend une seconde vie.' },
  { id: 'materiel', from: 1.15, to: 2.95, place: 'left', tone: 'light', kicker: '02 / La récolte · Le matériel', title: 'Du matériel encore utile peut continuer à transmettre le savoir.', accent: 'transmettre le savoir.', text: 'Microscopes, verrerie, balances, instruments de mesure : chaque équipement fonctionnel est repéré, puis rassemblé.' },
  { id: 'assemblage', from: 3.15, to: 4.55, place: 'left', tone: 'light', kicker: '03 / L’assemblage · Le soin', title: 'Protéger ce qui va transmettre.', accent: 'ce qui va transmettre.', text: 'Chaque instrument est vérifié, protégé, puis rejoint sa caisse.' },
  { id: 'conteneur', from: 4.85, to: 6.1, place: 'top-left', tone: 'dark', kicker: '04 / Le chargement · Le départ', title: 'Collecter en Europe. Préparer pour une nouvelle destination.', accent: 'une nouvelle destination.', text: '' },
  { id: 'route', from: 6.9, to: 7.8, place: 'top-left', tone: 'dark', kicker: '05 / La route · Le transfert', title: 'Prendre la route du port.', accent: 'du port.', text: 'Le conteneur rejoint sa remorque. Un camion l’achemine jusqu’au port d’embarquement.' },
  { id: 'navire', from: 8.87, to: 10.22, place: 'center', tone: 'light', kicker: '06 / La traversée · Le navire', title: 'Acheminer là où le matériel peut faire la différence.', accent: 'peut faire la différence.', text: '' },
  { id: 'ocean', from: 10.42, to: 11.72, place: 'bottom-left', tone: 'light', kicker: '07 / Europe → Afrique → RDC', title: 'Traverser pour transmettre.', accent: 'pour transmettre.', text: 'Le conteneur embarque pour un long voyage, jusqu’à la République démocratique du Congo.' },
  { id: 'arrivee', from: 11.92, to: 14.02, place: 'left', tone: 'light', kicker: '08 / L’arrivée · La RDC', title: 'Une nouvelle étape commence.', accent: 'commence.', text: 'Le matériel arrive en RDC. Il peut désormais rejoindre les écoles.' },
] as const;

// Ouverture : deux plans d'un même enfant qui fait une expérience de chimie, montés en une vidéo de 1920 × 1080.
// Le plan A (0 à 5 s) passe sous le premier titre ; à `cut`, le plan B le montre levant une bouteille.
// À `match`, le flacon 3D prend la place de la bouteille, puis rejoint la collecte. Repères en écrans.
export const opening = { cut: .6, reveal: [.55, .7], match: .9, width: 1920, height: 1080 } as const;
// Un front de fumée traverse l'écran. La vidéo disparaît derrière lui et révèle
// la 3D. Position et largeur communes aux masques et au calque filmé, dans les deux sens.
export const openingSmoke = {
  from: opening.match - .24,
  to: opening.match + .38,
  opacity: .72,
} as const;
export function openingSmokeAt(x: number, aspect = 16 / 9) {
  const { from, to, opacity } = openingSmoke;
  const time = clamp((x - from) / (to - from));
  // Fraction de largeur : un front plus large sur téléphone pour garder des volutes souples.
  const width = Math.max(.62, Math.min(.7 / Math.max(.1, aspect), 1.15));
  const left = mix(-width, 1, time);
  return {
    active: x > from && x < to,
    opacity: opacity * seg(time, 0, .14) * (1 - seg(time, .84, 1)),
    time, width, left,
    edge: left + width / 2,
    feather: width * .28,
  };
}

const span = (x: number, from: number, to: number, a: number, b: number) => mix(a, b, clamp((x - from) / (to - from)));
// Temps de la vidéo, linéaire par plan, pour que le flacon reste calé sur l'image.
export const openingTime = (x: number) => x < opening.cut ? span(x, 0, opening.cut, 0, 4.95) : span(x, opening.cut, opening.match + .3, 5, 7);
// Axe du visage de l'enfant au plan A, à garder dans le champ sur les écrans étroits.
export const face = { u: .6 } as const;
// Bouteille au raccord (plan B, 1 s) : axe horizontal, base et hauteur visible, en fraction de l'image.
export const bottle = { u: .445, base: .86, height: .53 } as const;

// Cadrage de la vidéo : « cover », décalé sur les écrans étroits pour garder dans le champ le visage au plan A,
// puis la bouteille au plan B ; le changement tombe sur la coupe. Sur un écran en hauteur, la vidéo se resserre
// ensuite en bandeau au-dessus des commandes (`controls`, en fraction de la hauteur), pour que la bouteille reste
// visible au moment du raccord.
export function openingFrame(width: number, height: number, x: number, controls: number) {
  const cover = Math.max(width / opening.width, height / opening.height);
  const portrait = width < height;
  const t = portrait ? seg(x, ...opening.reveal) : 0;
  const scale = mix(cover, width * 1.5 / opening.width, t);
  const w = opening.width * scale, h = opening.height * scale;
  const focus = x < opening.cut ? face.u : bottle.u;
  const left = w > width + 1 ? (width - w) * clamp((width / 2 - focus * w) / (width - w)) : (width - w) / 2;
  const top = mix((height - h) / 2, controls * height - 8 - h, t);
  return { w, h, left, top };
}

export const equipment = ['Microscopes', 'Verrerie', 'Balances', 'Instruments de mesure'];
// Rang du dernier équipement arrivé dans l'arc, pour la liste affichée pendant la récolte.
export const equipmentAt = (x: number) => x >= 2.5 ? 3 : x >= 2.1 ? 2 : x >= 1.3 ? 1 : 0;
export const steps = ['Identifier', 'Vérifier', 'Protéger', 'Conditionner'];
export const milestones = ['Collecte · Europe', 'Route · vers le port', 'Port · embarquement', 'Traversée · océan', 'Arrivée · RDC'];

// Atelier de la récolte, à l'écart de la route ; l'arc des objets se tient à droite du titre.
export const workshop = { x: -69.4, arcX: -67.9, arcY: 1.9 } as const;

// Route : tout droit vers +X (la droite de l'écran), quart de tour, puis vers +Z (le bas de l'écran vu du ciel).
export const road = { width: 8, depth: 7, startX: -30, turnX: 40, radius: 14, exitLength: 90 } as const;
const straightLength = road.turnX - road.startX;
const arcLength = Math.PI / 2 * road.radius;
export const roadLength = straightLength + arcLength + road.exitLength;

export function roadPoint(s: number) {
  if (s <= straightLength) return { x: road.startX + s, z: 0 };
  if (s <= straightLength + arcLength) {
    const angle = -Math.PI / 2 + (s - straightLength) / road.radius;
    return { x: road.turnX + road.radius * Math.cos(angle), z: road.radius + road.radius * Math.sin(angle) };
  }
  return { x: road.turnX + road.radius, z: road.radius + s - straightLength - arcLength };
}

// Distance parcourue par l'attelage le long de la route, en mètres.
export const travel = (x: number) => 25 + 48 * seg(x, 7.15, 7.75) + 47 * seg(x, 7.7, 8.52) + 12 * seg(x, 8.52, 9.12);

// Cadrages, élargis sur les écrans étroits : atelier, vue de profil puis vue du ciel.
export const fov = 20;
const spread = 2 * Math.tan(fov / 2 * Math.PI / 180);
export function framing(aspect: number) {
  return {
    studio: Math.max(13 * Math.max(1, 1.75 / aspect), 4.8 / (spread * aspect)),
    side: 30 * Math.max(1, 1.75 / aspect),
    top: 78 * Math.max(1, 1.25 / aspect),
  };
}

// Largeur de la route vue du ciel, en fraction de l'écran : la vidéo du navire s'ouvre dans ce couloir.
export function stripWidth(aspect: number) {
  return road.width / (framing(aspect).top * spread * aspect);
}

// Dans le plan du pont, le navire est centré à 48,5 % de la largeur : la route vue du ciel s'aligne sur ce couloir.
export const deckLane = .485;
export function laneOffset(aspect: number) {
  return (.5 - deckLane) * framing(aspect).top * spread * aspect;
}

// Fond de scène : atelier sombre, puis le jour de la logistique.
const dark = [7, 20, 48], light = [233, 232, 228];
export const backdrop = (x: number) => dark.map((value, i) => Math.round(mix(value, light[i], seg(x, 4.6, 5)))).join(', ');
