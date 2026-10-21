import { useEffect } from 'react';
import type { RefObject } from 'react';
import { create } from 'zustand';
import { clamp } from './filmTimeline';

// `exitReady` : le plan de sortie est chargé (voir `exitShot`) ; tant qu'il couvre l'écran, la 3D n'est pas redessinée.
export const useFilm = create<{ progress: number; exitReady: boolean; setProgress: (progress: number) => void; setExitReady: (ready: boolean) => void }>((set) => ({
  progress: 0,
  exitReady: false,
  setProgress: (progress) => set((state) => {
    const next = clamp(progress);
    return state.progress === next ? state : { progress: next };
  }),
  setExitReady: (exitReady) => set((state) => state.exitReady === exitReady ? state : { exitReady }),
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
