import { schools } from "../../../data/schools";
import { provinces } from "../../../data/provinces";
import type { School, SchoolStatus } from "../../../types/school";
export interface SchoolFilters {
  search?: string;
  province?: string;
  status?: string;
}
export const schoolStatusLabels: Record<SchoolStatus, string> = {
  identified: "Besoins identifiés",
  in_progress: "Équipement en préparation",
  equipped: "École équipée",
};
export function provinceName(code: string) {
  return provinces.find((province) => province.code === code)?.name ?? code;
}
function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .trim();
}
export function filterSchools(
  catalog: readonly School[],
  filters: SchoolFilters = {},
): School[] {
  const words = normalize(filters.search ?? "")
    .split(/\s+/)
    .filter(Boolean);
  return catalog
    .filter((school) => {
      if (school.publicationStatus !== "published") return false;
      if (filters.province && school.provinceCode !== filters.province)
        return false;
      if (filters.status && school.status !== filters.status) return false;
      const text = normalize(
        [school.name, school.city, provinceName(school.provinceCode)].join(" "),
      );
      return words.every((word) => text.includes(word));
    })
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));
}
export function getPublishedSchools(filters: SchoolFilters = {}): School[] {
  return filterSchools(schools, filters);
}
export function findPublishedSchool(
  slug: string | undefined,
): School | undefined {
  return schools.find(
    (school) =>
      school.publicationStatus === "published" && school.slug === slug,
  );
}
export function schoolPath(school: School) {
  return `/ecoles/${encodeURIComponent(school.slug)}`;
}
