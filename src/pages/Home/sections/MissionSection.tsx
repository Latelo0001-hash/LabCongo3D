import FadeIn from "../../../components/animations/FadeIn";
import Button from "../../../components/common/Button";
import { PhotoImage } from "../../../components/common/Photo";
import { narrativePhotos } from "../../../features/experience/photos";
export default function MissionSection() {
  return (
    <section
      className="mission-section container"
      aria-labelledby="mission-title"
    >
      <div className="mission-image">
        <PhotoImage photo={narrativePhotos.classe} />
        <span className="mission-image-note">
          Photographie d’illustration · Pratique des sciences
        </span>
      </div>
      <FadeIn>
        <div className="mission-copy">
          <p className="eyebrow">03 — Notre mission</p>
          <h2 id="mission-title">
            Des équipements.
            <br />
            Des expériences.
            <br />
            <em>Des possibilités.</em>
          </h2>
          <p>
            LabCongo vise à collecter du matériel scientifique et de laboratoire
            en Europe, notamment en Belgique et en France, pour équiper
            progressivement des écoles en République démocratique du Congo.
          </p>
          <p>
            Une attention particulière est portée aux provinces minières. La
            démarche associe les besoins des écoles, la préparation du matériel
            et l’accompagnement des enseignants pour favoriser une utilisation
            durable.
          </p>
          <Button to="/mission">Découvrir notre mission ↗</Button>
        </div>
      </FadeIn>
    </section>
  );
}
