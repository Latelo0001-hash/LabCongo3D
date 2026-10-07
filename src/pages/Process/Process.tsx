import { Link } from "react-router-dom";
import PageIntro from "../../components/common/PageIntro";
import EditorialCTA from "../../components/common/EditorialCTA";
import { process } from "../../data/process";
import { PhotoImage, PhotoCredit } from "../../components/common/Photo";
import { narrativePhotos } from "../../features/experience/photos";
const checks = [
  "Besoins pédagogiques, niveaux et conditions d’accueil de l’école.",
  "Fonctionnement, accessoires, documentation et utilité du matériel proposé.",
  "Conditionnement, inventaire, acheminement et réception.",
  "Installation, prise en main, entretien et suivi de l’utilisation.",
];
export default function Process() {
  return (
    <>
      <PageIntro
        eyebrow="Notre démarche"
        title="Du premier don au premier geste en classe."
        description="Collecter, préparer, acheminer, équiper et accompagner : chaque étape sert le même objectif, permettre une utilisation concrète du matériel à l’école."
      />
      <div className="container editorial-page">
        <figure className="editorial-photograph process-photograph">
          <PhotoImage photo={narrativePhotos.chargement} />
          <figcaption>
            <PhotoCredit photo={narrativePhotos.chargement} />
          </figcaption>
        </figure>
        <p className="process-story-link">
          <Link className="text-link" to="/experience">
            Suivre le parcours complet en douze scènes ↗
          </Link>
        </p>
        <ol className="process-editorial-list">
          {process.map((step) => (
            <li
              id={step.title
                .toLocaleLowerCase("fr")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")}
              key={step.number}
            >
              <span className="editorial-number">{step.number}</span>
              <div>
                <p className="eyebrow">{step.location}</p>
                <h2>{step.title}</h2>
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
