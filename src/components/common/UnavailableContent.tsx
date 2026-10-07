import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
export default function UnavailableContent({
  title,
  to,
  label,
}: {
  title: string;
  to: string;
  label: string;
}) {
  return (
    <section className="container unavailable-page">
      <Helmet>
        <title>{`${title} — LabCongo`}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <p className="eyebrow">LabCongo</p>
      <h1>{title}</h1>
      <p>
        Le lien ne correspond à aucun contenu publié. Retrouvez les informations
        disponibles depuis la liste.
      </p>
      <Link className="button" to={to}>
        {label} ↗
      </Link>
    </section>
  );
}
