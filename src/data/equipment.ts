import type { Equipment } from "../types/equipment";
// Familles de matériel présentées à titre pédagogique, pas un inventaire de dons.
export const equipment: readonly Equipment[] = [
  {
    id: "optique",
    slug: "microscopes-et-optique",
    name: "Microscopes & optique",
    purpose: "observer",
    summary: "Rendre visible ce que l’œil seul ne distingue pas.",
    description:
      "Les instruments d’optique donnent une autre échelle à l’observation. Ils permettent de décrire, comparer et dessiner ce que les élèves découvrent, en lien avec les activités choisies par l’enseignant.",
    examples: ["Microscopes optiques", "Loupes", "Lames et lamelles"],
    uses: [
      "Observer des structures fines",
      "Comparer des échantillons",
      "Développer le sens de l’observation",
    ],
    donationDetails: [
      "Marque et modèle de l’instrument",
      "État de l’optique et de l’éclairage",
      "Accessoires et documentation disponibles",
    ],
  },
  {
    id: "verrerie",
    slug: "verrerie-de-laboratoire",
    name: "Verrerie de laboratoire",
    purpose: "experimenter",
    summary: "Donner une forme concrète aux expériences en classe.",
    description:
      "La verrerie accompagne la manipulation et l’observation des phénomènes. Les formats et les quantités sont à adapter aux activités pédagogiques et aux conditions d’accueil de chaque établissement.",
    examples: ["Béchers et fioles", "Éprouvettes graduées", "Tubes à essai"],
    uses: [
      "Observer et comparer des volumes",
      "Apprendre à utiliser le matériel de laboratoire",
      "Consigner les étapes d’une expérience",
    ],
    donationDetails: [
      "Type et contenance des pièces",
      "Quantités et état de la verrerie",
      "Photos permettant d’identifier le matériel",
    ],
  },
  {
    id: "mesure",
    slug: "balances-et-mesure",
    name: "Balances & instruments de mesure",
    purpose: "mesurer",
    summary: "Passer d’une impression à une mesure que l’on peut comparer.",
    description:
      "Mesurer, noter et comparer les résultats fait partie de la démarche scientifique. Balances et instruments de mesure aident les élèves à relier les grandeurs étudiées à des observations concrètes.",
    examples: [
      "Balances",
      "Thermomètres de laboratoire",
      "Instruments de mesure adaptés aux cours",
    ],
    uses: [
      "Mesurer des grandeurs physiques",
      "Organiser les résultats dans un tableau",
      "Comparer des observations successives",
    ],
    donationDetails: [
      "Grandeurs et plages de mesure",
      "État de fonctionnement et alimentation",
      "Accessoires et notice disponibles",
    ],
  },
  {
    id: "supports",
    slug: "supports-et-accessoires",
    name: "Supports & accessoires",
    purpose: "organiser",
    summary: "Préparer un espace où chaque outil trouve sa place.",
    description:
      "Les accessoires complètent les instruments principaux. Supports, pinces et rangements contribuent à l’organisation des postes et à la préparation du matériel pour les activités encadrées.",
    examples: [
      "Statifs et pinces",
      "Portoirs pour tubes",
      "Boîtes et supports de rangement",
    ],
    uses: [
      "Organiser un poste de travail",
      "Préparer le matériel d’une séance",
      "Ranger et retrouver les instruments",
    ],
    donationDetails: [
      "Dimensions et matériaux",
      "Compatibilité avec les instruments concernés",
      "Quantités, état et photos",
    ],
  },
];
