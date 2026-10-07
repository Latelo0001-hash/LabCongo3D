import { between } from '../immersive/timeline';

// Un seul progrès (0 → 1) pilote la séquence : camion, route, raccord vidéo et carte.
export const cards = [
  { id: 'route', from: .02, to: .31, place: 'top-left', tone: 'dark', kicker: '06 / La route · Le transfert', title: 'Prendre la route du port.', text: 'Le conteneur rejoint sa remorque. Un camion l’achemine jusqu’au port d’embarquement.' },
  { id: 'navire', from: .57, to: .73, place: 'center', tone: 'light', kicker: '07 / La traversée · Le navire', title: 'Acheminer là où le matériel peut faire la différence.', text: '' },
  { id: 'ocean', from: .75, to: .88, place: 'bottom-left', tone: 'light', kicker: '08 / Europe → Afrique → RDC', title: 'Traverser pour transmettre.', text: 'Le conteneur embarque pour un long voyage, jusqu’à la République démocratique du Congo.' },
  { id: 'arrivee', from: .9, to: 1.01, place: 'left', tone: 'light', kicker: '09 / L’arrivée · La RDC', title: 'Une nouvelle étape commence.', text: 'Le matériel arrive en RDC. Il peut désormais rejoindre les écoles.' },
] as const;

export const milestones = ['Collecte · Europe', 'Route · vers le port', 'Port · embarquement', 'Traversée · océan', 'Arrivée · RDC'];

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
export const travel = (p: number) => 25 + 48 * between(p, .12, .36) + 47 * between(p, .34, .5) + 22 * between(p, .5, .62);

// Cadrages : vue de profil puis vue du ciel, élargis sur les écrans étroits.
export const fov = 20;
export function framing(aspect: number) {
  return { side: 30 * Math.max(1, 1.75 / aspect), top: 78 * Math.max(1, 1.25 / aspect) };
}

// Largeur de la route vue du ciel, en fraction de l'écran : la vidéo du navire s'ouvre dans ce couloir.
export function stripWidth(aspect: number) {
  const height = 2 * framing(aspect).top * Math.tan(fov / 2 * Math.PI / 180);
  return road.width / (height * aspect);
}
