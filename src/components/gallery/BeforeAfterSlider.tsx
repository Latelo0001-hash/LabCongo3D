import { useId, useState } from "react";
import type { PointerEvent } from "react";
import { ChevronsLeftRight, ImageOff } from "lucide-react";
import type { PhotoComparison } from "../../types/gallery";
export default function BeforeAfterSlider({
  comparison,
}: {
  comparison: PhotoComparison;
}) {
  const [position, setPosition] = useState(50);
  const [failed, setFailed] = useState(false);
  const id = useId();
  function move(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.width)
      setPosition(
        Math.round(
          Math.max(
            0,
            Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100),
          ),
        ),
      );
  }
  return (
    <figure className="comparison">
      {failed ? (
        <div className="comparison-error" role="status">
          <ImageOff size={34} aria-hidden="true" />
          <p>
            La comparaison est indisponible : une photo n’a pas pu être chargée.
          </p>
        </div>
      ) : (
        <div
          className="comparison-frame"
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            move(event);
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId))
              move(event);
          }}
          onPointerUp={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId))
              event.currentTarget.releasePointerCapture(event.pointerId);
          }}
        >
          <img
            src={comparison.after.src}
            alt={comparison.after.alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            onError={() => setFailed(true)}
          />
          <div
            className="comparison-before"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <img
              src={comparison.before.src}
              alt={comparison.before.alt}
              loading="lazy"
              decoding="async"
              draggable={false}
              onError={() => setFailed(true)}
            />
          </div>
          {position > 8 && (
            <span className="comparison-label comparison-label-before">
              Avant
            </span>
          )}
          {position < 92 && (
            <span className="comparison-label comparison-label-after">
              Après
            </span>
          )}
          <span
            className="comparison-divider"
            style={{ left: `${position}%` }}
            aria-hidden="true"
          >
            <span>
              <ChevronsLeftRight size={22} />
            </span>
          </span>
        </div>
      )}
      <div className="comparison-controls">
        <label htmlFor={id}>Comparer les deux vues</label>
        <p id={`${id}-help`}>
          Faites glisser le curseur ou utilisez les flèches du clavier.
        </p>
        <input
          id={id}
          type="range"
          min="0"
          max="100"
          step="1"
          value={position}
          disabled={failed}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-describedby={`${id}-help`}
          aria-valuetext={`Avant : ${position} %, après : ${100 - position} %`}
        />
        <div className="comparison-actions">
          <button
            type="button"
            disabled={failed}
            onClick={() => setPosition(100)}
          >
            Voir avant
          </button>
          <button
            type="button"
            disabled={failed}
            onClick={() => setPosition(50)}
          >
            Vue partagée
          </button>
          <button
            type="button"
            disabled={failed}
            onClick={() => setPosition(0)}
          >
            Voir après
          </button>
        </div>
      </div>
      <figcaption>{comparison.title}</figcaption>
    </figure>
  );
}
