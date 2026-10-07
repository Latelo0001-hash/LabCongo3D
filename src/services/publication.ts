import { statistics } from "../data/statistics";
import { testimonials } from "../data/testimonials";
import { partners } from "../data/partners";
export const getStatistics = () =>
  statistics.filter(
    (item) =>
      item.publicationStatus === "published" &&
      Number.isFinite(item.value) &&
      item.value >= 0 &&
      item.source.trim() &&
      item.period.trim(),
  );
export const getTestimonials = () =>
  testimonials.filter(
    (item) => item.publicationStatus === "published" && item.consentToPublish,
  );
export const getPartners = () =>
  partners.filter((item) => item.publicationStatus === "published");
export function safeWebsite(url?: string) {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    return ["https:", "http:"].includes(parsed.protocol)
      ? parsed.href
      : undefined;
  } catch {
    return undefined;
  }
}
