import { useId } from "react";
import { useStore } from "zustand";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import type { StoryStore } from "./store";
import { chapterNumber, storyChapters } from "./scenario";
export default function StoryControls({
  store,
  seek,
}: {
  store: StoryStore;
  seek: (value: number) => void;
}) {
  const id = useId();
  const progress = useStore(store, (state) => state.progress);
  const index = Math.floor(progress);
  return (
    <div className="story-controls">
      <div className="story-step-buttons">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => seek(index - 1 + 0.15)}
          aria-label="Scène précédente"
        >
          <ArrowLeft size={18} />
        </button>
        <span aria-live="polite" aria-atomic="true">
          {chapterNumber(index)}{" "}
          <span className="story-total">/ {storyChapters.length}</span>
        </span>
        <button
          type="button"
          disabled={index === storyChapters.length - 1}
          onClick={() => seek(index + 1 + 0.15)}
          aria-label="Scène suivante"
        >
          <ArrowRight size={18} />
        </button>
      </div>
      <div className="story-scrubber">
        <label htmlFor={id}>Parcourir le voyage</label>
        <input
          id={id}
          type="range"
          min="0"
          max="1199"
          step="1"
          value={Math.min(1199, Math.round(progress * 100))}
          onChange={(event) => seek(Number(event.target.value) / 100)}
          aria-valuetext={`Scène ${index + 1} sur 12 : ${storyChapters[index].title}`}
        />
      </div>
      <button
        type="button"
        className="story-restart"
        onClick={() => seek(0.15)}
      >
        <RotateCcw size={16} aria-hidden="true" />
        <span>Recommencer</span>
      </button>
    </div>
  );
}
