import { Expand } from "lucide-react";
import type { GalleryImage } from "../../types/gallery";
import Photo from "./Photo";
export default function GalleryItem({
  image,
  onOpen,
}: {
  image: GalleryImage;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      className="gallery-item"
      onClick={onOpen}
      aria-label={`Agrandir : ${image.alt}`}
    >
      <span className="gallery-thumbnail">
        <Photo key={image.src} image={image} />
        <span className="gallery-expand">
          <Expand size={18} aria-hidden="true" />
        </span>
      </span>
      <span className="gallery-caption">{image.caption ?? image.alt}</span>
    </button>
  );
}
