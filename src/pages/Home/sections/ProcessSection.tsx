import { PhotoImage } from "../../../components/common/Photo";
import { Link } from "react-router-dom";
import FadeIn from "../../../components/animations/FadeIn";
import { process } from "../../../data/process";
export default function ProcessSection() {
  return (
    <section
      className="process-section container"
      aria-labelledby="process-title"
    >
      <FadeIn>
        <div className="process-heading">
          <div>
            <p className="eyebrow">04 — Notre démarche</p>
            <h2 id="process-title">
              Une chaîne de transmission.
              <br />
              <em>Du matériel au savoir.</em>
            </h2>
          </div>
          <Link to="/notre-demarche" className="text-link">
            Comprendre la démarche ↗
          </Link>
        </div>
      </FadeIn>
      <ol className="process-list">
        {process.map((step) => (
          <li key={step.number}>
            <FadeIn>
              <article className="process-row">
                <span className="process-number">{step.number}</span>
                <div className="process-title">
                  <h3>{step.title}</h3>
                  <span>{step.location}</span>
                </div>
                <p>{step.text}</p>
                <div className="process-image">
                  <PhotoImage
                    photo={step.photo}
                    sizes="(max-width:760px) 90vw, 240px"
                  />
                </div>
              </article>
            </FadeIn>
          </li>
        ))}
      </ol>
      <a className="text-link" href="/experience#credits-photos">
        Photographies d’illustration · Crédits ↗
      </a>
    </section>
  );
}
