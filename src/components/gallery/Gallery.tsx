import { useState } from "react";
import type { GalleryImage } from "../../types/gallery";
import GalleryItem from "./GalleryItem";
import Lightbox from "./Lightbox";
export default function Gallery({
  images,
}: {
  images: readonly GalleryImage[];
}) {
  const [active, setActive] = useState<number | null>(null);
  if (!images.length) return null;
  return (
    <>
      <div className="photo-gallery">
        {images.map((image, index) => (
          <GalleryItem
            key={image.id}
            image={image}
            onOpen={() => setActive(index)}
          />
        ))}
      </div>
      {active !== null && images[active] && (
        <Lightbox
          images={images}
          index={active}
          onChange={setActive}
          onClose={() => setActive(null)}
        />
      )}
    </>
  );
}
