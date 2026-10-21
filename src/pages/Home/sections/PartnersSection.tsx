import { Link } from "react-router-dom";
import FadeIn from "../../../components/animations/FadeIn";
import PartnerList from "../../../components/common/PartnerList";
import { partnerActors } from "../../../data/editorialContent";
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
              <p className="eyebrow">Participer · Les partenariats</p>
              <h2 id="partners-title">
                Construire LabCongo
                <br />
                <em>ensemble.</em>
              </h2>
            </div>
            <p>
              Créer des laboratoires durables nécessite plus que du matériel.
              LabCongo veut réunir autour des établissements des partenaires
              éducatifs, techniques et logistiques, ainsi que des donateurs.
            </p>
          </div>
        </FadeIn>
        <ul className="content-tags">{partnerActors.map((actor) => <li key={actor}>{actor}</li>)}</ul>
        <PartnerList />
        <Link className="text-link" to="/partenaires">
          Construire un partenariat ↗
        </Link>
      </div>
    </section>
  );
}
