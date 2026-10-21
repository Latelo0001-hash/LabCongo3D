import { PhotoCredit, PhotoImage } from "../../../components/common/Photo";
import { Link } from "react-router-dom";
import FadeIn from "../../../components/animations/FadeIn";
import { presentationPhotos } from "../../../data/presentation";
import { homeApproach } from "../../../data/homeEditorial";
import { narrativePhotos } from "../../../features/experience/photos";
const photos = [
  presentationPhotos.laboratoireScolaire,
  { ...presentationPhotos.travauxPratiques, position: "50% 20%" },
  narrativePhotos.classe,
];
export default function ProcessSection() {
  return (
    <section id="approche" className="process-section container" aria-labelledby="process-title">
      <FadeIn>
        <div className="process-heading">
          <div>
            <p className="eyebrow">04 — Notre approche</p>
            <h2 id="process-title">Équiper. Former. <em>Pérenniser.</em></h2>
            <p className="home-section-lead">Le matériel est un point de départ. La formation, l’usage régulier et le suivi lui donnent toute sa valeur.</p>
          </div>
          <Link to="/notre-approche" className="text-link">Explorer la démarche ↗</Link>
        </div>
      </FadeIn>
      <ol className="process-list">
        {homeApproach.map((step, i) => (
          <li key={step.number}>
            <FadeIn>
              <article className="process-row">
                <figure className="process-photo">
                  <div className="process-image"><PhotoImage photo={photos[i]} sizes="(max-width: 760px) 88vw, (max-width: 1050px) 40vw, 380px" /></div>
                  <figcaption><PhotoCredit photo={photos[i]} /></figcaption>
                </figure>
                <div className="process-copy">
                  <span className="process-number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </article>
            </FadeIn>
          </li>
        ))}
      </ol>

    </section>
  );
}
