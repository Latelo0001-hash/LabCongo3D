import { Link } from "react-router-dom";
import { publishedArticles, articleCategories, displayDate } from "../../../services/editorial";
export default function NewsSection() {
  const articles = publishedArticles().slice(0, 3);
  return <section id="actualites" className="home-news container" aria-labelledby="home-news-title"><div className="media-section-heading"><div><p className="eyebrow">Actualités</p><h2 id="home-news-title">Le projet, <em>au fil des actions.</em></h2></div><p>Terrain, écoles, partenariats, collectes, équipements, formations et événements : les nouvelles de LabCongo.</p></div>
    {articles.length ? <div className="publication-grid">{articles.map((article) => <article className="publication-card" key={article.id}><p className="eyebrow">{articleCategories[article.category]}</p><time dateTime={article.publishedAt}>{displayDate(article.publishedAt)}</time><h3><Link to={`/actualites/${encodeURIComponent(article.slug)}`}>{article.title}</Link></h3><p>{article.summary}</p></article>)}</div> : <p className="publication-note">Les premières actualités seront partagées ici après leur validation.</p>}
    <Link className="text-link" to="/actualites">Toutes les actualités ↗</Link>
  </section>;
}
