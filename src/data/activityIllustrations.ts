import type { GalleryImage } from "../types/gallery";

// Mises en situation générées à la demande de l'utilisateur, distinctes des photos d'interventions.
export const activityIllustrations: readonly GalleryImage[] = [
  {
    id: "simulation-collecte",
    src: "/images/activities/illustrations/collecte.jpg",
    alt: "Mise en situation générée : des bénévoles contrôlent un microscope et inventorient du matériel scientifique.",
    caption: "Contrôler et inventorier le matériel",
  },
  {
    id: "simulation-expedition",
    src: "/images/activities/illustrations/expedition.jpg",
    alt: "Mise en situation générée : deux bénévoles préparent des caisses de matériel devant un conteneur.",
    caption: "Préparer et protéger les équipements",
  },
  {
    id: "simulation-formation",
    src: "/images/activities/illustrations/formation.jpg",
    alt: "Mise en situation générée : une enseignante accompagne des élèves lors d’une observation au microscope.",
    caption: "Accompagner les travaux pratiques",
  },
];
