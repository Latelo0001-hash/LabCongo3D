import { Link } from "react-router-dom";
import PageIntro from "../../components/common/PageIntro";
import EditorialCTA from "../../components/common/EditorialCTA";
import ImpactIndicators from "../../components/common/ImpactIndicators";
import { impactLevels, nationalChallenge } from "../../data/editorialContent";
export default function Impact() {
  return <>
    <PageIntro eyebrow="Impact" title="Développer le capital humain scientifique et technique de la RDC." description="LabCongo cherche à produire des effets progressifs, depuis le laboratoire scolaire jusqu’au développement de compétences utiles au pays."  sections={[{id: "effets", label: "Les effets attendus"}, {id: "pourquoi-maintenant", label: "Pourquoi maintenant ?"}, {id: "suivi", label: "Mesurer les résultats"}]} />
    <div className="container editorial-page">
      <section id="effets" aria-labelledby="impact-results"><p className="eyebrow">Les effets attendus</p><h2 id="impact-results">Du laboratoire aux compétences de demain.</h2><div className="impact-levels">{impactLevels.map((item) => <article key={item.number}><p className="eyebrow">{item.number} — {item.label}</p><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
      <section id="pourquoi-maintenant" className="editorial-split editorial-band"><div><p className="eyebrow">Pourquoi maintenant ?</p><h2>Renforcer les compétences et les responsabilités.</h2></div><div><p>La RDC a déjà progressé dans la localisation de l’emploi. L’enjeu suivant consiste à renforcer davantage la présence congolaise dans les compétences techniques et scientifiques, les fonctions à forte valeur ajoutée et les responsabilités de conception et de management.</p><p>{nationalChallenge.conclusion}</p><Link className="text-link" to="/a-propos#enjeu-national">L’enjeu pour la RDC ↗</Link></div></section>
      <section id="suivi" className="impact-followup"><p className="eyebrow">Indicateurs et méthode</p><h2>Des résultats à mesurer dans la durée.</h2><p>Ces effets sont les objectifs du projet. Les résultats seront publiés au fil des interventions documentées, avec leur source et leur période de référence.</p><ImpactIndicators /></section>
      <section className="editorial-split editorial-band"><h2>Suivre chaque établissement.</h2><ol className="editorial-checklist"><li><strong>Avant.</strong> Décrire l’état du laboratoire, les équipements disponibles et les besoins identifiés.</li><li><strong>Pendant l’intervention.</strong> Documenter les aménagements, les équipements installés et l’accompagnement des encadreurs.</li><li><strong>Après.</strong> Suivre les élèves bénéficiaires, les enseignants accompagnés, les travaux pratiques et le fonctionnement du matériel.</li><li><strong>Dans la durée.</strong> Évaluer les résultats et améliorer le modèle avant son extension.</li></ol></section>
      <EditorialCTA title="Construire un impact durable." to="/nous-soutenir" label="Soutenir un projet" />
    </div>
  </>;
}
