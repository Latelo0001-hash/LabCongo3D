import { Link } from "react-router-dom";
import ImpactIndicators from "../../../components/common/ImpactIndicators";
export default function StatisticsSection() {
  return (
    <section
      id="chiffres"
      className="statistics-section section-space"
      aria-labelledby="statistics-title"
    >
      <div className="container">
        <div className="media-section-heading">
          <div>
            <p className="eyebrow">15 — Des résultats documentés</p>
            <h2 id="statistics-title">Mesurer ce qui change.</h2>
          </div>
          <p>
            Les chiffres seront publiés avec leur source et leur période de
            référence, au fil des interventions documentées.
          </p>
        </div>
        <ImpactIndicators />
        <Link className="text-link" to="/impact#suivi">
          Notre méthode de suivi ↗
        </Link>
      </div>
    </section>
  );
}
