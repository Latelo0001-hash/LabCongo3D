import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Gallery from "../../components/gallery/Gallery";
import UnavailableContent from "../../components/common/UnavailableContent";
import EditorialCTA from "../../components/common/EditorialCTA";
import {
  displayDate,
  projectStatuses,
  publishedProjects,
} from "../../services/editorial";
import { getPublishedSchools } from "../../features/schools/services/catalog";
export default function ProjectDetails() {
  const { slug } = useParams();
  const project = publishedProjects().find((item) => item.slug === slug);
  if (!project)
    return (
      <UnavailableContent
        title="Ce projet n’est pas disponible."
        to="/projets"
        label="Voir les projets"
      />
    );
  const schools = getPublishedSchools().filter((school) =>
    project.schoolIds.includes(school.id),
  );
  return (
    <article className="container editorial-page publication-detail">
      <Helmet>
        <title>{`${project.name} — LabCongo`}</title>
        <meta name="description" content={project.summary} />
      </Helmet>
      <nav className="school-breadcrumb" aria-label="Fil d’Ariane">
        <Link to="/">Accueil</Link>
        <span>/</span>
        <Link to="/projets">Projets</Link>
        <span>/</span>
        <span aria-current="page">{project.name}</span>
      </nav>
      <header>
        <p className="eyebrow">
          {projectStatuses[project.status]} · {project.location}
        </p>
        <h1>{project.name}</h1>
        <p className="publication-lead">{project.summary}</p>
        {Number.isFinite(Date.parse(project.updatedAt)) && (
          <p className="publication-date">
            Mis à jour le{" "}
            <time dateTime={project.updatedAt}>
              {displayDate(project.updatedAt)}
            </time>
          </p>
        )}
      </header>
      {project.image && (
        <img
          className="publication-cover"
          src={project.image.src}
          alt={project.image.alt}
          width="1200"
          height="720"
        />
      )}
      <div className="publication-body">
        {project.sections.map((section, i) => (
          <section key={i}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </section>
        ))}
      </div>
      {schools.length > 0 && (
        <section>
          <h2>Les écoles concernées</h2>
          <ul className="school-project-links">
            {schools.map((school) => (
              <li key={school.id}>
                <Link
                  className="text-link"
                  to={`/ecoles/${encodeURIComponent(school.slug)}`}
                >
                  {school.name} ↗
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      {project.gallery && project.gallery.length > 0 && (
        <section>
          <h2>Le projet en images</h2>
          <Gallery images={project.gallery} />
        </section>
      )}
      <EditorialCTA
        to="/contact?objet=soutien"
        title="Accompagner la pratique des sciences."
      />
    </article>
  );
}
