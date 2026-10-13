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

// Retour en haut de page : un bref défilement animé, ou immédiat si les mouvements sont réduits.
export function scrollToTop() {
  if (current) current.scrollTo(0, { duration: .8, force: true });
  else scrollImmediately(0);
  // Le clavier reprend au début du contenu.
  document.getElementById('main')?.focus({ preventScroll: true });
}
