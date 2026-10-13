import { useEffect, useRef } from 'react';
import { useFilm } from './useFilm';
import { at, openingSmokeAt } from './filmTimeline';

// Un front de fumée filmée balaie toute la scène de gauche à droite.
// Les masques vidéo / 3D dans FilmSequence utilisent exactement la même position.
export default function TransitionSmoke() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    const stage = video?.parentElement;
    if (!video || !stage) return;
    let target = 0;
    let failed = false;
    const seek = () => {
      if (!failed && video.readyState > 0 && !video.seeking && Math.abs(video.currentTime - target) > .025) {
        video.currentTime = target;
      }
    };
    const paint = () => {
      const { progress } = useFilm.getState();
      const width = stage.clientWidth, height = Math.max(1, stage.clientHeight);
      const smoke = openingSmokeAt(at(progress), width / height);
      const shown = smoke.active && !failed && video.readyState >= 2;
      video.style.opacity = String(shown ? smoke.opacity : 0);
      video.style.visibility = shown ? 'visible' : 'hidden';
      // Charger les métadonnées ne doit pas faire apparaître une ancienne image
      // après un saut de chapitre ; le dernier temps demandé est toujours repris.
      if (Number.isFinite(video.duration)) target = smoke.time * Math.max(0, video.duration - .04);
      seek();
      if (!smoke.active) return;
      Object.assign(video.style, {
        width: `${smoke.width * width}px`,
        transform: `translate3d(${smoke.left * width}px, 0, 0)`,
      });
    };
    const onError = () => { failed = true; paint(); };
    video.addEventListener('loadeddata', paint);
    video.addEventListener('loadedmetadata', paint);
    video.addEventListener('seeked', paint);
    video.addEventListener('error', onError);
    const observer = new ResizeObserver(paint);
    observer.observe(stage);
    const unsubscribe = useFilm.subscribe(paint);
    paint();
    return () => {
      unsubscribe();
      observer.disconnect();
      video.removeEventListener('loadeddata', paint);
      video.removeEventListener('loadedmetadata', paint);
      video.removeEventListener('seeked', paint);
      video.removeEventListener('error', onError);
    };
  }, []);
  return <video ref={ref} className="film-smoke" src="/media/parcours/fumee.mp4" muted playsInline preload="auto" disablePictureInPicture aria-hidden="true" tabIndex={-1} />;
}
