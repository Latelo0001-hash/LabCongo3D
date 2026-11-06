export const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
export const mix = (from: number, to: number, t: number) => from + (to - from) * t;
const ease = (t: number) => t * t * (3 - 2 * t);

// Le film se mesure en écrans de défilement : le progrès 0 → 1 couvre `screens` écrans (voir `at`, après la sortie
// filmée). Il s'ouvre sur une traversée filmée de la salle, de -`prelude` à 0 écran ; la photo du laboratoire et toute la
// suite gardent leurs repères.
export const prelude = .5;
// Avancement adouci de 0 à 1 entre deux repères, en écrans.
export const seg = (x: number, from: number, to: number) => ease(clamp((x - from) / (to - from)));

export const chapters = [
  { label: 'Collecte', start: 0 },
  { label: 'Conteneur', start: 2.9 },
  { label: 'Route', start: 4.55 },
  { label: 'Navire', start: 6.57 },
  { label: 'Traversée', start: 7.47 },
  { label: 'Arrivée', start: 9.07 },
] as const;
export const chapterAt = (x: number) => chapters.reduce((current, chapter, i) => x >= chapter.start - .05 ? i : current, 0);

// Message d'accueil, au-dessus du film : il s'efface à `to`, au début de la traversée filmée.
// Jusqu'à `cue`, la barre des chapitres laisse la place à l'invitation à défiler.
export const hero = { to: -prelude + .34, cue: -prelude + .12 } as const;
// Traversée filmée de la salle : un plan généré à partir de la photo du laboratoire, à sens unique, que le défilement fait
// avancer sur sa plage (`span`, en écrans). La page s'ouvre un peu à l'intérieur de la salle ; sous le message d'accueil,
// la caméra recule doucement jusqu'au cadre exact de la photo, où la collecte commence (à 0). C'est le plan d'entrée dans
// la salle monté à l'envers, à vitesse régulière ; sa première image sert d'affiche en attendant la vidéo.
// `small` : une version 900p existe pour les petits écrans.
// Retirés : les plans aller-retour (caméra, arc, orbite, hauteur, approche), qui revenaient chaque fois sur la même image
// et donnaient l'impression de zooms répétés (16 octobre 2026) ; le gros plan sur la paillasse de gauche suivi d'un
// recul, dont le passage faisait un zoom brusque (20 octobre 2026). La traversée tient en 0,5 écran (0,9 puis 0,6 avant) :
// l'utilisateur trouvait trop longue l'attente du premier chapitre (remarques de l'utilisateur).
export const travelShots = [
  { name: 'salle', span: .5, small: true },
] as const;
// Plan en cours et avancement dans ce plan (0 → 1) à un repère du prélude.
export function travelAt(x: number) {
  let start = -prelude;
  for (let i = 0; i < travelShots.length; i += 1) {
    const end = start + travelShots[i].span;
    if (x < end || i === travelShots.length - 1) return { index: i, progress: clamp((x - start) / (end - start)) };
    start = end;
  }
  return { index: 0, progress: 0 };
}

// Derrière chaque texte, le fond s'assombrit (`.film-scrim`, du côté du texte) : tous les textes sont donc clairs.
export const cards = [
  // Le texte de la collecte apparaît pendant la fin du recul, juste avant l'arrivée sur la photo ; il s'efface avant que le
  // matériel ne traverse sa zone (voir `collect.clear`).
  { id: 'collecte', from: -.05, to: 1.05, place: 'top-left', tone: 'light', kicker: '01 / Europe · La collecte', title: 'Tout commence en Europe.', accent: 'en Europe.', text: 'Dans les laboratoires d’Europe, du matériel scientifique encore fonctionnel est repéré, vérifié, puis protégé dans des caisses pour une seconde vie.' },
  { id: 'conteneur', from: 2.95, to: 4.1, place: 'top-left', tone: 'light', kicker: '02 / Le chargement · Le départ', title: 'Collecter en Europe. Préparer pour une nouvelle destination.', accent: 'une nouvelle destination.', text: '' },
  { id: 'route', from: 4.55, to: 5.45, place: 'top-left', tone: 'light', kicker: '03 / La route · Le transfert', title: 'Prendre la route du port.', accent: 'du port.', text: 'Le conteneur rejoint sa remorque. Un camion l’achemine jusqu’au port d’embarquement.' },
  { id: 'navire', from: 6.52, to: 7.25, place: 'center', tone: 'light', kicker: '04 / La traversée · Le navire', title: 'Acheminer là où le matériel peut faire la différence.', accent: 'peut faire la différence.', text: '' },
  { id: 'ocean', from: 7.37, to: 8.67, place: 'bottom-left', tone: 'light', kicker: '05 / Europe → Afrique → RDC', title: 'Traverser pour transmettre.', accent: 'pour transmettre.', text: 'Le conteneur embarque pour un long voyage, jusqu’à la République démocratique du Congo.' },
  { id: 'arrivee', from: 8.87, to: 10.97, place: 'left', tone: 'light', kicker: '06 / L’arrivée · La RDC', title: 'Une nouvelle étape commence.', accent: 'commence.', text: 'Le matériel arrive en RDC. Il peut désormais rejoindre les écoles.' },
] as const;

// Ouverture : la salle de laboratoire de la photo (image générée de 1672 × 941), avec son matériel sur la paillasse
// du premier plan, puis la même photo, paillasse vidée. La caméra 3D reprend sa perspective : champ vertical, ligne
// d'horizon (le point de fuite de la salle) et hauteur d'œil, en mètres ; le plan de la paillasse est à `bench`.
export const lab = { width: 1672, height: 941, fov: 50, horizon: 385, eye: 1.25, bench: .9 } as const;
export const labFocal = lab.height / 2 / Math.tan(lab.fov / 2 * Math.PI / 180);
export const labPitch = Math.atan((lab.height / 2 - lab.horizon) / labFocal);

// Repères de la collecte, en écrans : le matériel 3D prend la place de celui de la photo (`swap`), les caisses se posent
// dans l'allée, chaque objet s'envole dans sa caisse, les couvercles se ferment, puis la photo s'efface et la caméra
// recule vers le conteneur (`leave`).
// Pendant l'envol (`clear`), le texte du chapitre s'efface et le voile marine s'allège : le matériel en mouvement reste
// dégagé et lisible ; les étapes, en bas, accompagnent la scène.
export const collect = { swap: [.28, .42], crates: [.36, .82], clear: [.85, 1.05], close: [1.92, 2.3], fade: [2.35, 2.65], leave: [2.42, 3.05] } as const;
// Sortie filmée (`labo-sortie.mp4`) : les caisses fermées, un fondu (`dissolve`, en écrans) mène devant les portes du
// fond de la salle ; la caméra marche jusqu'à la porte ouverte, la franchit vers la cour où attend le conteneur, et la
// lumière du dehors gagne l'image jusqu'à la couleur du fond clair (`light`), où la scène 3D du conteneur apparaît. Le
// défilement fait avancer le plan de `from` à `to`, en écrans, à la place du fondu de la photo (`collect.fade`, gardé si
// le plan n'est pas encore chargé). `walk` : part du plan où la marche s'arrête et où la lumière commence ; le cadrage
// suit la porte, puis le conteneur. Le plan est remonté à vitesse régulière : chaque pas de défilement change l'image
// d'autant.
export const exitShot = { from: collect.close[1], to: 2.95, dissolve: .1, walk: .72 } as const;
// Pendant la sortie, le plan couvre tout l'écran : la scène 3D n'a pas besoin d'être redessinée.
export const exitCovers = (x: number) => x > exitShot.from + exitShot.dissolve + .02 && x < exitShot.to - .07;
// Ralenti de la sortie : sur la plage de `exitShot`, le défilement avance `exitSlow` fois moins vite dans le film (la
// marche vers la porte paraissait trop rapide, remarque de l'utilisateur du 21 octobre 2026) ; la suite est repoussée
// d'autant. `at` donne le repère du film (en écrans) pour un progrès de 0 à 1, `progressAt` fait l'inverse.
// Sous 1000 px, le défilement au doigt traverse la marche par lancers : le ralenti y est plus fort (remarques de
// l'utilisateur, même jour : 1,55 trop rapide, 2,5 trop lent), et le dernier sous-titre reste plus longtemps (`caption`, voir `captionsEnd`) pour que la
// sortie ne reste pas trop longtemps sans texte. FilmSequence choisit le rythme selon la largeur de l'écran.
export const exitPaces = { wide: { slow: 1.55, caption: .22 }, narrow: { slow: 2, caption: .34 } } as const;
let exitPace: { slow: number; caption: number } = exitPaces.wide;
export const setExitPace = (pace: keyof typeof exitPaces) => { exitPace = exitPaces[pace]; };
const exitLength = exitShot.to - exitShot.from;
const exitExtra = () => exitLength * (exitPace.slow - 1);
// Longueur du film en écrans de défilement.
export const filmScreens = () => 9.87 + prelude + exitExtra();
export function at(p: number) {
  const r = p * filmScreens() - prelude;
  if (r <= exitShot.from) return r;
  if (r < exitShot.from + exitLength * exitPace.slow) return exitShot.from + (r - exitShot.from) / exitPace.slow;
  return r - exitExtra();
}
export function progressAt(x: number) {
  const r = x <= exitShot.from ? x : x < exitShot.to ? exitShot.from + (x - exitShot.from) * exitPace.slow : x + exitExtra();
  return (r + prelude) / filmScreens();
}
// Masque marine de la photo, côté texte : plein sous le message d'accueil, allégé ensuite (davantage sur un écran en
// hauteur, où le dégradé du bas servait au message), puis encore quand le texte s'efface pour l'envol du matériel.
// La 3D posée sur la photo reçoit le même masque.
export const openingMask = (x: number, aspect: number) =>
  mix(1, aspect < 1 ? .45 : .75, seg(x, hero.to - .1, hero.to + .15)) * mix(1, .4, seg(x, collect.clear[0], collect.clear[1]));
// La scène 3D se voit du raccord avec la photo au passage au navire (fondu fini à 6,87) : hors de cet intervalle,
// elle n'est ni redessinée ni affichée, pour laisser le téléphone décoder les vidéos et dessiner la carte.
export const sceneShown = (x: number) => x > collect.swap[0] - .02 && x < 6.9;

// Cadrage de la photo : « cover », puis des mouvements de caméra qui ne sont que des recadrages de l'image (zoom et
// point visé) ; la caméra 3D reprend exactement le même cadre, le matériel reste donc collé à la photo.
// Après la traversée filmée : lente avancée, gros plan sur la paillasse quand le matériel 3D prend le relais, recul pour
// suivre l'envol vers les caisses, puis avancée sur les caisses qui se ferment. Un écran en hauteur, déjà serré sur
// l'image, zoome moins et glisse de la paillasse vers les caisses pendant l'envol.
type Frame = { zoom: number; x: number; y: number };
const labMoves: { wide: [number, number, Frame][]; tall: [number, number, Frame][] } = {
  wide: [
    [0, .34, { zoom: 1.05, x: .17, y: .55 }],
    [.34, .72, { zoom: 1.15, x: .2, y: .68 }],
    [.78, 1.3, { zoom: 1, x: .3, y: .55 }],
    // Le cadre glisse vers les tables de droite, dont le matériel part après celui de la paillasse du premier plan.
    [1.3, 1.7, { zoom: 1, x: .62, y: .55 }],
    [1.85, 2.3, { zoom: 1.15, x: .6, y: .74 }],
  ],
  tall: [
    [0, .34, { zoom: 1.03, x: .17, y: .55 }],
    [.34, .72, { zoom: 1.08, x: .2, y: .66 }],
    [.78, 1.25, { zoom: 1, x: .56, y: .55 }],
    [1.3, 1.65, { zoom: 1, x: .78, y: .55 }],
    [1.85, 2.3, { zoom: 1.1, x: .6, y: .74 }],
  ],
};
export function labFrame(width: number, height: number, x: number) {
  const frame = { zoom: 1, x: .17, y: .5 };
  for (const [from, to, target] of labMoves[width > height ? 'wide' : 'tall']) {
    const t = seg(x, from, to);
    frame.zoom = mix(frame.zoom, target.zoom, t);
    frame.x = mix(frame.x, target.x, t);
    frame.y = mix(frame.y, target.y, t);
  }
  const scale = Math.max(width / lab.width, height / lab.height) * frame.zoom;
  const w = lab.width * scale, h = lab.height * scale;
  // Le point visé se place au centre de l'écran, sans jamais découvrir le bord de l'image.
  const place = (screen: number, size: number, focus: number) => size > screen + 1 ? (screen - size) * clamp((screen / 2 - focus * size) / (screen - size)) : (screen - size) / 2;
  return { w, h, left: place(width, w, frame.x), top: place(height, h, frame.y) };
}

export const steps = ['Identifier', 'Vérifier', 'Protéger', 'Conditionner'];
// Repère (en écrans) où chaque étape de la collecte s'allume. À partir de la deuxième, pendant que le matériel entre
// dans les caisses, un sous-titre l'explique (`captions`, jusqu'à `collect.close[1]`) : la séquence manquait de texte
// (remarque de l'utilisateur, 20 octobre 2026). Les mots reprennent la préparation décrite sur le site (`process`).
export const stepStarts = [.65, 1.1, 1.48, 1.86] as const;
export const captions = [
  { step: 1, title: 'Chaque appareil est vérifié.', text: 'Son fonctionnement est contrôlé et il est inventorié avant le départ.' },
  { step: 2, title: 'Protégé pour le voyage.', text: 'Chaque pièce trouve sa place dans une caisse préparée pour le transport.' },
  { step: 3, title: 'Prêt à partir.', text: 'Les caisses se ferment : le matériel est prêt à partir pour la RDC.' },
] as const;
// Plage d'un sous-titre : de son étape à la suivante. Le dernier (« Prêt à partir ») reste pendant le début de la marche
// vers la porte, pour que la sortie ne soit pas trop longue sans texte.
export const captionsEnd = () => exitShot.from + exitPace.caption;
export const captionRange = (step: number) => [stepStarts[step], stepStarts[step + 1] ?? captionsEnd()] as const;
export const milestones = ['Collecte · Europe', 'Route · vers le port', 'Port · embarquement', 'Traversée · océan', 'Arrivée · RDC'];

// Cour de chargement, à l'écart de la route : le conteneur s'arrête devant les caisses de la collecte.
export const yard = { x: -67.9 } as const;

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
export const travel = (x: number) => 25 + 48 * seg(x, 4.8, 5.4) + 47 * seg(x, 5.35, 6.17) + 12 * seg(x, 6.17, 6.77);

// Cadrages de la logistique, élargis sur les écrans étroits : chargement, vue de profil puis vue du ciel.
export const fov = 20;
const spread = 2 * Math.tan(fov / 2 * Math.PI / 180);
export function framing(aspect: number) {
  return {
    loading: 13 * Math.max(1, 1.75 / aspect) * 1.05,
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

// Fond de scène : sombre sous la photo du laboratoire, puis le jour de la logistique quand la photo s'efface.
const dark = [7, 20, 48], light = [233, 232, 228];
export const backdrop = (x: number) => dark.map((value, i) => Math.round(mix(value, light[i], seg(x, collect.fade[0] - .05, collect.fade[1])))).join(', ');
