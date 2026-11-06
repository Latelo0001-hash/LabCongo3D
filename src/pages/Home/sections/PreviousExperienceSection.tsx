import { Link } from "react-router-dom";
import { Boxes, Truck, PackageCheck } from "lucide-react";
import { hospitalExperience } from "../../../data/editorialContent";
import FadeIn from "../../../components/animations/FadeIn";
export default function PreviousExperienceSection() {
  return (
    <section
      id="experience"
      className="experience-section container section-space"
      aria-labelledby="experience-title"
    >
      <FadeIn>
        <div className="experience-grid">
          <div>
            <p className="eyebrow">Notre expérience · L’équipement d’un hôpital</p>
            <h2 id="experience-title">
              Une expérience qui montre
              <br />
              <em>que le modèle est possible.</em>
            </h2>
          </div>
          <div>
            <p>{hospitalExperience.lead}</p>
            <p>{hospitalExperience.conclusion}</p>
            <Link className="text-link" to="/a-propos#experience">
              Découvrir ce qui nous guide ↗
            </Link>
          </div>
        </div>
      </FadeIn>
      <div className="experience-chain" aria-label="Compétences acquises">
        <span>
          <Boxes aria-hidden="true" />
          Collecter & préparer
        </span>
        <span>
          <Truck aria-hidden="true" />
          Acheminer & réceptionner
        </span>
        <span>
          <PackageCheck aria-hidden="true" />
          Remettre au bénéficiaire
        </span>
      </div>
    </section>
  );
}
