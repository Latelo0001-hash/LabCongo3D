import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, School as SchoolIcon } from "lucide-react";
import {
  findPublishedSchool,
  provinceName,
} from "../../features/schools/services/catalog";
import ComparisonGallery from "../../components/gallery/ComparisonGallery";
import { getPublishedComparisons } from "../../services/comparisons";
import SchoolStatus from "../../features/schools/components/SchoolStatus";
export default function SchoolDetails() {
  const { slug } = useParams();
  const school = findPublishedSchool(slug);
  if (!school)
    return (
      <section className="school-not-found container">
        <Helmet>
          <title>École introuvable — LabCongo</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <SchoolIcon size={44} strokeWidth={1} aria-hidden="true" />
        <p className="eyebrow">Les écoles LabCongo</p>
        <h1>Cette fiche n’est pas disponible.</h1>
        <p>
          Elle n’a pas encore été publiée ou le lien ne correspond à aucune
          école.
        </p>
        <Link className="button" to="/ecoles">
          <ArrowLeft size={18} aria-hidden="true" /> Voir les écoles
        </Link>
      </section>
    );
  const comparisons = getPublishedComparisons(school.id);
  return (
    <article className="school-details-page container">
      <Helmet>
        <title>{`${school.name} — LabCongo`}</title>
        <meta name="description" content={school.summary} />
      </Helmet>
      <nav aria-label="Fil d’Ariane" className="school-breadcrumb">
        <Link to="/">Accueil</Link>
        <span aria-hidden="true">/</span>
        <Link to="/ecoles">Les écoles</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{school.name}</span>
      </nav>
      <header className="school-detail-heading">
        <SchoolStatus status={school.status} />
        <h1>{school.name}</h1>
        <p className="school-location">
          <MapPin size={17} aria-hidden="true" />
          {school.city} · {provinceName(school.provinceCode)}
        </p>
        <p className="school-detail-summary">{school.summary}</p>
      </header>
      {school.image && (
        <img
          className="school-detail-photo"
          src={school.image.src}
          alt={school.image.alt}
          width="1200"
          height="720"
        />
      )}
      <div className="school-detail-grid">
        <section aria-labelledby="school-about-title">
          <p className="eyebrow">L’établissement</p>
          <h2 id="school-about-title">Apprendre et expérimenter</h2>
          <p className="school-description">{school.description}</p>
          {school.studentsCount !== undefined && school.studentsCount > 0 && (
            <p className="school-students">
              <strong>{school.studentsCount.toLocaleString("fr-FR")}</strong>{" "}
              élèves dans l’établissement
            </p>
          )}
        </section>
        <aside className="school-detail-facts">
          <h2>Les besoins identifiés</h2>
          {school.needs.length ? (
            <ul>
              {school.needs.map((need) => (
                <li key={need}>{need}</li>
              ))}
            </ul>
          ) : (
            <p>Les besoins détaillés seront précisés avec l’établissement.</p>
          )}
          <h2>Les équipements reçus</h2>
          {school.equipment.length ? (
            <ul>
              {school.equipment.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>Aucun équipement reçu n’est renseigné sur cette fiche.</p>
          )}
          <Link to="/faire-un-don" className="button">
            Proposer du matériel ↗
          </Link>
        </aside>
      </div>
      {comparisons.length > 0 && (
        <section
          className="school-comparisons"
          aria-labelledby="school-comparison-title"
        >
          <p className="eyebrow">Le suivi en images</p>
          <h2 id="school-comparison-title">Avant et après l’installation</h2>
          <ComparisonGallery comparisons={comparisons} />
        </section>
      )}
      <Link
        to={`/ecoles?province=${encodeURIComponent(school.provinceCode)}`}
        className="text-link"
      >
        Voir les écoles de cette province ↗
      </Link>
    </article>
  );
}
