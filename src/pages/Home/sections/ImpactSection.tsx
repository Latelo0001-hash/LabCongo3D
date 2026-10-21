import { Link } from "react-router-dom";
import FadeIn from "../../../components/animations/FadeIn";
import { homeOutcomes } from "../../../data/homeEditorial";
export default function ImpactSection() {
  return (
    <section id="impact" className="impact-section section-space" aria-labelledby="impact-title">
      <div className="container">
        <FadeIn>
          <div className="media-section-heading">
            <div>
              <p className="eyebrow">Impact · Les effets attendus</p>
              <h2 id="impact-title">Développer le capital humain <em>scientifique et technique de la RDC.</em></h2>
            </div>
            <p>LabCongo cherche à produire des effets progressifs, depuis le laboratoire scolaire jusqu’au développement de compétences utiles au pays.</p>
          </div>
        </FadeIn>
        <div className="home-outcomes">
          {homeOutcomes.map((item) => <article key={item.title}>
            <p className="home-outcome-label">{item.number} — {item.label}</p>
            <h3>{item.title}</h3><p>{item.text}</p>
          </article>)}
        </div>
        <div className="home-impact-followup">
          <p><strong>Des objectifs à suivre.</strong> Les résultats seront publiés au fil des interventions documentées, avec leurs sources et leur période de référence.</p>
          <Link className="text-link" to="/impact">Comprendre le suivi de l’impact ↗</Link>
        </div>
      </div>
    </section>
  );
}
