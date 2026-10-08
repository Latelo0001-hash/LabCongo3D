import { Link } from "react-router-dom";
import FadeIn from "../../../components/animations/FadeIn";
import { results } from "../../../data/presentation";
export default function ImpactSection() {
  return (
    <section
      id="impact"
      className="impact-section section-space"
      aria-labelledby="impact-title"
    >
      <div className="container">
        <FadeIn>
          <div className="media-section-heading">
            <div>
              <p className="eyebrow">05 — Les résultats attendus</p>
              <h2 id="impact-title">
                Développer un capital humain
                <br />
                <em>scientifique et technique.</em>
              </h2>
            </div>
            <p>
              Pour une RDC plus compétitive et plus prospère : voici les
              résultats que LabCongo cherche à obtenir. Ils seront mesurés au fil
              des interventions.
            </p>
          </div>
        </FadeIn>
        <div className="editorial-columns is-quad">
          {results.outcomes.map((item, i) => (
            <article key={item.title}>
              <span className="editorial-number">0{i + 1}</span>
              <h3>{item.title}</h3>
              <ul className="editorial-list">
                {item.items.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <Link className="text-link" to="/impact">
          Comprendre notre suivi de l’impact ↗
        </Link>
      </div>
    </section>
  );
}
