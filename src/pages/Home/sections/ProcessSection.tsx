import { Link } from "react-router-dom";
import FadeIn from "../../../components/animations/FadeIn";
import SchoolFilm from "../../../features/film/SchoolFilm";

export default function ProcessSection() {
  return (
    <section id="approche" className="home-approach-film" aria-labelledby="process-title">
      <div className="process-section container">
        <FadeIn>
          <div className="process-heading">
            <div>
              <p className="eyebrow">02 — Notre approche</p>
              <h2 id="process-title">Équiper. Former. <em>Pérenniser.</em></h2>
              <p className="home-section-lead">Le matériel est un point de départ. La formation, l’usage régulier et le suivi lui donnent toute sa valeur.</p>
            </div>
            <Link to="/notre-approche" className="text-link">Explorer la démarche ↗</Link>
          </div>
        </FadeIn>
      </div>
      <SchoolFilm />
    </section>
  );
}
