import { Link } from "react-router-dom";
import PageIntro from "../../components/common/PageIntro";
import EditorialCTA from "../../components/common/EditorialCTA";
import { pilot, diagnosis, beforeAfterMessage } from "../../data/editorialContent";
export default function Pilot() {
  return <>
    <PageIntro eyebrow="Projet pilote" title={pilot.title} description={pilot.lead}  sections={[{id: "phases", label: "Les cinq phases"}, {id: "diagnostic", label: "Le diagnostic"}, {id: "resultats", label: "Les résultats"}]} />
    <div className="container editorial-page">
      <section id="phases" aria-labelledby="pilot-phases"><h2 id="pilot-phases">Les cinq phases.</h2><p>{pilot.text}</p>
        <ol className="learning-path pilot-phases">{pilot.phases.map((phase) => <li key={phase.id} id={`phase-${phase.id}`}><span className="editorial-number">{phase.number}</span><div><h3>{phase.title}</h3><p>{phase.text}</p></div></li>)}</ol>
      </section>
      <section id="diagnostic" aria-labelledby="diagnostic-title"><p className="eyebrow">Le diagnostic</p><h2 id="diagnostic-title">{diagnosis.title}.</h2><p>{diagnosis.lead}</p>
        <div className="diagnosis-grid">{diagnosis.axes.map((axis, index) => <article key={axis.title}><span className="editorial-number">0{index + 1}</span><h3>{axis.title}</h3><ul className="editorial-list">{axis.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div>
      </section>
      <section id="resultats" className="editorial-split editorial-band"><div><p className="eyebrow">Documenter les résultats</p><h2>Voir ce qui change et comprendre ce qui fonctionne.</h2></div><div><p>{beforeAfterMessage}</p><p>Les fiches des établissements, les comparaisons avant/après et les indicateurs documenteront les interventions au fil de leur validation.</p><div className="content-actions"><Link className="text-link" to="/ecoles#avant-apres">Voir le suivi avant/après ↗</Link><Link className="text-link" to="/impact#suivi">Les indicateurs de suivi ↗</Link></div></div></section>
      <EditorialCTA title="Votre établissement souhaite développer la pratique des sciences ?" to="/contact?objet=ecole" label="Proposer un établissement" />
    </div>
  </>;
}
