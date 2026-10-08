import type { NarrativePhoto } from "../features/experience/photos";

// Contenu repris de la présentation de LabCongo (« LabCongo Presentation fin .pptx »), fournie par l'association.
// Les chiffres de l'enjeu décrivent le contexte de la RDC, avec leurs sources : ce ne sont pas des résultats de LabCongo.

export const quote = {
  text: "Je n’enseigne jamais à mes élèves. Je cherche seulement à créer les conditions dans lesquelles ils peuvent apprendre.",
  author: "Albert Einstein",
  role: "Physicien, prix Nobel de physique",
  context: "En RDC, ces conditions restent encore insuffisamment accessibles.",
};

// Les titres viennent de la présentation ; les phrases les relient aux constats de l'enjeu.
export const findings = [
  {
    title: "Des infrastructures insuffisantes",
    text: "Les laboratoires et le matériel nécessaires aux travaux pratiques restent insuffisamment accessibles aux élèves.",
  },
  {
    title: "Un déficit de compétences spécialisées",
    text: "Le pays a besoin de davantage de compétences scientifiques et techniques, en particulier pour les responsabilités à forte valeur ajoutée.",
  },
  {
    title: "Un paradoxe national",
    text: "La richesse minière est au cœur de l’économie congolaise. Le défi est d’en faire une richesse humaine.",
  },
];

export const stakes = {
  title: "Transformer la richesse minière en richesse humaine",
  lead: "La RDC a déjà largement localisé les emplois. Le prochain défi est de localiser davantage les compétences et les responsabilités à forte valeur ajoutée.",
  figures: [
    { value: "37,9 %", label: "du PIB réel", detail: "Secteur extractif · RDC · 2023", source: "ITIE-RDC 2023" },
    { value: "≈ 95 %", label: "des effectifs", detail: "Congolais · Kibali", source: "Barrick/Kibali" },
    { value: "31 %", label: "du management", detail: "Congolais · Kamoa-Kakula · 2024", source: "Ivanhoe Mines 2024" },
  ],
  conclusion: "Le véritable enjeu : faire émerger les femmes et les hommes capables de concevoir, construire et diriger l’industrie congolaise.",
  sources: "Sources : ITIE-RDC 2023 · Barrick/Kibali · Ivanhoe Mines 2024",
};

export const response = {
  title: "Une ASBL au service de la formation scientifique et technique des jeunes",
  lead: "LabCongo met à la disposition des élèves un environnement pratique et moderne pour apprendre en manipulant, en expérimentant et en développant les compétences dont la RDC a besoin.",
  pillars: [
    { title: "Un ancrage en RDC", text: "LabCongo est une ASBL créée à Kinshasa, dédiée à l’éducation scientifique et technique des jeunes congolais." },
    { title: "Une réponse concrète", text: "Créer ou réhabiliter des laboratoires scolaires et accompagner leur utilisation à travers des équipements, des formations et un suivi." },
    { title: "Notre mission", text: "Susciter l’intérêt des jeunes pour les sciences de base et les préparer aux métiers des secteurs stratégiques de la RDC." },
  ],
};

export const approach = {
  title: "Des laboratoires équipés, des encadreurs formés et des jeunes accompagnés",
  steps: [
    { number: "01", title: "Équiper", text: "Aménager et doter des laboratoires adaptés aux besoins des établissements (sciences physiques, chimiques, biologiques et technologiques)." },
    { number: "02", title: "Former et accompagner", text: "Renforcer les compétences des encadreurs et organiser des travaux pratiques réguliers et structurés pour les élèves." },
    { number: "03", title: "Pérenniser et relier", text: "Mettre en place un mentorat et des stages, créer des passerelles vers l’enseignement supérieur et les secteurs stratégiques (dont les mines), et assurer la maintenance des équipements." },
  ],
};

export const phases = {
  title: "Une approche progressive pour des résultats durables",
  steps: [
    { number: "01", title: "Diagnostic", text: "Cartographier les besoins, évaluer les infrastructures et définir les priorités." },
    { number: "02", title: "Projet pilote", text: "Équiper un nombre limité d’établissements et tester le modèle d’accompagnement." },
    { number: "03", title: "Projet intégré", text: "Étendre le modèle à plusieurs établissements et l’intégrer dans les systèmes éducatifs et les filières stratégiques (dont les mines)." },
    { number: "04", title: "Pérennisation", text: "Assurer la maintenance, renforcer les compétences locales et institutionnaliser le modèle." },
    { number: "05", title: "Évaluation", text: "Mesurer les résultats, capitaliser les bonnes pratiques et ajuster pour un nouveau cycle plus ambitieux." },
  ],
};

export const diagnostic = {
  title: "Un état des lieux complet pour identifier les besoins et prioriser les actions",
  axes: [
    { title: "Cartographie et inventaire", items: ["Localisation des établissements", "Types et niveaux d’enseignement", "Infrastructures et laboratoires existants", "Équipements disponibles"] },
    { title: "État et fonctionnalité", items: ["État des infrastructures", "État et fonctionnement des équipements", "Accès à l’énergie, à l’eau et à la connectivité", "Sécurité des laboratoires"] },
    { title: "Enseignants et pratiques pédagogiques", items: ["Profil et compétences des enseignants", "Formation continue", "Fréquence et qualité des travaux pratiques", "Encadrement des élèves"] },
    { title: "Programmes et compétences", items: ["Analyse des curricula et contenus", "Adéquation avec les besoins actuels", "Intégration des compétences pratiques", "Alignement avec les secteurs stratégiques"] },
    { title: "Comparaison et bonnes pratiques", items: ["Benchmark régional et international", "Modèles de laboratoires et de formation", "Approches innovantes et partenariats", "Leçons pour le contexte congolais"] },
    { title: "Analyse des écarts et priorisation", items: ["Identification des écarts par établissement", "Classement et score de maturité", "Définition des établissements prioritaires", "Recommandations et plan d’action"] },
  ],
  challengesTitle: "Des contraintes importantes pour accéder à une information fiable et complète",
  challenges: [
    { challenge: "Données dispersées et peu consolidées", reality: "Informations réparties entre différentes directions, bureaux et projets.", consequence: "Recherche longue et fragmentée, qui complique un état des lieux fiable." },
    { challenge: "Accès institutionnel complexe", reality: "Accès aux personnes ressources et aux documents soumis à des autorisations et circuits administratifs.", consequence: "Délais importants pour obtenir les informations nécessaires." },
    { challenge: "Sources hétérogènes", reality: "Bases, rapports, programmes et données provenant de sources et formats différents.", consequence: "Données difficiles à croiser, comparer et harmoniser." },
    { challenge: "Informations inégalement accessibles", reality: "Certaines données existent dans des projets ou plateformes spécifiques (par exemple des appuis de partenaires).", consequence: "Une partie du système reste difficile à documenter." },
    { challenge: "Notoriété et moyens limités", reality: "Pour une ONG émergente, l’accès aux institutions et aux données est plus difficile.", consequence: "La collecte et la vérification des informations deviennent un véritable parcours." },
  ],
};

export const results = {
  title: "Développer un capital humain scientifique et technique pour une RDC plus compétitive et plus prospère",
  levers: ["Laboratoires plus fonctionnels", "Enseignants mieux formés", "Programmes adaptés", "Bonnes pratiques et partenariats"],
  outcomes: [
    { title: "Éducation scientifique renforcée", items: ["Plus d’élèves dans les filières scientifiques et techniques", "Compétences pratiques renforcées", "Attractivité accrue des métiers scientifiques"] },
    { title: "Un vivier de talents congolais", items: ["Plus de diplômés qualifiés dans les métiers des mines, de la transformation et des technologies", "Accès à des emplois qualifiés", "Plus de Congolais dans les postes de management"] },
    { title: "Préparation aux secteurs clés", items: ["Mines : réponse aux besoins en capital humain du secteur minier (exploitation, gestion, ingénierie, environnement…)", "Transformation locale : réponse aux besoins du secteur de la transformation (usines, raffinage, batteries…)"] },
    { title: "Impact pour la RDC", items: ["Augmentation de la contribution du secteur minier au PIB (vers 40 à 50 %)", "Développement d’une industrie de transformation compétitive", "Plus d’emplois qualifiés pour les Congolais", "Une économie plus diversifiée et résiliente"] },
  ],
  circle: {
    title: "Un cercle vertueux pour le développement national",
    steps: ["Capital humain renforcé", "Compétitivité du secteur minier et de la transformation", "Croissance économique inclusive", "Plus d’opportunités pour la jeunesse congolaise"],
    loop: "Réinvestissement dans l’éducation scientifique et technique",
  },
};

export const team = [{ name: "Kethia Grâce BAKAATO", role: "Vice-présidente" }];

// Images d'illustration de la présentation : elles ne montrent pas des actions de LabCongo.
const presentationImage = (name: string, width: number, height: number, caption: string, alt: string, position?: string): NarrativePhoto => ({
  src: `/images/presentation/${name}.jpg`,
  small: `/images/presentation/${name}-640.jpg`,
  width,
  height,
  caption,
  alt,
  position,
  author: "Présentation LabCongo",
  label: "Image d’illustration",
});

export const presentationPhotos = {
  travauxPratiques: presentationImage("travaux-pratiques", 1086, 1448, "Travaux pratiques en laboratoire", "Un enseignant et deux élèves en blouse et lunettes de protection pèsent un échantillon sur une balance de laboratoire.", "50% 30%"),
  siteMinier: presentationImage("site-minier", 1264, 842, "Un site minier", "Un technicien en casque et gilet de sécurité consulte des documents devant un camion de chantier, sur un site minier."),
  laboratoireScolaire: presentationImage("laboratoire-scolaire", 1086, 1448, "Un laboratoire scolaire équipé", "Une salle de laboratoire scolaire avec paillasses, microscopes, verrerie et matériel d’électricité.", "50% 55%"),
};
