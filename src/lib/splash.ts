// Écran de chargement d'index.html (icône LabCongo) : il s'efface en fondu quand la première page est affichée.
let dismissed = false;

export function dismissSplash() {
  if (dismissed) return;
  dismissed = true;
  const splash = document.getElementById('splash');
  // L'icône reste visible un instant, même si la page est prête tout de suite.
  const wait = splash ? Math.max(0, 700 - performance.now()) : 0;
  window.setTimeout(() => {
    // Les animations d'entrée de l'accueil attendent ce signal pour ne pas se jouer derrière l'écran de chargement.
    document.documentElement.dataset.ready = '';
    if (!splash) return;
    splash.classList.add('is-hidden');
    window.setTimeout(() => splash.remove(), 600);
  }, wait);
}
