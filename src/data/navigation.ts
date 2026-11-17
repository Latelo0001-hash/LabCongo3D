// Pages essentielles, regroupées le 22 octobre 2026.
export const navigation = [
  { label: "Accueil", to: "/" },
  { label: "À propos", to: "/a-propos" },
  { label: "Notre approche", to: "/notre-approche" },
  { label: "Projet pilote", to: "/projet-pilote" },
  { label: "Activités & réalisations", to: "/activites-realisations" },
  { label: "Nous soutenir", to: "/nous-soutenir" },
  { label: "Contact", to: "/contact" },
];
// Sélection courte pour le footer.
export const footerNavigationGroups = [
  { title: "Comprendre", links: navigation.filter(({ to }) => ["/a-propos", "/notre-approche"].includes(to)) },
  { title: "Découvrir", links: navigation.filter(({ to }) => to === "/activites-realisations") },
  { title: "Participer", links: navigation.filter(({ to }) => ["/nous-soutenir", "/contact"].includes(to)) },
];
