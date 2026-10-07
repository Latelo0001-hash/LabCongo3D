import { Link } from "react-router-dom";
export default function EditorialCTA({
  title = "Une place pour chaque contribution.",
  text = "Du matériel disponible, un besoin dans une école ou une compétence à partager : commençons par en parler.",
  to = "/contact",
  label = "Échanger avec LabCongo",
}: {
  title?: string;
  text?: string;
  to?: string;
  label?: string;
}) {
  return (
    <aside className="editorial-cta">
      <div>
        <p className="eyebrow">Construire ensemble</p>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <Link className="button" to={to}>
        {label} ↗
      </Link>
    </aside>
  );
}
