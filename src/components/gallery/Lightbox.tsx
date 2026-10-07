import { useEffect, useId, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "../../types/gallery";
import Photo from "./Photo";
interface Props {
  images: readonly GalleryImage[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}
export default function Lightbox({ images, index, onChange, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const image = images[index];
  useEffect(() => {
    const dialog = ref.current;
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);
  function previous() {
    onChange((index - 1 + images.length) % images.length);
  }
  function next() {
    onChange((index + 1) % images.length);
  }
  return (
    <dialog
      ref={ref}
      className="gallery-lightbox"
      aria-labelledby={titleId}
      data-lenis-prevent="true"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Tab") {
          const buttons =
            event.currentTarget.querySelectorAll<HTMLButtonElement>(
              "button:not([disabled])",
            );
          const first = buttons[0];
          const last = buttons[buttons.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }
        if (images.length < 2) return;
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          previous();
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          next();
        }
      }}
    >
      <div className="lightbox-body">
        <header>
          <h2 id={titleId}>Galerie photos</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la galerie"
          >
            <X size={24} aria-hidden="true" />
          </button>
        </header>
        <figure>
          <div className="lightbox-image">
            <Photo key={image.src} image={image} eager />
          </div>
          <figcaption>
            <span>{image.caption ?? image.alt}</span>
            {image.credit && (
              <span className="photo-credit">Photo : {image.credit}</span>
            )}
          </figcaption>
        </figure>
        <nav aria-label="Parcourir les photos">
          <button
            type="button"
            onClick={previous}
            disabled={images.length < 2}
            aria-label="Photo précédente"
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <span role="status" aria-live="polite">
            Photo {index + 1} sur {images.length}
          </span>
          <button
            type="button"
            onClick={next}
            disabled={images.length < 2}
            aria-label="Photo suivante"
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </nav>
      </div>
    </dialog>
  );
}
