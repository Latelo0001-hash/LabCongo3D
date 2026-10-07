import { Link } from "react-router-dom";
import { site } from "../../config/site";
const groups = [
  {
    title: "Comprendre",
    links: [
      ["Le projet", "/a-propos"],
      ["Notre mission", "/mission"],
      ["Notre démarche", "/notre-demarche"],
      ["Notre impact", "/impact"],
    ],
  },
  {
    title: "Découvrir",
    links: [
      ["L’expérience 3D", "/experience"],
      ["Les écoles", "/ecoles"],
      ["Projets & réalisations", "/projets"],
      ["Les équipements", "/equipements"],
      ["Les actualités", "/actualites"],
    ],
  },
  {
    title: "Participer",
    links: [
      ["Les partenaires", "/partenaires"],
      ["Donner du matériel", "/faire-un-don"],
      ["Présenter une école", "/contact?objet=ecole"],
      ["Nous contacter", "/contact"],
    ],
  },
];
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="brand" aria-label="LabCongo — Accueil">
              <img
                src="/images/brand/logo-white.png"
                alt="LabCongo"
                className="brand-logo"
                width="800"
                height="382"
              />
            </Link>
            <p>
              La science en pratique.
              <br />
              L’avenir en commun.
            </p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
          {groups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <p className="eyebrow">{group.title}</p>
              {group.links.map(([label, to]) => (
                <Link key={to} to={to}>
                  {label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
        <div className="footer-bottom">
          <p>Belgique · France → République démocratique du Congo</p>
          <p>© {new Date().getFullYear()} LabCongo</p>
        </div>
      </div>
    </footer>
  );
}
