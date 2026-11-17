import { Link } from "react-router-dom";
import { Boxes, Truck, PackageCheck } from "lucide-react";
import { hospitalExperience } from "../../../data/editorialContent";
import { activityIllustrations } from "../../../data/activityIllustrations";
import FadeIn from "../../../components/animations/FadeIn";
import { MotifField } from "../../../components/motifs/LabMotifs";
export default function PreviousExperienceSection() {
  return (
    <section
      id="experience"
      className="experience-section container section-space has-motifs"
      aria-labelledby="experience-title"
    >
      <MotifField set="mission" texture="lattice" drift={false} bleed />
      <FadeIn>
        <div className="experience-grid">
          <div>
            <p className="eyebrow">04 — Une expérience antérieure de l’équipe</p>
            <h2 id="experience-title">
              Une expérience qui montre
              <br />
              <em>que le modèle est possible.</em>
            </h2>
          </div>
          <div>
            <p>{hospitalExperience.lead}</p>
            <p>{hospitalExperience.conclusion}</p>
            <Link className="text-link" to="/activites-realisations#realisations">
              Voir les activités et réalisations ↗
            </Link>
          </div>
        </div>
      </FadeIn>
      <div className="home-activity-previews">{activityIllustrations.map(image => <figure key={image.id}><Link to="/activites-realisations#activites-en-images"><img src={image.src} alt={image.alt} width={1536} height={1024} loading="lazy" decoding="async" /><figcaption>{image.caption}</figcaption></Link></figure>)}</div>
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
