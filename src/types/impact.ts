export interface Statistic {
  id: string;
  label: string;
  value: number;
  unit?: string;
  source: string;
  period: string;
  publicationStatus: "draft" | "published";
}
export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  context: string;
  publicationStatus: "draft" | "published";
  consentToPublish: boolean;
}
