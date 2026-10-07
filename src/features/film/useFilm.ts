import { useEffect } from 'react';
import type { RefObject } from 'react';
import { create } from 'zustand';
import { clamp } from '../immersive/timeline';

export const useFilm = create<{ progress: number; setProgress: (progress: number) => void }>((set) => ({
  progress: 0,
  setProgress: (progress) => set((state) => {
    const next = clamp(progress);
    return state.progress === next ? state : { progress: next };
  }),
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
