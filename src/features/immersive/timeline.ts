// Un seul progrès (0 → 1) pilote la caméra, les objets et les textes.
export type Vec3 = readonly [number, number, number];
export const chapters = [
  { id: 'europe', label: 'Europe', place: '01 / Europe · La rencontre', title: 'Le savoir mérite un autre horizon.', text: 'Tout commence en Europe. LabCongo rencontre celles et ceux qui peuvent donner une seconde vie au matériel scientifique.', image: '/media/experience/web/europe.webp', alt: 'Illustration générée : trois membres de LabCongo devant un centre scientifique en Europe.', color: [0, 84, 166], side: 'left' },
  { id: 'laboratoire', label: 'Laboratoire', place: '02 / Dans le laboratoire · Le dialogue', title: 'Ouvrir la porte des possibles.', text: 'Avec les équipes du laboratoire, repérer les instruments disponibles et comprendre ce qu’ils peuvent encore transmettre.', image: '/media/experience/web/laboratoire.webp', alt: 'Illustration générée : l’équipe entre dans un laboratoire, à proximité d’une paillasse.', color: [3, 27, 78], side: 'right' },
  { id: 'materiel', label: 'Matériel', place: '03 / Le matériel · La sélection', title: 'Encore tant à faire découvrir.', text: 'Un microscope. De la verrerie. Une balance. Sélectionner le matériel fonctionnel, adapté aux besoins pédagogiques des écoles.', image: '/media/experience/web/materiel.webp', alt: 'Illustration générée : microscope, verrerie et balance sur une paillasse.', color: [156, 20, 34], side: 'left' },
  { id: 'conditionnement', label: 'Caisse', place: '04 / La préparation · Le soin', title: 'Protéger ce qui va transmettre.', text: 'Vérifier, inventorier et protéger chaque instrument. La caisse se referme sur une nouvelle possibilité d’apprentissage.', image: '/media/experience/web/conditionnement.webp', alt: 'Illustration générée : le microscope est préparé pour une caisse garnie de mousse.', color: [67, 44, 29], side: 'right' },
  { id: 'chargement', label: 'Conteneur', place: '05 / Le chargement · Le départ', title: 'Une nouvelle destination. La RDC.', text: 'Les caisses rejoignent le conteneur. Leur voyage doit se poursuivre jusqu’aux écoles, là où la science se met en pratique.', image: '/media/experience/web/chargement.webp', alt: 'Illustration générée : une caisse rejoint un conteneur bleu au centre de collecte.', color: [0, 52, 112], side: 'left' },
] as const;

export const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
export const mix = (from: number, to: number, t: number) => from + (to - from) * t;
export const ease = (t: number) => t * t * (3 - 2 * t);
export const between = (p: number, start: number, end: number) => ease(clamp((p - start) / (end - start)));
export const chapterIndex = (p: number) => Math.round(clamp(p) * (chapters.length - 1));

// Repères de caméra remplaçables sans modifier le moteur du récit.
export const cameraKeys: readonly { at: number; position: Vec3; target: Vec3; fov: number }[] = [
  { at: 0, position: [0, 0.25, 8.4], target: [0, 0, 0], fov: 38 },
  { at: 0.25, position: [0, 0.4, 8.1], target: [0, 0, 0], fov: 38 },
  { at: 0.5, position: [0, 0.15, 7.8], target: [0, 0, 0], fov: 38 },
  { at: 0.75, position: [0, 2.4, 8.8], target: [0, 0.15, 0], fov: 39 },
  { at: 1, position: [0, 0.6, 9.3], target: [0, 0, 0], fov: 39 },
];
export function sample(p: number) {
  const value = clamp(p) * 4;
  const index = Math.min(3, Math.floor(value));
  return { index, t: ease(value - index) };
}
export function interpolate(values: readonly number[], p: number) {
  const { index, t } = sample(p);
  return mix(values[index], values[index + 1], t);
}

export const models = {
  microscope: '/models/immersive/microscope-v2.glb',
  container: '/models/immersive/container-v2.glb',
  crate: '/models/immersive/crate-v2.glb',
} as const;
