import PageIntro from "../../components/common/PageIntro";
import EditorialCTA from "../../components/common/EditorialCTA";
import ImpactIndicators from "../../components/common/ImpactIndicators";
import { results } from "../../data/presentation";
export default function Impact() {
  return (
    <>
      <PageIntro
        eyebrow="Notre impact"
        title="Développer un capital humain scientifique et technique."
        description="Pour une RDC plus compétitive et plus prospère. Voici les résultats que LabCongo cherche à obtenir ; ils seront mesurés et publiés au fil des interventions documentées."
      />
      <div className="container editorial-page">
        <section aria-labelledby="impact-levers">
          <p className="eyebrow">L’intervention de LabCongo</p>
          <h2 id="impact-levers">Quatre leviers.</h2>
          <ul className="lever-list">
            {results.levers.map((lever) => (
              <li key={lever}>{lever}</li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="impact-results">
          <p className="eyebrow">Les résultats attendus</p>
          <h2 id="impact-results">Ce que nous voulons rendre possible.</h2>
          <div className="editorial-columns is-quad">
            {results.outcomes.map((item, i) => (
              <article key={item.title}>
                <span className="editorial-number">0{i + 1}</span>
                <h3>{item.title}</h3>
                <ul className="editorial-list">
                  {item.items.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
        <section className="virtuous-circle editorial-band" aria-labelledby="impact-circle">
          <h2 id="impact-circle">{results.circle.title}.</h2>
          <ol>
            {results.circle.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p>
            <span aria-hidden="true">↻ </span>
            {results.circle.loop}
          </p>
        </section>
        <section id="suivi" className="impact-followup">
          <p className="eyebrow">Indicateurs et méthode</p>
          <h2>Des chiffres reliés à des preuves.</h2>
          <p>
            Les résultats seront publiés au fil des interventions documentées,
            avec leur source et leur période. Une intention ou du matériel
            proposé ne constitue pas une installation réalisée.
          </p>
          <ImpactIndicators />
        </section>
        <section className="editorial-split editorial-band">
          <h2>Documenter dans la durée.</h2>
          <ol className="editorial-checklist">
            <li>
              <strong>Avant l’installation.</strong> Décrire les besoins,
              l’espace disponible et les usages prévus avec l’établissement.
            </li>
            <li>
              <strong>À la réception.</strong> Rapprocher le matériel reçu de
              l’inventaire, vérifier son fonctionnement et documenter
              l’installation.
            </li>
            <li>
              <strong>Dans les classes.</strong> Recueillir les séances
              réalisées, les besoins d’accompagnement et les retours des
              enseignants.
            </li>
            <li>
              <strong>À la publication.</strong> Vérifier les données, préciser
              la période et obtenir les autorisations pour les photos et
              témoignages.
            </li>
          </ol>
        </section>
        <EditorialCTA
          title="Contribuer à un impact durable."
          to="/partenaires"
          label="Devenir partenaire"
        />
      </div>
    </>
  );
}
