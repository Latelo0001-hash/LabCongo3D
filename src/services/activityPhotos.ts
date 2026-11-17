import { activityPhotos } from "../data/activityPhotos";
import { publishedProjects } from "./editorial";
import type { GalleryImage } from "../types/gallery";

export function getActivityPhotos(): GalleryImage[] {
  const candidates = [
    ...activityPhotos,
    ...publishedProjects().filter(project => project.status === "completed")
      .flatMap(project => project.gallery ?? []),
  ];
  const seen = new Set<string>();
  return candidates.filter(image => {
    if (!image.src.trim() || !image.alt.trim() || seen.has(image.src)) return false;
    seen.add(image.src);
    return true;
  }).map((image, index) => ({ ...image, id: `activity-${index}-${image.id}` }));
}

