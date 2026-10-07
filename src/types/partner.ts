export interface Partner {
  id: string;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  publicationStatus: "draft" | "published";
}
