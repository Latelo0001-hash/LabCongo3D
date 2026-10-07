import { useState } from "react";
import { ImageOff } from "lucide-react";
import type { GalleryImage } from "../../types/gallery";
export default function Photo({
  image,
  eager = false,
}: {
  image: GalleryImage;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div
      className="photo-unavailable"
      role="img"
      aria-label={`Photo indisponible : ${image.alt}`}
    >
      <ImageOff size={30} aria-hidden="true" />
      <span>Photo indisponible</span>
    </div>
  ) : (
    <img
      src={image.src}
      alt={image.alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      draggable={false}
    />
  );
}
