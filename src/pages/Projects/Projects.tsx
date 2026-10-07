import { Link, useSearchParams } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import PageIntro from "../../components/common/PageIntro";
import EditorialCTA from "../../components/common/EditorialCTA";
import {
  normalizedText,
  projectStatuses,
  publishedProjects,
} from "../../services/editorial";
export default function Projects() {
  const [params, setParams] = useSearchParams();
  const query = params.get("recherche") ?? "";
  const raw = params.get("statut") ?? "";
  const status = Object.hasOwn(projectStatuses, raw) ? raw : "";
  const all = publishedProjects();
  const items = all.filter(
    (item) =>
      (!status || item.status === status) &&
      normalizedText(`${item.name} ${item.location} ${item.summary}`).includes(
        normalizedText(query),
      ),
  );
  function update(key: string, value: string) {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { preventScrollReset: true, replace: key === "recherche" },
    );
  }
  return (
    <>
      <PageIntro
        eyebrow="Projets & réalisations"
        title="Des besoins aux réalisations."
        description="Suivez les actions scolaires de LabCongo, de leur préparation à l’installation documentée du matériel."
      />
      <div className="container editorial-page">
        <div className="publication-filters">
          <div className="form-field">
            <label htmlFor="project-search">
              Rechercher un projet ou un lieu
            </label>
            <input
              id="project-search"
              type="search"
              value={query}
              onChange={(event) => update("recherche", event.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="project-status">Avancement</label>
            <select
              id="project-status"
              value={status}
              onChange={(event) => update("statut", event.target.value)}
            >
              <option value="">Tous les projets</option>
              {Object.entries(projectStatuses).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="publication-count" role="status">
          {items.length} projet{items.length !== 1 ? "s" : ""} publié
          {items.length !== 1 ? "s" : ""}
        </p>
        {items.length ? (
          <div className="publication-grid">
            {items.map((item) => (
              <article key={item.id} className="publication-card">
                {item.image && (
                  <img
                    src={item.image.src}
                    alt={item.image.alt}
                    loading="lazy"
                    width="600"
                    height="400"
                  />
                )}
                <p className="eyebrow">
                  {projectStatuses[item.status]} · {item.location}
                </p>
                <h2>
                  <Link to={`/projets/${encodeURIComponent(item.slug)}`}>
                    {item.name}
                  </Link>
                </h2>
                <p>{item.summary}</p>
                <Link
                  className="text-link"
                  to={`/projets/${encodeURIComponent(item.slug)}`}
                >
                  Voir le projet <span className="sr-only">{item.name}</span>↗
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="publication-empty">
            <ClipboardList size={40} strokeWidth={1} aria-hidden="true" />
            <h2>
              {all.length
                ? "Aucun projet ne correspond à ces critères."
                : "Les premières fiches viendront documenter les actions."}
            </h2>
            <p>
              {all.length
                ? "Essayez un autre lieu ou un autre avancement."
                : "Chaque projet sera présenté avec son contexte, ses besoins, son avancement et les éléments disponibles sur sa mise en œuvre."}
            </p>
            {(status || query) && (
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setParams({}, { preventScrollReset: true })}
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}
        <section className="editorial-split">
          <h2>Une progression lisible.</h2>
          <dl className="project-status-guide">
            <div>
              <dt>En préparation</dt>
              <dd>
                Les besoins et les conditions de mise en œuvre sont à préciser.
              </dd>
            </div>
            <div>
              <dt>En cours</dt>
              <dd>
                Une action est engagée, avec un avancement décrit dans sa fiche.
              </dd>
            </div>
            <div>
              <dt>Réalisé</dt>
              <dd>
                L’installation et la réception sont documentées ; le suivi de
                l’utilisation se poursuit.
              </dd>
            </div>
          </dl>
        </section>
        <EditorialCTA
          title="Une école, un besoin, une première rencontre."
          to="/contact?objet=ecole"
          label="Présenter une école"
        />
      </div>
    </>
  );
}
