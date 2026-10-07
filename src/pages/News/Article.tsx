import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import UnavailableContent from "../../components/common/UnavailableContent";
import {
  articleCategories,
  displayDate,
  publishedArticles,
} from "../../services/editorial";
export default function Article() {
  const { slug } = useParams();
  const article = publishedArticles().find((item) => item.slug === slug);
  if (!article)
    return (
      <UnavailableContent
        title="Cet article n’est pas disponible."
        to="/actualites"
        label="Voir les actualités"
      />
    );
  return (
    <article className="container editorial-page publication-detail">
      <Helmet>
        <title>{`${article.title} — LabCongo`}</title>
        <meta name="description" content={article.summary} />
      </Helmet>
      <nav className="school-breadcrumb" aria-label="Fil d’Ariane">
        <Link to="/">Accueil</Link>
        <span>/</span>
        <Link to="/actualites">Actualités</Link>
        <span>/</span>
        <span aria-current="page">{article.title}</span>
      </nav>
      <header>
        <p className="eyebrow">{articleCategories[article.category]}</p>
        <h1>{article.title}</h1>
        <p className="publication-lead">{article.summary}</p>
        <p className="publication-date">
          Publié le{" "}
          <time dateTime={article.publishedAt}>
            {displayDate(article.publishedAt)}
          </time>
        </p>
      </header>
      {article.image && (
        <figure className="publication-figure">
          <img
            className="publication-cover"
            src={article.image.src}
            alt={article.image.alt}
            width="1200"
            height="720"
          />
          {article.image.credit && (
            <figcaption>{article.image.credit}</figcaption>
          )}
        </figure>
      )}
      <div className="publication-body">
        {article.sections.map((section, i) => (
          <section key={i}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </section>
        ))}
      </div>
      <Link className="text-link" to="/actualites">
        ← Toutes les actualités
      </Link>
    </article>
  );
}
