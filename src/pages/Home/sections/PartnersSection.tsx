import { Link } from "react-router-dom";
import FadeIn from "../../../components/animations/FadeIn";
import PartnerList from "../../../components/common/PartnerList";
import { partnerRoles } from "../../../data/impact";
export default function PartnersSection() {
  return (
    <section
      id="partenaires"
      className="partners-section section-space"
      aria-labelledby="partners-title"
    >
      <div className="container">
        <FadeIn>
          <div className="media-section-heading">
            <div>
              <p className="eyebrow">13 — Faire équipe</p>
              <h2 id="partners-title">
                Le savoir se transmet.
                <br />
                <em>L’engagement aussi.</em>
              </h2>
            </div>
            <p>
              Entre l’Europe et la RDC, chaque contribution peut répondre à un
              besoin concret d’apprentissage.
            </p>
          </div>
        </FadeIn>
        <div className="editorial-columns">
          {partnerRoles.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <PartnerList />
        <Link className="text-link" to="/partenaires">
          Construire un partenariat ↗
        </Link>
      </div>
    </section>
  );
}
