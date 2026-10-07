export const modelCatalog = {
  microscope: {
    url: "/models/microscope.glb",
    label: "Microscope",
    description:
      "Un microscope, de son oculaire à sa platine : observer pour comprendre.",
  },
  laboratory: {
    url: "/models/laboratory.glb",
    label: "Laboratoire scolaire",
    description:
      "Une paillasse, des instruments et un espace pour expérimenter ensemble.",
  },
  crate: {
    url: "/models/transport-crate.glb",
    label: "Caisse de transport",
    description:
      "Du matériel identifié et protégé pour préparer son acheminement.",
  },
} as const;
export type ModelKind = keyof typeof modelCatalog;
