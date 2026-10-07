import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
export default function PagePlaceholder({ title }: { title: string }) {
  return (
    <section className="container placeholder">
      <Helmet>
        <title>{`${title} — LabCongo`}</title>
      </Helmet>
      <p className="eyebrow">LabCongo · Le projet se construit</p>
      <h1>{title}</h1>
      <p>Cette page sera développée lors de la prochaine étape.</p>
      <Link className="button" to="/">
        Retour à l’accueil ↗
      </Link>
    </section>
  );
}
