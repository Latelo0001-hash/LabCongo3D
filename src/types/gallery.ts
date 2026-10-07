export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
}
export interface PhotoComparison {
  id: string;
  schoolId: string;
  title: string;
  publicationStatus: "draft" | "published";
  before: GalleryImage;
  after: GalleryImage;
}
