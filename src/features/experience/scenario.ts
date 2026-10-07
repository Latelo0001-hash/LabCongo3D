export interface StoryChapter {
  id: string;
  title: string;
  location: string;
  phase: "Collecter" | "Préparer" | "Acheminer" | "Équiper" | "Apprendre";
  description: string;
  message?: string;
  actions: readonly string[];
  camera: {
    from: [number, number, number];
    to: [number, number, number];
    target: [number, number, number];
  };
}
export const storyChapters: readonly StoryChapter[] = [
  {
    id: "rencontre",
    title: "Une rencontre en Europe",
    location: "Un centre scientifique · Europe",
    phase: "Collecter",
    description:
      "Deux hommes et une femme de l’équipe LabCongo arrivent dans un centre scientifique. Le parcours les conduit vers le laboratoire, à la rencontre des personnes qui y travaillent.",
    actions: ["Arriver", "Entrer", "Rencontrer"],
    camera: { from: [10, 6, 13], to: [4, 3.2, 8], target: [0, 1.3, 0] },
  },
  {
    id: "selection",
    title: "Reconnaître ce qui peut encore servir",
    location: "Dans le laboratoire",
    phase: "Collecter",
    description:
      "Avec les laborantins, l’équipe examine les microscopes, la verrerie, les balances et les instruments disponibles. Leur fonctionnement et leur utilité pédagogique guident la sélection.",
    message: "Du matériel encore utile peut continuer à transmettre le savoir.",
    actions: ["Observer", "Examiner", "Sélectionner"],
    camera: { from: [6, 5, 8], to: [2.3, 3.5, 5], target: [0, 1.2, 0] },
  },
  {
    id: "preparation",
    title: "Préparer avec méthode",
    location: "L’espace de préparation",
    phase: "Préparer",
    description:
      "Le matériel sélectionné est vérifié, protégé puis placé dans des caisses. Les équipements fragiles reçoivent un conditionnement adapté avant le chargement.",
    actions: ["Identifier", "Vérifier", "Protéger", "Conditionner"],
    camera: { from: [7, 5, 8], to: [4, 3.4, 5], target: [0, 1, 0] },
  },
  {
    id: "conteneur",
    title: "Organiser le chargement",
    location: "Le centre de collecte",
    phase: "Préparer",
    description:
      "Les caisses rejoignent le conteneur. L’équipe organise le chargement, vérifie l’ensemble puis ferme les portes avant le départ.",
    message: "Collecter en Europe. Préparer pour une nouvelle destination.",
    actions: ["Charger", "Vérifier", "Fermer"],
    camera: { from: [7, 4, 10], to: [5, 3.4, 8], target: [0, 1.3, 0] },
  },
  {
    id: "port",
    title: "Rejoindre le port",
    location: "Transport routier · Europe",
    phase: "Acheminer",
    description:
      "Un camion transporte le conteneur depuis le centre de collecte vers l’environnement portuaire. Le matériel rejoint la zone d’expédition.",
    actions: ["Prendre la route", "Arriver au port"],
    camera: { from: [9, 5, 10], to: [7, 4, 9], target: [0, 1, 0] },
  },
  {
    id: "traversee",
    title: "Relier les continents",
    location: "Europe → Afrique → RDC",
    phase: "Acheminer",
    description:
      "Le conteneur est chargé à bord d’un navire. Le bateau quitte le port et le trajet se prolonge vers la République démocratique du Congo. L’itinéraire présenté reste schématique.",
    message: "Acheminer le matériel là où il peut encore faire la différence.",
    actions: ["Embarquer", "Traverser", "Rejoindre la RDC"],
    camera: { from: [10, 6, 12], to: [13, 10, 15], target: [0, 1, 0] },
  },
  {
    id: "reception",
    title: "Une nouvelle étape commence",
    location: "Réception · République démocratique du Congo",
    phase: "Acheminer",
    description:
      "L’équipe locale prend en charge le conteneur. Les portes s’ouvrent, les caisses sont déchargées et rapprochées de leur inventaire.",
    message: "Une nouvelle étape commence.",
    actions: ["Ouvrir", "Décharger", "Contrôler"],
    camera: { from: [6, 4, 10], to: [4, 3, 7], target: [0, 1, 0] },
  },
  {
    id: "distribution",
    title: "Aller jusqu’aux écoles",
    location: "Distribution locale · RDC",
    phase: "Acheminer",
    description:
      "Le matériel poursuit son chemin dans des véhicules adaptés jusqu’aux établissements. Une attention particulière est portée aux provinces minières. Les lieux bénéficiaires seront affichés après validation.",
    actions: ["Organiser les tournées", "Rejoindre les établissements"],
    camera: { from: [8, 6, 10], to: [7, 4.5, 8], target: [0, 1, 0] },
  },
  {
    id: "ecole",
    title: "Arriver au plus près des élèves",
    location: "Une école · RDC",
    phase: "Équiper",
    description:
      "Enseignants et responsables accueillent l’équipe. Les caisses sont déchargées, puis transportées vers la salle destinée aux travaux pratiques.",
    actions: ["Accueillir", "Décharger", "Préparer la salle"],
    camera: { from: [11, 6, 13], to: [6, 3.8, 9], target: [0, 1.2, 0] },
  },
  {
    id: "installation",
    title: "Faire place à l’expérimentation",
    location: "La salle de travaux pratiques",
    phase: "Équiper",
    description:
      "La salle encore peu équipée se transforme progressivement. Microscopes, verrerie et instruments prennent place sur les tables ; les enseignants découvrent leur utilisation.",
    message: "Équiper pour permettre l’expérimentation.",
    actions: ["Installer", "Organiser", "Prendre en main"],
    camera: { from: [7, 5.5, 9], to: [5, 4, 7], target: [0, 1.1, 0] },
  },
  {
    id: "eleves",
    title: "La science prend vie",
    location: "Une séance pratique encadrée",
    phase: "Apprendre",
    description:
      "Les élèves entrent, découvrent les instruments et commencent une séance avec leur enseignant. L’observation, les gestes et les échanges autour de la table donnent du sens aux sciences.",
    actions: ["Découvrir", "Observer", "Expérimenter"],
    camera: { from: [6, 4.5, 8], to: [2.6, 2.8, 4.4], target: [0, 1.1, 0] },
  },
  {
    id: "transmission",
    title: "Un nouvel horizon pour le savoir",
    location: "LabCongo · La science en pratique",
    phase: "Apprendre",
    description:
      "La séance se poursuit autour des instruments. Le voyage du matériel prend tout son sens dans son utilisation, entre les mains des enseignants et des élèves.",
    message:
      "Donner une seconde vie au matériel scientifique. Offrir de nouvelles possibilités d’apprentissage.",
    actions: ["Collecter", "Préparer", "Acheminer", "Équiper", "Apprendre"],
    camera: { from: [5, 4, 7], to: [12, 9, 15], target: [0, 1.1, 0] },
  },
];
export const storyPhases = [
  "Collecter",
  "Préparer",
  "Acheminer",
  "Équiper",
  "Apprendre",
] as const;
export const chapterNumber = (index: number) =>
  String(index + 1).padStart(2, "0");
