import FadeIn from "../../../components/animations/FadeIn";
import Button from "../../../components/common/Button";
import { PhotoImage } from "../../../components/common/Photo";
import { presentationPhotos, response } from "../../../data/presentation";
export default function MissionSection() {
  return (
    <section
      id="mission"
      className="mission-section"
      aria-labelledby="mission-title"
    >
      <div className="container mission-layout">
        <div className="mission-image">
          <PhotoImage photo={presentationPhotos.travauxPratiques} />
          <span className="mission-image-note">
            Image d’illustration · Travaux pratiques en laboratoire
          </span>
        </div>
        <FadeIn>
          <div className="mission-copy">
            <p className="eyebrow">03 — La réponse : LabCongo</p>
            <h2 id="mission-title">
              Une ASBL au service de la formation scientifique et technique
              <em> des jeunes.</em>
            </h2>
            <p>{response.lead}</p>
            <p>
              Créée à Kinshasa, LabCongo crée ou réhabilite des laboratoires
              scolaires et accompagne leur utilisation : équipements, formations
              et suivi. Pour les équiper, elle mobilise aussi du matériel
              scientifique disponible en Europe, notamment en Belgique et en
              France.
            </p>
            <Button to="/mission">Découvrir notre mission ↗</Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
