import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import type { StoryStore } from "./store";
import { maxStoryProgress } from "./store";
export function useStoryScroll(store: StoryStore, enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const previousMode = useRef(enabled);
  const wasInStory = useRef(false);
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const saved = store.getState().progress;
    const modeChanged = previousMode.current !== enabled;
    previousMode.current = enabled;
    if (modeChanged && wasInStory.current) {
      const start = root.getBoundingClientRect().top + window.scrollY;
      const length = Math.max(0, root.offsetHeight - window.innerHeight);
      window.scrollTo({
        top: start + (enabled ? (saved / maxStoryProgress) * length : 0),
        behavior: "instant",
      });
    }
    const context = gsap.context(() => {
      if (!enabled) return;
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: (self) =>
          store.getState().setProgress(self.progress * maxStoryProgress),
      });
    }, ref);
    const rememberPosition = () => {
      const box = root.getBoundingClientRect();
      wasInStory.current = box.top < window.innerHeight && box.bottom > 0;
    };
    rememberPosition();
    window.addEventListener("scroll", rememberPosition, { passive: true });
    return () => {
      window.removeEventListener("scroll", rememberPosition);
      context.revert();
    };
  }, [store, enabled]);
  function seek(progress: number) {
    const value = Math.max(0, Math.min(maxStoryProgress, progress));
    if (enabled && ref.current) {
      const root = ref.current;
      const start = root.getBoundingClientRect().top + window.scrollY;
      const length = root.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: start + (value / maxStoryProgress) * length,
        behavior: "instant",
      });
    }
    store.getState().setProgress(value);
  }
  return { ref, seek };
}
