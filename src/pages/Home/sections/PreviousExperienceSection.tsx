import { Link } from "react-router-dom";
import { Boxes, Truck, PackageCheck } from "lucide-react";
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
            <p className="eyebrow">12 — Une expérience à transmettre</p>
            <h2 id="experience-title">
              Savoir faire arriver.
              <br />
              <em>Et mettre en service.</em>
            </h2>
          </div>
          <div>
            <p>
              L’équipe s’appuie sur une expérience antérieure d’équipement d’une
              structure hospitalière en RDC : collecte en Europe, préparation
              logistique, acheminement, réception et installation.
            </p>
            <p>
              Cette expérience nourrit la méthode de LabCongo, aujourd’hui
              tournée vers le matériel scientifique et les écoles.
            </p>
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
          Installer & vérifier
        </span>
      </div>
    </section>
  );
}
