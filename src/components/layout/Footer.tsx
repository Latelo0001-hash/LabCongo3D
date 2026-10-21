import { Link } from "react-router-dom";
import { site } from "../../config/site";
import { navigationGroups } from "../../data/navigation";
export default function Footer() {
  return <footer className="site-footer"><div className="container"><div className="footer-grid">
    <div><Link to="/" className="brand" aria-label="LabCongo"><img src="/images/brand/logo-white.png" alt="LabCongo" className="brand-logo" width="800" height="382" /></Link><p>Créer les conditions pour apprendre, expérimenter et construire l’avenir.</p><a href={`mailto:${site.email}`}>{site.email}</a></div>
    {navigationGroups.map((group) => <nav key={group.title} aria-label={group.title}><p className="eyebrow">{group.title}</p>{group.links.map(({label,to}) => <Link key={to} to={to}>{label}</Link>)}</nav>)}
  </div><div className="footer-bottom"><p>Initiative basée à Kinshasa · Éducation scientifique et technique des jeunes</p><nav className="footer-information" aria-label="Informations"><Link to="/confidentialite">Politique de confidentialité</Link><Link to="/mentions-legales">Mentions légales</Link></nav><p>© {new Date().getFullYear()} LabCongo</p></div></div></footer>;
}
