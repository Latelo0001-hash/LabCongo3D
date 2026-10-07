import PageIntro from "../../components/common/PageIntro";
import EditorialCTA from "../../components/common/EditorialCTA";
import ImpactIndicators from "../../components/common/ImpactIndicators";
import { impactAxes } from "../../data/impact";
export default function Impact() {
  return (
    <>
      <PageIntro
        eyebrow="Notre impact"
        title="Le matériel compte. Son utilisation aussi."
        description="Notre ambition est de renforcer la pratique des sciences. Le suivi doit rendre visibles les équipements en service, les usages pédagogiques et les retours des écoles."
      />
      <div className="container editorial-page">
        <section>
          <h2>Ce que nous voulons rendre possible.</h2>
          <div className="editorial-columns">
            {impactAxes.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
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
