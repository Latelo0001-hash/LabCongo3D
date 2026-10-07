import type { GalleryImage } from "./gallery";
export interface Project {
  id: string;
  slug: string;
  name: string;
  summary: string;
  location: string;
  status: "planned" | "in_progress" | "completed";
  publicationStatus: "draft" | "published";
  sections: { title: string; text: string }[];
  schoolIds: string[];
  image?: { src: string; alt: string };
  gallery?: GalleryImage[];
  updatedAt: string;
}
