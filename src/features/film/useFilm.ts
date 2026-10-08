import { useEffect } from 'react';
import type { RefObject } from 'react';
import { create } from 'zustand';
import { clamp } from './filmTimeline';

// `controls` : haut des commandes du film, en fraction de la hauteur de la scène (mesuré par FilmSequence).
export const useFilm = create<{ progress: number; controls: number; setProgress: (progress: number) => void; setControls: (controls: number) => void }>((set) => ({
  progress: 0,
  controls: 1,
  setProgress: (progress) => set((state) => {
    const next = clamp(progress);
    return state.progress === next ? state : { progress: next };
  }),
  setControls: (controls) => set((state) => state.controls === controls ? state : { controls }),
}));

export function useFilmScroll(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const element = ref.current;
    if (!element) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const stageHeight = element.querySelector<HTMLElement>('.film-stage')?.offsetHeight ?? window.innerHeight;
      useFilm.getState().setProgress(-rect.top / Math.max(1, element.offsetHeight - stageHeight));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ref, enabled]);
}
