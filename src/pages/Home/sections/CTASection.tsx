import { Link } from "react-router-dom";
import FadeIn from "../../../components/animations/FadeIn";
export default function CTASection() {
  return (
    <section
      id="agir"
      className="final-cta section-space"
      aria-labelledby="cta-title"
    >
      <div className="container">
        <FadeIn>
          <p className="eyebrow">16 — Le prochain geste</p>
          <h2 id="cta-title">
            Et si votre matériel
            <br />
            devenait <em>leur déclic ?</em>
          </h2>
          <p>
            Un instrument disponible. Une compétence à partager. Une école à
            accompagner. Ensemble, donnons une place à la pratique des sciences.
          </p>
          <div className="cta-actions">
            <Link className="button" to="/faire-un-don">
              Donner du matériel ↗
            </Link>
            <Link className="button button-secondary" to="/partenaires">
              Devenir partenaire ↗
            </Link>
            <Link className="cta-text-link" to="/contact?objet=soutien">
              Soutenir le projet ↗
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
