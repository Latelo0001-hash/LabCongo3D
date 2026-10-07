import {
  Building2,
  Microscope,
  PackageCheck,
  Container,
  Truck,
  Ship,
  School,
  GraduationCap,
} from "lucide-react";
import { storyChapters, chapterNumber } from "./scenario";
const icons = [
  Building2,
  Microscope,
  PackageCheck,
  Container,
  Truck,
  Ship,
  Container,
  Truck,
  School,
  Microscope,
  GraduationCap,
  GraduationCap,
];
export default function StoryFallback({ index }: { index: number }) {
  const Icon = icons[index];
  const chapter = storyChapters[index];
  return (
    <div className="story-fallback">
      <span className="story-fallback-number" aria-hidden="true">
        {chapterNumber(index)}
      </span>
      <Icon size={112} strokeWidth={0.8} aria-hidden="true" />
      <p>{chapter.location}</p>
      <div>
        {chapter.actions.map((action) => (
          <span key={action}>{action}</span>
        ))}
      </div>
    </div>
  );
}
