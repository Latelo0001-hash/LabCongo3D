// Photographs illustrate the intended journey; none are evidence of LabCongo interventions.
export interface NarrativePhoto {
  src: string;
  small: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  author: string;
  source?: string;
  license?: string;
  licenseUrl?: string;
  position?: string;
  // Mention affichée avant la légende (par défaut « Photographie d’illustration »).
  label?: string;
}
export const narrativePhotos: Record<string, NarrativePhoto> = {
  rencontre: {
    src: "/images/story/rencontre.jpg",
    small: "/images/story/rencontre-640.jpg",
    width: 1440,
    height: 960,
    caption: "Échanges au laboratoire",
    alt: "Des chercheurs échangent autour de tubes à essai au laboratoire.",
    position: "52% 45%",
    author: "Ressources photographiques fournies avec le projet",
  },
  instruments: {
    src: "/images/story/instruments.jpg",
    small: "/images/story/instruments-640.jpg",
    width: 1440,
    height: 961,
    caption: "Les gestes au laboratoire",
    alt: "Une scientifique manipule une pipette, près de verrerie et d’un microscope.",
    position: "60% 50%",
    author: "Ressources photographiques fournies avec le projet",
  },
  laboratoire: {
    src: "/images/story/laboratoire.jpg",
    small: "/images/story/laboratoire-640.jpg",
    width: 1440,
    height: 961,
    caption: "Verrerie et microscope",
    alt: "Verrerie, microscope et manipulation à la pipette sur une paillasse.",
    position: "45% 50%",
    author: "Ressources photographiques fournies avec le projet",
  },
  chargement: {
    src: "/images/story/chargement.jpg",
    small: "/images/story/chargement-640.jpg",
    width: 1280,
    height: 827,
    caption: "Manutention à IJmuiden, Pays-Bas · 2010",
    alt: "Un engin de manutention soulève un conteneur sur un camion à IJmuiden.",
    position: "50% 60%",
    author: "Joost J. Bakker from IJmuiden",
    source:
      "https://commons.wikimedia.org/wiki/File:Kalmar_Peinemann_reachstacker.jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
  },
  camion: {
    src: "/images/story/camion.jpg",
    small: "/images/story/camion-640.jpg",
    width: 1280,
    height: 853,
    caption: "Transport routier en Tchéquie · 2018",
    alt: "Un camion Scania transporte un conteneur sur une route en Tchéquie.",
    position: "55% 60%",
    author: "Midnight Runner",
    source:
      "https://commons.wikimedia.org/wiki/File:Scania_R420_Highline_6x2_-_Lados_-_L%C3%ADpa,_CZ.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  navire: {
    src: "/images/story/navire.jpg",
    small: "/images/story/navire-640.jpg",
    width: 1280,
    height: 700,
    caption: "Le YM Wholesome sur l’Elbe · 2015",
    alt: "Le porte-conteneurs YM Wholesome navigue sur l’Elbe, accompagné de remorqueurs.",
    position: "50% 60%",
    author: "hummelhummel",
    source:
      "https://commons.wikimedia.org/wiki/File:Container_ship_YM_Wholesome_on_the_river_Elbe_with_the_port_of_destination_Hamburg_in_August_2015.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  matadi: {
    src: "/images/story/matadi.jpg",
    small: "/images/story/matadi-640.jpg",
    width: 1280,
    height: 965,
    caption: "Matadi, République démocratique du Congo",
    alt: "Vue de la ville de Matadi depuis les hauteurs.",
    position: "50% 50%",
    author: "NGAMPUTU SAGE",
    source:
      "https://commons.wikimedia.org/wiki/File:Depuis_la_montagne_(cropped).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  ecole: {
    src: "/images/story/ecole.jpg",
    small: "/images/story/ecole-640.jpg",
    width: 1280,
    height: 853,
    caption: "Une classe à Goma, RDC · 2017",
    alt: "Des enfants en classe à Goma avec un livret d’apprentissage USAID/UKAID.",
    position: "55% 40%",
    author: "Julie Polumbo / USAID",
    source:
      "https://commons.wikimedia.org/wiki/File:Classroom_in_Goma,_Eastern_DRC_(25765237378).jpg",
    license: "Domaine public aux États-Unis (USAID)",
  },
  pratique: {
    src: "/images/story/pratique.jpg",
    small: "/images/story/pratique-640.jpg",
    width: 1024,
    height: 576,
    caption: "Travaux pratiques à Tiko, Cameroun · 2016",
    alt: "Des élèves du GBHS Tiko réalisent une séance de chimie dans leur laboratoire.",
    position: "45% 45%",
    author: "Agbor2017",
    source:
      "https://commons.wikimedia.org/wiki/File:Students_in_Science_Laboratory_in_GBHS.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  classe: {
    src: "/images/story/classe.jpg",
    small: "/images/story/classe-640.jpg",
    width: 1024,
    height: 576,
    caption: "Une séance de sciences au Cameroun · 2016",
    alt: "Des élèves manipulent des instruments autour des paillasses d’un laboratoire scolaire.",
    position: "55% 45%",
    author: "Agbor2017",
    source:
      "https://commons.wikimedia.org/wiki/File:Students_in_Science_Laboratory_01.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
};
export const chapterPhotos: Record<string, NarrativePhoto> = {
  rencontre: narrativePhotos.rencontre,
  selection: narrativePhotos.instruments,
  preparation: narrativePhotos.laboratoire,
  conteneur: narrativePhotos.chargement,
  port: narrativePhotos.camion,
  traversee: narrativePhotos.navire,
  reception: narrativePhotos.matadi,
  distribution: narrativePhotos.matadi,
  ecole: narrativePhotos.ecole,
  installation: narrativePhotos.classe,
  eleves: narrativePhotos.pratique,
  transmission: narrativePhotos.ecole,
};
