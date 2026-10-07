export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: "projet" | "collecte" | "terrain";
  publicationStatus: "draft" | "published";
  publishedAt: string;
  image?: { src: string; alt: string; credit?: string };
  sections: { title: string; text: string }[];
}
