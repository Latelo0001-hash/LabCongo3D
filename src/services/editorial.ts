import { projects } from "../data/projects";
import { articles } from "../data/articles";
export const projectStatuses = {
  planned: "En préparation",
  in_progress: "En cours",
  completed: "Réalisé",
} as const;
export const articleCategories = {
  projet: "Vie du projet",
  collecte: "Collecte",
  terrain: "Sur le terrain",
} as const;
export function normalizedText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .trim();
}
export const publishedProjects = () =>
  projects.filter((item) => item.publicationStatus === "published");
export const publishedArticles = () =>
  articles
    .filter(
      (item) =>
        item.publicationStatus === "published" &&
        Number.isFinite(Date.parse(item.publishedAt)) &&
        Date.parse(item.publishedAt) <= Date.now(),
    )
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
export const displayDate = (date: string) =>
  new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
