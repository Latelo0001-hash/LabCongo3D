import { narrativePhotos } from "../features/experience/photos";
export const process = [
  {
    number: "01",
    title: "Collecter",
    location: "Belgique & France",
    text: "Identifier du matériel disponible auprès d’établissements, de laboratoires, d’entreprises et de donateurs, en fonction des besoins des écoles.",
    photo: narrativePhotos.rencontre,
  },
  {
    number: "02",
    title: "Préparer",
    location: "Avant le départ",
    text: "Vérifier le fonctionnement, inventorier les équipements et préparer leur conditionnement pour le transport.",
    photo: narrativePhotos.instruments,
  },
  {
    number: "03",
    title: "Acheminer",
    location: "Europe → RDC",
    text: "Organiser le transport et le suivi du matériel jusqu’à sa réception en République démocratique du Congo.",
    photo: narrativePhotos.navire,
  },
  {
    number: "04",
    title: "Équiper",
    location: "Dans les écoles",
    text: "Installer et tester les équipements dans un espace adapté aux activités scientifiques de l’établissement.",
    photo: narrativePhotos.laboratoire,
  },
  {
    number: "05",
    title: "Former",
    location: "Pour une utilisation durable",
    text: "Accompagner les enseignants et les élèves dans la prise en main du matériel et les pratiques de sécurité.",
    photo: narrativePhotos.pratique,
  },
] as const;
