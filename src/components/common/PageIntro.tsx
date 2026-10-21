import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
export default function PageIntro({
  title,
  eyebrow,
  description,
  children,
  sections = [],
}: {
  title: string;
  eyebrow: string;
  description: string;
  children?: ReactNode;
  sections?: { id: string; label: string }[];
}) {
  return (
    <header className="page-intro container">
      <Helmet>
        <title>{`${title} — LabCongo`}</title>
        <meta name="description" content={description} />
      </Helmet>
      <nav className="school-breadcrumb" aria-label="Fil d’Ariane">
        <Link to="/">Accueil</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{eyebrow}</span>
      </nav>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="page-intro-description">{description}</p>
      {children}
      {sections.length > 0 && <nav className="content-subnav page-section-nav" aria-label={`Dans cette page : ${eyebrow}`}>
        {sections.map(({ id, label }) => <Link key={id} to={`#${id}`}>{label}</Link>)}
      </nav>}
    </header>
  );
}
