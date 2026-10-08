import { Link } from "react-router-dom";
import PageIntro from "../../components/common/PageIntro";
import EditorialCTA from "../../components/common/EditorialCTA";
import { process } from "../../data/process";
import { diagnostic, phases } from "../../data/presentation";
import { PhotoImage, PhotoCredit } from "../../components/common/Photo";
const checks = [
  "Besoins pédagogiques, niveaux et conditions d’accueil de l’école.",
  "Fonctionnement, accessoires, documentation et utilité du matériel proposé.",
  "Conditionnement, inventaire, acheminement et réception.",
  "Installation, prise en main, entretien et suivi de l’utilisation.",
];
const anchor = (title: string) =>
  title.toLocaleLowerCase("fr").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-");
export default function Process() {
  return (
    <>
      <PageIntro
        eyebrow="Notre démarche"
        title={`${phases.title}.`}
        description="Diagnostic, projet pilote, projet intégré, pérennisation et évaluation : LabCongo avance par étapes pour équiper, former et accompagner."
      />
      <div className="container editorial-page">
        <ol className="process-editorial-list">
          {phases.steps.map((step) => (
            <li id={anchor(step.title)} key={step.number}>
              <span className="editorial-number">{step.number}</span>
              <div>
                <p className="eyebrow">Phase {step.number}</p>
                <h2>{step.title}</h2>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <section aria-labelledby="diagnostic-title">
          <p className="eyebrow">Le diagnostic</p>
          <h2 id="diagnostic-title">{diagnostic.title}.</h2>
          <div className="editorial-columns">
            {diagnostic.axes.map((axis, i) => (
              <article key={axis.title}>
                <span className="editorial-number">0{i + 1}</span>
                <h3>{axis.title}</h3>
                <ul className="editorial-list">
                  {axis.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
        <section className="challenge-table-block" aria-labelledby="diagnostic-challenges">
          <p className="eyebrow">Les défis du diagnostic</p>
          <h2 id="diagnostic-challenges">{diagnostic.challengesTitle}.</h2>
          <table className="challenge-table">
            <thead>
              <tr>
                <th scope="col">Défi</th>
                <th scope="col">Réalité du terrain</th>
                <th scope="col">Conséquence</th>
              </tr>
            </thead>
            <tbody>
              {diagnostic.challenges.map((row) => (
                <tr key={row.challenge}>
                  <th scope="row">{row.challenge}</th>
                  <td data-label="Réalité du terrain">{row.reality}</td>
                  <td data-label="Conséquence">{row.consequence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section aria-labelledby="material-journey">
          <p className="eyebrow">Équiper les laboratoires</p>
          <h2 id="material-journey">Le parcours du matériel.</h2>
          <p className="process-journey-lead">
            Pour équiper les établissements, LabCongo mobilise aussi du matériel
            scientifique disponible en Europe, du premier don au premier geste en
            classe.
          </p>
          <p className="process-story-link">
            <Link className="text-link" to="/experience">
              Suivre le parcours complet en douze scènes ↗
            </Link>
          </p>
          <ol className="process-editorial-list">
            {process.map((step) => (
              <li id={anchor(step.title)} key={step.number}>
                <span className="editorial-number">{step.number}</span>
                <div>
                  <p className="eyebrow">{step.location}</p>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
                {step.photo && (
                  <figure className="process-step-photo">
                    <PhotoImage photo={step.photo} sizes="320px" />
                    <figcaption>
                      <PhotoCredit photo={step.photo} />
                    </figcaption>
                  </figure>
                )}
              </li>
            ))}
          </ol>
        </section>
        <section className="editorial-split editorial-band">
          <h2>Avant de nous engager, vérifier les conditions.</h2>
          <ol className="editorial-checklist">
            {checks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>
        <EditorialCTA
          title="Un équipement disponible en Europe ?"
          text="Décrivez sa nature, son état et sa localisation. L’équipe pourra examiner sa pertinence pour un usage scolaire avant d’organiser la suite."
          to="/faire-un-don"
          label="Proposer du matériel"
        />
      </div>
    </>
  );
}
