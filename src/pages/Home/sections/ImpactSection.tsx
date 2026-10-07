import { Link } from "react-router-dom";
import FadeIn from "../../../components/animations/FadeIn";
import { impactAxes } from "../../../data/impact";
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
              <p className="eyebrow">11 — L’impact recherché</p>
              <h2 id="impact-title">
                Au-delà des instruments,
                <br />
                <em>des possibilités.</em>
              </h2>
            </div>
            <p>
              Le matériel est un point de départ. Notre ambition : rendre la
              pratique des sciences plus accessible, utile et durable dans les
              écoles.
            </p>
          </div>
        </FadeIn>
        <div className="editorial-columns">
          {impactAxes.map((item, i) => (
            <article key={item.title}>
              <span className="editorial-number">0{i + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
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
