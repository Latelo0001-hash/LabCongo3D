// Synthèses de la référence éditoriale du 19 octobre 2026 pour les cartes de l’accueil.
import { context, pillars, impactLevels } from "./editorialContent";
export const homeFindings = context.findings;
export const homeApproach = pillars.map(({ number, label, summary }) => ({ number, title: label, text: summary }));
export const homeOutcomes = impactLevels;
