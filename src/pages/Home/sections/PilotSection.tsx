import { Link } from "react-router-dom";
import FadeIn from "../../../components/animations/FadeIn";
import { pilot } from "../../../data/editorialContent";
export default function PilotSection() {
  return <section id="pilote" className="pilot-section" aria-labelledby="pilot-title"><div className="container">
    <FadeIn><div className="media-section-heading"><div><p className="eyebrow">05 — Le projet pilote</p><h2 id="pilot-title">Commencer à petite échelle <em>pour construire un modèle durable.</em></h2></div><p>{pilot.lead}</p></div></FadeIn>
    <ol className="pilot-overview">{pilot.phases.map((phase) => <li key={phase.id}><span>{phase.number}</span><h3>{phase.title}</h3><p>{phase.text}</p></li>)}</ol>
    <div className="content-actions"><Link className="button" to="/projet-pilote">Découvrir le projet pilote ↗</Link><Link className="text-link" to="/projet-pilote#diagnostic">Les six axes du diagnostic ↗</Link></div>
  </div></section>;
}
