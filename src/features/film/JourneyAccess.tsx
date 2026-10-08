import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './home.css';

const sections = [
  ['01', 'Le constat', '#presentation'],
  ['02', 'Le constat et l’enjeu', '#enjeux'],
  ['03', 'La réponse : LabCongo', '#mission'],
  ['04', 'Notre approche', '#approche'],
  ['05', 'Les résultats attendus', '#impact'],
];

export default function JourneyAccess() {
  return <section className="journey-access" id="decouvrir" aria-labelledby="journey-access-title">
    <div className="container">
      <div className="journey-access-intro">
        <div>
          <p className="eyebrow">LabCongo · La science en pratique</p>
          <h2 id="journey-access-title">Donner une seconde vie au matériel scientifique.<br /><em>Ouvrir de nouvelles possibilités d’apprentissage.</em></h2>
          <p className="journey-access-lead">LabCongo est une ASBL créée à Kinshasa pour la formation scientifique et technique des jeunes : des laboratoires équipés, des encadreurs formés et des jeunes accompagnés.</p>
          <a className="journey-support" href="#agir">Soutenir LabCongo <ArrowDown size={18} aria-hidden="true" /></a>
        </div>
        <nav className="journey-access-directory" aria-label="Explorer LabCongo">
          <p className="eyebrow">Explorer LabCongo</p>
          <div className="journey-access-links">
            {[['Le projet', '/a-propos'], ['Les écoles', '/ecoles'], ['Les équipements', '/equipements'], ['Les réalisations', '/projets'], ['Les partenaires', '/partenaires'], ['Les actualités', '/actualites'], ['Nous contacter', '/contact']].map(([label, to]) => <Link key={to} to={to}>{label}<ArrowUpRight size={16} aria-hidden="true" /></Link>)}
          </div>
        </nav>
      </div>
      <nav className="home-section-nav" aria-label="Dans cette présentation">
        {sections.map(([number, label, href]) => <a key={href} href={href}><span>{number}</span>{label}<ArrowDown size={15} aria-hidden="true" /></a>)}
      </nav>
    </div>
  </section>;
}
