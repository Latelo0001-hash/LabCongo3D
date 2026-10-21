import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// La page vient-elle d'être rechargée (et non ouverte depuis un lien ou l'historique) ?
const reloaded = (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined)?.type === "reload";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  // Un rechargement repart du haut de la page (sur l'accueil, le hero), même si l'adresse garde l'ancre d'un clic
  // précédent (« Découvrir le projet » mène à #decouvrir) : l'ancre est retirée. Une ancre reçue en arrivant d'un lien
  // ou d'une autre page reste suivie.
  const reload = useRef(reloaded);
  useEffect(() => {
    if (reload.current) {
      if (hash) {
        // Les filtres d'une page (paramètres de l'adresse) sont gardés ; changer de filtre ne ramène pas en haut.
        navigate({ pathname, search: window.location.search }, { replace: true });
        return;
      }
      reload.current = false;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    if (!hash) return;
    let id: string;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      return;
    }
    // La page d’arrivée peut être différée par React.lazy.
    const scrollToAnchor = () => {
      const target = document.getElementById(id);
      if (!target) return false;
      target.scrollIntoView({ block: "start", behavior: "instant" });
      return true;
    };
    if (scrollToAnchor()) return;
    const observer = new MutationObserver(() => {
      if (scrollToAnchor()) observer.disconnect();
    });
    observer.observe(document.getElementById("root") ?? document.body, {
      childList: true,
      subtree: true,
    });
    const timeout = window.setTimeout(() => observer.disconnect(), 5000);
    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, [pathname, hash, navigate]);
  return null;
}
