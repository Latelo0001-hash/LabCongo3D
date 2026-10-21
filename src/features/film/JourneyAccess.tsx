import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MotifField } from '../../components/motifs/LabMotifs';
import { PhotoCredit, PhotoImage } from '../../components/common/Photo';
import { association } from "../../data/editorialContent";
import { presentationPhotos } from '../../data/presentation';
import './home.css';

const sections = [
  ['01', 'Le constat', '#decouvrir'],
  ['02', 'Notre approche', '#approche'],
  ['03', 'Projet pilote', '#pilote'],
  ['04', 'Les écoles', '#ecoles'],
  ['05', 'Impact', '#impact'],
];

export default function JourneyAccess() {
  return <section className="journey-access has-motifs" id="presentation" aria-labelledby="journey-access-title">
    <MotifField set="access" texture="lattice" />
    <div className="container">
      <div className="journey-access-intro">
        <div id="mission">
          <p className="eyebrow">03 — À propos de LabCongo</p>
          <h2 id="journey-access-title">Une initiative au service de la formation scientifique et technique <em>des jeunes.</em></h2>
          <p className="journey-access-lead">{association.lead}</p>
          <p className="journey-access-ambition">{association.ambition}</p>
          <div className="journey-access-actions">
            <Link className="journey-support" to="/a-propos">À propos de LabCongo <ArrowUpRight size={18} aria-hidden="true" /></Link>
            <a className="journey-access-action" href="#agir">Contribuer au projet <ArrowDown size={18} aria-hidden="true" /></a>
          </div>
        </div>
        <figure className="journey-access-photo">
          <PhotoImage photo={presentationPhotos.laboratoireScolaire} sizes="(max-width: 760px) 88vw, 42vw" />
          <figcaption><PhotoCredit photo={presentationPhotos.laboratoireScolaire} /></figcaption>
        </figure>
      </div>
      <nav className="home-section-nav" aria-label="Découvrir le projet, section par section">
        {sections.map(([number, label, href]) => <a key={href} href={href}><span>{number}</span>{label}<ArrowDown size={15} aria-hidden="true" /></a>)}
      </nav>
    </div>
  </section>;
}
