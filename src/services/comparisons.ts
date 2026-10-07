import { comparisons } from "../data/comparisons";
import { getPublishedSchools } from "../features/schools/services/catalog";
export function getPublishedComparisons(schoolId?: string) {
  const publishedSchools = new Set(
    getPublishedSchools().map((school) => school.id),
  );
  return comparisons.filter(
    (item) =>
      item.publicationStatus === "published" &&
      publishedSchools.has(item.schoolId) &&
      (!schoolId || item.schoolId === schoolId),
  );
}
