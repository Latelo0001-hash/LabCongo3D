import { Link } from "react-router-dom";
import FadeIn from "../../../components/animations/FadeIn";
export default function IntroSection() {
  return (
    <section id="presentation" className="intro container">
      <FadeIn>
        <p className="eyebrow">01 — Le projet LabCongo</p>
        <h2>
          Faire le lien entre les ressources disponibles et les possibilités à
          créer.
        </h2>
        <div className="intro-bottom">
          <p>
            Collecter, préparer, acheminer, équiper et accompagner : une
            démarche progressive pour donner une place à l’expérimentation dans
            l’apprentissage des sciences en RDC.
          </p>
          <Link to="/mission">Notre mission ↗</Link>
        </div>
      </FadeIn>
    </section>
  );
}
