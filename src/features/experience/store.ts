import { createStore } from "zustand/vanilla";
import { storyChapters } from "./scenario";
export interface StoryState {
  progress: number;
  setProgress: (progress: number) => void;
}
export const maxStoryProgress = storyChapters.length - 0.001;
export function createStoryStore() {
  return createStore<StoryState>((set) => ({
    progress: 0.15,
    setProgress: (value) =>
      set({
        progress: Math.min(
          maxStoryProgress,
          Math.max(0, Number.isFinite(value) ? value : 0),
        ),
      }),
  }));
}
export type StoryStore = ReturnType<typeof createStoryStore>;
