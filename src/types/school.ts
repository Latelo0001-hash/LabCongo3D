export type SchoolStatus = "identified" | "in_progress" | "equipped";
export interface School {
  id: string;
  slug: string;
  name: string;
  provinceCode: string;
  city: string;
  summary: string;
  description: string;
  status: SchoolStatus;
  publicationStatus: "draft" | "published";
  needs: string[];
  equipment: string[];
  image?: { src: string; alt: string };
  studentsCount?: number;
}
