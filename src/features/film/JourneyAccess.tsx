import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
// Styles de l'en-tête transparent de l'accueil et de ce bloc d'accès.
import '../immersive/immersive.css';

export default function JourneyAccess() {
  return <div className="journey-access" id="decouvrir">
    <div className="container">
      <p className="eyebrow">LabCongo · La science en pratique</p>
      <h2>Donner une seconde vie au matériel scientifique.<br /><em>Ouvrir de nouvelles possibilités d’apprentissage.</em></h2>
      <p>Un projet pour rapprocher les instruments disponibles en Europe des besoins des écoles de la République démocratique du Congo.</p>
      <div className="journey-access-links">
        {[['Le projet', '/a-propos'], ['Les écoles', '/ecoles'], ['Les équipements', '/equipements'], ['Les réalisations', '/projets'], ['Les partenaires', '/partenaires'], ['Les actualités', '/actualites'], ['Nous contacter', '/contact']].map(([label, to]) => <Link key={to} to={to}>{label}<ArrowUpRight size={16} aria-hidden="true" /></Link>)}
      </div>
      <a className="journey-support" href="#agir">Soutenir LabCongo <ArrowDown size={18} aria-hidden="true" /></a>
    </div>
  </div>;
}
