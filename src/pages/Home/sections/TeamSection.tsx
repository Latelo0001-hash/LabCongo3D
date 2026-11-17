import { Link } from "react-router-dom";
import { ArrowUpRight, Mail } from "lucide-react";
import { team } from "../../../data/presentation";
import { site } from "../../../config/site";
import TeamMember from "../../../components/common/TeamMember";
const portraitCrops: Record<string, { position: string; zoom: number }> = {
  "kethia-bakaato": { position: "50% 6%", zoom: 1.15 },
  "benjamin-itamba": { position: "50% 43%", zoom: 1 },
  "lombi-evy": { position: "50% 47%", zoom: 1 },
};
export default function TeamSection() {
  return <section className="home-team-section container" id="equipe" aria-labelledby="home-team-title">
    <div className="home-summary-heading"><div><p className="eyebrow">06 — L’équipe et les informations utiles</p><h2 id="home-team-title">Les personnes qui portent <em>LabCongo.</em></h2></div><Link className="text-link" to="/a-propos#equipe">Rencontrer l’équipe <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
    <ul className="home-team-portraits">{team.map(member => <li key={member.slug}><TeamMember member={member} portraitCrop={portraitCrops[member.slug]} /></li>)}</ul>
    <div className="home-team-information"><a href={`mailto:${site.email}`}><Mail size={18} aria-hidden="true" />{site.email}</a><Link to="/mentions-legales">Informations sur LabCongo</Link><Link to="/confidentialite">Confidentialité des échanges</Link></div>
  </section>;
}
