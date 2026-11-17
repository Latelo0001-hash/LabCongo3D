import { Link } from "react-router-dom";
import FadeIn from "../../../components/animations/FadeIn";
import { pilot } from "../../../data/editorialContent";
import { homeSchoolPhotos } from "../../../data/homeSchoolPhotos";
import { PhotoImage } from "../../../components/common/Photo";
export default function PilotSection() {
  return <section id="pilote" className="pilot-section has-section-background background-dna section-background-light" aria-labelledby="pilot-title"><div className="container">
    <FadeIn><div className="media-section-heading"><div><p className="eyebrow">03 — Le projet pilote</p><h2 id="pilot-title">Commencer à petite échelle <em>pour construire un modèle durable.</em></h2></div><p>{pilot.lead}</p></div></FadeIn>
    <div className="home-pilot-visual">
      <figure><PhotoImage photo={homeSchoolPhotos.microscope} sizes="(max-width: 760px) 90vw, 45vw" /></figure>
      <div><p className="eyebrow">Équiper · Former · Pérenniser</p><p className="home-pilot-summary">{pilot.text}</p><Link className="text-link" to="/projet-pilote#diagnostic">Comprendre le diagnostic ↗</Link></div>
    </div>
    <ol className="pilot-overview" aria-label="Les cinq phases prévues">{pilot.phases.map((phase) => <li key={phase.id}><span>{phase.number}</span><h3>{phase.title}</h3></li>)}</ol>
    <div className="content-actions"><Link className="button" to="/projet-pilote">Découvrir le projet pilote ↗</Link><Link className="text-link" to="/projet-pilote#suivi">Les indicateurs de suivi ↗</Link></div>
  </div></section>;
}
