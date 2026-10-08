import { PhotoImage } from "../../../components/common/Photo";
import { Link } from "react-router-dom";
import FadeIn from "../../../components/animations/FadeIn";
import { approach, phases, presentationPhotos } from "../../../data/presentation";
import { narrativePhotos } from "../../../features/experience/photos";
const photos = [presentationPhotos.laboratoireScolaire, narrativePhotos.classe, presentationPhotos.siteMinier];
export default function ProcessSection() {
  return (
    <section
      id="approche"
      className="process-section container"
      aria-labelledby="process-title"
    >
      <FadeIn>
        <div className="process-heading">
          <div>
            <p className="eyebrow">04 — Notre approche</p>
            <h2 id="process-title">
              Des laboratoires équipés, des encadreurs formés
              <br />
              <em>et des jeunes accompagnés.</em>
            </h2>
          </div>
          <Link to="/notre-demarche" className="text-link">
            Comprendre la démarche ↗
          </Link>
        </div>
      </FadeIn>
      <ol className="process-list">
        {approach.steps.map((step, i) => (
          <li key={step.number}>
            <FadeIn>
              <article className="process-row">
                <span className="process-number">{step.number}</span>
                <div className="process-title">
                  <h3>{step.title}</h3>
                </div>
                <p>{step.text}</p>
                <div className="process-image">
                  <PhotoImage
                    photo={photos[i]}
                    sizes="(max-width:760px) 88vw, 380px"
                  />
                </div>
              </article>
            </FadeIn>
          </li>
        ))}
      </ol>
      <FadeIn>
        <section className="phase-strip" aria-labelledby="phases-title">
          <div className="phase-strip-heading">
            <p className="eyebrow">Les phases d’implémentation</p>
            <h3 id="phases-title">{phases.title}.</h3>
          </div>
          <ol>
            {phases.steps.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
          <Link to="/notre-demarche" className="text-link">
            Détailler les phases et le diagnostic ↗
          </Link>
        </section>
      </FadeIn>
      <a className="text-link" href="/experience#credits-photos">
        Images d’illustration · Crédits ↗
      </a>
    </section>
  );
}
