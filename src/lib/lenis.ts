import Lenis from 'lenis';
export { Lenis };

let current: Lenis | null = null;

export function registerSmoothScroll(instance: Lenis) {
  current = instance;
  return () => { if (current === instance) current = null; };
}

// Une navigation directe doit aussi interrompre l’inertie du défilement en cours.
export function scrollImmediately(top: number) {
  if (current) {
    const wasStopped = current.isStopped;
    current.stop();
    current.resize();
    if (!wasStopped) current.start();
    current.scrollTo(top, { immediate: true, force: true });
  } else {
    window.scrollTo({ top, behavior: 'instant' });
  }
}
