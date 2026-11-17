import type { NarrativePhoto } from "../features/experience/photos";

// Scènes générées pour illustrer le projet ; elles ne documentent pas des interventions.
const schoolPhoto = (name: string, caption: string, alt: string, version = "v2"): NarrativePhoto => ({
  src: `/images/rdc/${name}-${version}.jpg`,
  small: `/images/rdc/${name}-${version}-640.jpg`,
  width: 1536,
  height: 1024,
  caption,
  alt,
  author: "Illustration générée avec imagegen",
  label: "Image d’illustration",
});

export const homeSchoolPhotos = {
  practical: schoolPhoto("travaux-pratiques", "Apprendre en manipulant", "Illustration d’un enseignant et d’élèves du secondaire réalisant un circuit électrique simple dans une salle de classe congolaise."),
  laboratory: schoolPhoto("laboratoire-scolaire", "Un laboratoire à l’échelle d’une école", "Illustration d’une salle de sciences scolaire avec tables en bois, microscopes et matériel de base, éclairée par de grandes fenêtres."),
  microscope: schoolPhoto("microscope", "Accompagner les premiers gestes scientifiques", "Illustration d’une enseignante et de deux élèves du secondaire portant des blouses de laboratoire blanches pour une observation au microscope dans une classe congolaise.", "v3"),
};
