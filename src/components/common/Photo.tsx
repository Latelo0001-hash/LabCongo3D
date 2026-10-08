import { useState } from "react";
import type { NarrativePhoto } from "../../features/experience/photos";

export function PhotoImage({
  photo,
  className,
  priority = false,
  sizes = "(max-width: 760px) 100vw, 65vw",
}: {
  photo: NarrativePhoto;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <div className="photo-unavailable" role="img" aria-label={photo.alt}>
        <p>La photographie est momentanément indisponible.</p>
        <span>{photo.alt}</span>
      </div>
    );
  return (
    <img
      className={className}
      src={photo.src}
      srcSet={`${photo.small} 640w, ${photo.src} ${photo.width}w`}
      sizes={sizes}
      width={photo.width}
      height={photo.height}
      alt={photo.alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      style={{ objectPosition: photo.position ?? "50% 50%" }}
      onError={() => setFailed(true)}
    />
  );
}
export function PhotoCredit({ photo }: { photo: NarrativePhoto }) {
  return (
    <span className="photo-credit">
      <span>{photo.label ?? "Photographie d’illustration"} · {photo.caption}</span>
      <span>
        {photo.source ? (
          <a href={photo.source} target="_blank" rel="noreferrer">
            {photo.author}
          </a>
        ) : (
          "Ressource fournie"
        )}
        {photo.licenseUrl && (
          <>
            {" "}
            ·{" "}
            <a href={photo.licenseUrl} target="_blank" rel="noreferrer">
              {photo.license}
            </a>
          </>
        )}
        {!photo.licenseUrl && photo.license && <> · {photo.license}</>}
        {" · "}
        <a href="/experience#credits-photos">Crédits</a>
      </span>
    </span>
  );
}
