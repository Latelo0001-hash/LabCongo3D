import { Link, useSearchParams } from "react-router-dom";
import { Newspaper } from "lucide-react";
import PageIntro from "../../components/common/PageIntro";
import EditorialCTA from "../../components/common/EditorialCTA";
import {
  articleCategories,
  displayDate,
  publishedArticles,
} from "../../services/editorial";
export default function News() {
  const [params, setParams] = useSearchParams();
  const raw = params.get("categorie") ?? "";
  const category = Object.hasOwn(articleCategories, raw) ? raw : "";
  const all = publishedArticles();
  const items = all.filter((item) => !category || item.category === category);
  return (
    <>
      <PageIntro
        eyebrow="Actualités"
        title="Le projet, au fil des actions."
        description="Terrain, écoles, partenariats, collectes, équipements, formations et événements : retrouvez les informations publiées par LabCongo au fil du projet."
      />
      <div className="container editorial-page">
        <fieldset className="equipment-filters">
          <legend>Explorer les actualités</legend>
          <div>
            {[
              ["", "Toutes les actualités"],
              ...Object.entries(articleCategories).filter(([key]) => key !== "projet" || all.some((item) => item.category === "projet")),
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={category === value}
                aria-controls="news-results"
                onClick={() =>
                  setParams(value ? { categorie: value } : {}, {
                    preventScrollReset: true,
                  })
                }
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <p className="publication-count" role="status">
          {items.length} actualité{items.length !== 1 ? "s" : ""} publiée
          {items.length !== 1 ? "s" : ""}
        </p>
        <div id="news-results">
          {items.length ? (
            <div className="publication-grid">
              {items.map((item) => (
                <article className="publication-card" key={item.id}>
                  {item.image && (
                    <img
                      src={item.image.src}
                      alt={item.image.alt}
                      loading="lazy"
                      width="600"
                      height="400"
                    />
                  )}
                  <p className="eyebrow">{articleCategories[item.category]}</p>
                  <time dateTime={item.publishedAt}>
                    {displayDate(item.publishedAt)}
                  </time>
                  <h2>
                    <Link to={`/actualites/${encodeURIComponent(item.slug)}`}>
                      {item.title}
                    </Link>
                  </h2>
                  <p>{item.summary}</p>
                  <Link
                    className="text-link"
                    to={`/actualites/${encodeURIComponent(item.slug)}`}
                  >
                    Lire l’article <span className="sr-only">{item.title}</span>
                    ↗
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="publication-empty">
              <Newspaper size={40} strokeWidth={1} aria-hidden="true" />
              <h2>
                {all.length
                  ? "Aucune actualité dans cette rubrique."
                  : "Les prochaines nouvelles seront partagées ici."}
              </h2>
              <p>
                En attendant, découvrez notre approche et le projet pilote.
              </p>
              <Link className="text-link" to="/projet-pilote">
                Découvrir le projet pilote ↗
              </Link>
            </div>
          )}
        </div>
        <EditorialCTA
          title="Une information à partager avec l’équipe ?"
          label="Nous écrire"
        />
      </div>
    </>
  );
}
