import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { scrollToTop } from "../../lib/lenis";

// Bouton flottant de retour en haut de page. Il s'efface au-dessus des scènes plein écran
// (film, école), qui occupent déjà le bas de l'écran avec leurs commandes et leurs mentions.
export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const corner = window.innerHeight - 60;
      const immersive = [...document.querySelectorAll(".film, .school-scroll")].some((scene) => {
        const rect = scene.getBoundingClientRect();
        return rect.top < corner && rect.bottom > corner;
      });
      setVisible(window.scrollY > 600 && !immersive);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return (
    <button type="button" className={`back-to-top${visible ? " is-visible" : ""}`} aria-label="Revenir en haut de la page" onClick={scrollToTop}>
      <ArrowUp size={22} aria-hidden="true" />
    </button>
  );
}
