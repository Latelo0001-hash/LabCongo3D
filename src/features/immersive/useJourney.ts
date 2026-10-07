import { useEffect } from 'react';
import type { RefObject } from 'react';
import { create } from 'zustand';
import { clamp } from './timeline';
import { scrollImmediately } from '../../lib/lenis';

export const useJourney = create<{ progress: number; setProgress: (progress: number) => void }>((set) => ({
  progress: 0,
  setProgress: (progress) => set((state) => {
    const next = clamp(progress);
    return state.progress === next ? state : { progress: next };
  }),
}));

export function useJourneyScroll(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const element = ref.current;
    if (!element) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const stageHeight = element.querySelector<HTMLElement>('.journey-stage')?.offsetHeight ?? window.innerHeight;
      useJourney.getState().setProgress(-rect.top / Math.max(1, element.offsetHeight - stageHeight));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ref, enabled]);
}

export function seekChapter(element: HTMLElement | null, index: number) {
  if (!element) return;
  const progress = clamp(index / 4);
  const stageHeight = element.querySelector<HTMLElement>('.journey-stage')?.offsetHeight ?? window.innerHeight;
  scrollImmediately(window.scrollY + element.getBoundingClientRect().top + progress * (element.offsetHeight - stageHeight));
  useJourney.getState().setProgress(progress);
}
