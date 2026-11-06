import { MotifField } from "../../../components/motifs/LabMotifs";
import FadeIn from "../../../components/animations/FadeIn";
import Button from "../../../components/common/Button";
import { PhotoCredit, PhotoImage } from "../../../components/common/Photo";
import { narrativePhotos } from "../../../features/experience/photos";
export default function MissionSection() {
  return (
    <section id="mission" className="mission-section has-motifs" aria-labelledby="mission-title">
      <MotifField set="mission" texture="lattice" />
      <div className="container mission-layout">
        <figure className="mission-image">
          <PhotoImage photo={narrativePhotos.instruments} sizes="(max-width: 1050px) 88vw, 44vw" />
          <figcaption><PhotoCredit photo={narrativePhotos.instruments} /></figcaption>
        </figure>
        <FadeIn>
          <div className="mission-copy">
            <p className="eyebrow">02 — Notre réponse</p>
            <h2 id="mission-title">Du matériel disponible <em>à de nouvelles possibilités.</em></h2>
            <p>LabCongo veut créer ou réhabiliter des laboratoires scolaires et accompagner leur utilisation. L’objectif : offrir aux élèves un cadre pour expérimenter et développer leurs compétences.</p>
            <p>La collecte de matériel scientifique en Europe, notamment en Belgique et en France, est l’un des moyens prévus. Chaque équipement doit répondre à un besoin pédagogique identifié avec l’école.</p>
            <Button to="/mission">Découvrir notre mission ↗</Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
