import { useEffect, useRef } from "react";
import { useStore } from "zustand";
import { useNearViewport } from "../../hooks/useNearViewport";
import { PhotoImage, PhotoCredit } from "../../components/common/Photo";
import type { StoryStore } from "./store";
import { chapterPhotos } from "./photos";
import { storyChapters } from "./scenario";

export default function StoryViewport({
  store,
  staticMode,
}: {
  store: StoryStore;
  staticMode: boolean;
}) {
  const index = useStore(store, (state) => Math.floor(state.progress));
  const photo = chapterPhotos[storyChapters[index].id];
  const frame = useRef<HTMLDivElement>(null);
  const { ref, visible } = useNearViewport();
  useEffect(() => {
    const update = () => {
      const img = frame.current?.querySelector("img");
      if (!img) return;
      const p = store.getState().progress % 1;
      const zoom =
        index === storyChapters.length - 1
          ? 1.045 - p * 0.045
          : 1.015 + p * 0.035;
      img.style.transform = staticMode ? "none" : `scale(${zoom})`;
    };
    update();
    return store.subscribe(update);
  }, [store, index, staticMode]);
  useEffect(() => {
    if (!visible) return;
    // Only adjacent chapters are prefetched; repeated photos use the browser cache.
    for (const neighbor of [index - 1, index + 1]) {
      const chapter = storyChapters[neighbor];
      if (!chapter) continue;
      const asset = chapterPhotos[chapter.id];
      const image = new Image();
      image.sizes = "(max-width: 760px) 100vw, 65vw";
      image.srcset = `${asset.small} 640w, ${asset.src} ${asset.width}w`;
      image.src = asset.src;
    }
  }, [index, visible]);
  return (
    <div
      ref={ref}
      className="story-viewport"
      data-render-mode="photo"
      data-static={staticMode}
    >
      <figure className="story-render story-photograph">
        <div className="story-photo-frame" ref={frame} key={index}>
          <PhotoImage
            photo={photo}
            className="story-photo"
            priority={visible}
          />
        </div>
        <figcaption className="story-photo-caption">
          <PhotoCredit photo={photo} />
        </figcaption>
      </figure>
    </div>
  );
}
