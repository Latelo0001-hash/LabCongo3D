import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import FadeIn from "../../../components/animations/FadeIn";
import JourneyRoute from "../../../components/animations/JourneyRoute";
import { useJourneyAnimation } from "../../../hooks/useJourneyAnimation";
import { journeySteps } from "../../../data/journey";

export default function JourneySection() {
  const ref = useJourneyAnimation();
  return (
    <section
      className="journey-section"
      id="voyage"
      aria-labelledby="journey-title"
    >
      <div className="container">
        <FadeIn>
          <div className="journey-heading">
            <p className="eyebrow">06 — Le voyage du matériel</p>
            <h2 id="journey-title">
              Changer de continent.
              <br />
              <em>Ouvrir de nouveaux horizons.</em>
            </h2>
            <p>
              De la collecte à la première expérience en classe, chaque étape
              prépare la suivante.
            </p>
          </div>
        </FadeIn>
        <Link className="journey-experience-link" to="/experience">
          <span>Le voyage en 12 scènes</span>
          <strong>Du laboratoire européen aux élèves de RDC</strong>
          <ArrowUpRight size={22} aria-hidden="true" />
        </Link>
        <div className="journey-layout" ref={ref}>
          <div className="journey-visual">
            <JourneyRoute />
          </div>
          <ol className="journey-steps">
            {journeySteps.map((step) => (
              <li key={step.number}>
                <span className="journey-step-number">{step.number}</span>
                <div>
                  <p className="eyebrow">{step.location}</p>
                  <h3>{step.title}</h3>
                  <p className="journey-description">{step.description}</p>
                  <p className="journey-detail">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="journey-outro">
          <p>
            Le voyage prend tout son sens
            <br />
            <strong>quand l’expérience commence.</strong>
          </p>
          <Link to="/ecoles">
            Découvrir les écoles <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
