// Arborescence validée dans le document de référence du 19 octobre 2026.
export const navigation = [
  { label: "À propos", to: "/a-propos" },
  { label: "Notre approche", to: "/notre-approche" },
  { label: "Projet pilote", to: "/projet-pilote" },
  { label: "Écoles & réalisations", to: "/ecoles" },
  { label: "Impact", to: "/impact" },
  { label: "Partenaires", to: "/partenaires" },
  { label: "Actualités", to: "/actualites" },
  { label: "Nous soutenir", to: "/nous-soutenir" },
  { label: "Contact", to: "/contact" },
];
// Regroupement réservé au pied de page ; le bandeau et le menu mobile utilisent les liens directs.
export const navigationGroups = [
  { title: "Comprendre", description: "LabCongo et sa démarche", links: navigation.slice(0, 3) },
  { title: "Découvrir", description: "Les actions et leurs résultats", links: navigation.slice(3, 7) },
  { title: "Participer", description: "Construire le projet ensemble", links: navigation.slice(7) },
];
