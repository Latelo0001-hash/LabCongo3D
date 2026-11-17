import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { association, context } from "../../../data/editorialContent";
import { homeSchoolPhotos } from "../../../data/homeSchoolPhotos";
import { PhotoImage } from "../../../components/common/Photo";
import { MotifField } from "../../../components/motifs/LabMotifs";
export default function ProjectOverviewSection() {
  return <section id="decouvrir" className="home-project-overview container has-motifs" aria-labelledby="home-overview-title">
    <MotifField set="impact" texture="dots" drift={false} bleed />
    <div className="home-overview-heading" id="enjeux"><div><p className="eyebrow">01 — Le besoin et notre mission</p><h2 id="home-overview-title">Les sciences s’apprennent aussi <em>par l’expérience.</em></h2><p>{context.paragraphs[0]}</p></div>
      <div className="home-overview-response" id="mission"><p className="eyebrow">LabCongo · Kinshasa</p><h3>Observer. Manipuler. Expérimenter.</h3><p>{association.response}</p><Link className="text-link" to="/a-propos">Découvrir LabCongo <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
    </div>
    <div className="home-overview-images" aria-label="La pratique des sciences en images">
      {[homeSchoolPhotos.practical, homeSchoolPhotos.laboratory].map((photo) => <figure key={photo.src}><PhotoImage photo={photo} sizes="(max-width: 760px) 90vw, 50vw" /></figure>)}
    </div>
    <ul className="home-overview-needs">{context.findings.map(item => <li key={item.title}>{item.title}</li>)}</ul>
  </section>;
}
