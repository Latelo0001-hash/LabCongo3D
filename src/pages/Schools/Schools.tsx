import { PackageCheck, Truck, GraduationCap, ArrowUpRight } from "lucide-react";
import { hospitalExperience } from "../../data/editorialContent";
import { publishedArticles, publishedProjects, projectStatuses, articleCategories, displayDate } from "../../services/editorial";
import "./activities.css";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { provinces } from "../../data/provinces";
import SchoolCard from "../../features/schools/components/SchoolCard";
import SchoolEmptyState from "../../features/schools/components/SchoolEmptyState";
import SchoolComparisons from "../../components/gallery/SchoolComparisons";
import ActivityGallery from "../../components/gallery/ActivityGallery";
import { getActivityPhotos } from "../../services/activityPhotos";
import { activityIllustrations } from "../../data/activityIllustrations";
import SchoolFilters from "../../features/schools/components/SchoolFilters";
import {
  getPublishedSchools,
  schoolStatusLabels,
} from "../../features/schools/services/catalog";
export default function Schools() {
  const articles = publishedArticles();
  const projects = publishedProjects();
  const [params, setParams] = useSearchParams();
  const search = params.get("recherche") ?? "";
  const rawProvince = params.get("province") ?? "";
  const province = provinces.some((item) => item.code === rawProvince)
    ? rawProvince
    : "";
  const rawStatus = params.get("statut") ?? "";
  const status = Object.hasOwn(schoolStatusLabels, rawStatus) ? rawStatus : "";
  const all = getPublishedSchools();
  const schools = getPublishedSchools({ search, province, status });
  const filtered = Boolean(search || province || status);
  function updateFilter(
    key: "recherche" | "province" | "statut",
    value: string,
  ) {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
  }
  function resetFilters() {
    setParams({}, { replace: true, preventScrollReset: true });
  }
  return (
    <section
      className="school-directory activities-page container"
      aria-labelledby="school-directory-title"
    >
      <Helmet>
        <title>Activités & réalisations — LabCongo</title>
        <meta
          name="description"
          content="Découvrez les activités de LabCongo, les expériences de son équipe, les réalisations documentées et le suivi des établissements en RDC."
        />
      </Helmet>
      <header className="school-directory-heading">
        <div className="activities-intro-copy">
        <p className="eyebrow">Activités & réalisations</p>
        <h1 id="school-directory-title">
          Des actions concrètes,
          <br />
          <em>un engagement qui se construit.</em>
        </h1>
        <p>Collecter du matériel, préparer son acheminement et accompagner la pratique des sciences : retrouvez les domaines d’action de LabCongo, les expériences de l’équipe et le suivi des établissements.</p>
        <Link to="/#carte-rdc" className="text-link">
          Explorer la carte des provinces ↗
        </Link>
        </div>
        <figure className="activities-intro-visual">
          <img src="/images/presentation/travaux-pratiques.jpg" srcSet="/images/presentation/travaux-pratiques-640.jpg 640w, /images/presentation/travaux-pratiques.jpg 1920w" sizes="(max-width: 760px) 90vw, 480px" alt="Illustration d’une séance de travaux pratiques autour d’une balance de laboratoire" width="1920" height="2560" decoding="async" />
          <figcaption><GraduationCap size={24} aria-hidden="true" /><span>Observer. Manipuler. Comprendre.<small>La pratique des sciences au cœur du projet.</small></span></figcaption>
        </figure>
      </header>
      <nav className="content-subnav" aria-label="Dans cette page : activités et réalisations">
        <Link to="#activites">Nos activités</Link>
        <Link to="#realisations">Expériences & réalisations</Link>
        {(getActivityPhotos().length > 0 || activityIllustrations.length > 0) && <Link to="#activites-en-images">En images</Link>}
        <Link to="#etablissements">Les établissements</Link>
        <Link to="#avant-apres">Avant / Après</Link>
      </nav>
      <section id="activites" className="activities-section" aria-labelledby="activities-title">
        <p className="eyebrow">01 — Nos domaines d’action</p>
        <h2 id="activities-title">Du matériel à la pratique des sciences.</h2>
        <p className="activities-lead">Trois axes pour guider les interventions, en fonction des besoins et des moyens mobilisés.</p>
        <div className="activities-grid">
          {[
            { title: "Mobiliser les équipements", text: "Recueillir les propositions de dons et examiner leur adéquation avec les besoins des établissements.", Icon: PackageCheck, to: "/nous-soutenir#proposer", label: "Proposer du matériel" },
            { title: "Préparer l’acheminement", text: "Organiser la préparation du matériel, sa logistique et les conditions de son installation avec les acteurs concernés.", Icon: Truck, to: "/notre-approche", label: "Comprendre le parcours" },
            { title: "Accompagner les usages", text: "Associer l’équipement à la formation, à l’entretien et aux travaux pratiques pour inscrire son utilisation dans la durée.", Icon: GraduationCap, to: "/projet-pilote", label: "Découvrir le projet pilote" },
          ].map(({ title, text, Icon, to, label }, index) => <article key={title}><div className="activity-card-heading"><Icon size={28} aria-hidden="true" /><span aria-hidden="true">0{index + 1}</span></div><h3>{title}</h3><p>{text}</p><Link className="text-link" to={to}>{label}<ArrowUpRight size={17} aria-hidden="true" /></Link></article>)}
        </div>
      </section>
      <section id="realisations" className="activities-section" aria-labelledby="achievements-title">
        <p className="eyebrow">02 — Expériences & réalisations</p>
        <h2 id="achievements-title">S’appuyer sur l’expérience du terrain.</h2>
        <article className="activities-experience">
          <div><p className="eyebrow">Une expérience antérieure de l’équipe</p><h3>Une collecte et un acheminement vers la RDC.</h3><p>{hospitalExperience.lead}</p></div>
          <div className="activities-experience-process"><p className="activities-route"><span>Europe</span><ArrowUpRight size={18} aria-hidden="true" /><span>RDC</span></p><ol>{hospitalExperience.capacities.map(item => <li key={item}>{item}</li>)}</ol><p>{hospitalExperience.conclusion}</p><Link className="text-link" to="/a-propos#experience">Découvrir cette expérience <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
        </article>
        {projects.length > 0 && <div className="publication-grid activities-projects">{projects.map(project => <article className="publication-card" key={project.id}><p className="eyebrow">{projectStatuses[project.status]}</p><h3><Link to={`/projets/${encodeURIComponent(project.slug)}`}>{project.name}</Link></h3><p>{project.summary}</p></article>)}</div>}
        {articles.length > 0 && <div className="activities-updates"><h3>Au fil des actions.</h3><div className="publication-grid">{articles.map(article => <article className="publication-card" key={article.id}><p className="eyebrow">{articleCategories[article.category]}</p><time dateTime={article.publishedAt}>{displayDate(article.publishedAt)}</time><h3><Link to={`/actualites/${encodeURIComponent(article.slug)}`}>{article.title}</Link></h3><p>{article.summary}</p></article>)}</div></div>}
      </section>
      <ActivityGallery />
      <section id="etablissements" className="activities-section" aria-labelledby="establishments-title">
        <p className="eyebrow">03 — Le suivi des établissements</p>
        <h2 id="establishments-title">Les actions, établissement par établissement.</h2>
        <p className="activities-lead">Les fiches validées présentent le contexte, les besoins et l’avancement de chaque établissement. Elles permettent de suivre les interventions et leurs résultats documentés.</p>
      <SchoolFilters
        search={search}
        province={province}
        status={status}
        onChange={updateFilter}
        onReset={resetFilters}
      />
      <p
        className="school-results-count"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {all.length
          ? `${schools.length} ${schools.length > 1 ? "écoles correspondent" : "école correspond"} à votre recherche`
          : "Les informations des écoles seront publiées après validation."}
      </p>
      <div id="school-results">
        {schools.length ? (
          <div className="school-grid">
            {schools.map((school) => (
              <SchoolCard key={school.id} school={school} />
            ))}
          </div>
        ) : (
          <SchoolEmptyState
            filtered={Boolean(all.length && filtered)}
            onReset={resetFilters}
          />
        )}
      </div>
      </section>
      <SchoolComparisons />
      <aside className="school-directory-note">
        <p>
          <strong>Vous représentez une école en RDC ?</strong>
          <br />
          Présentez votre établissement et les besoins de vos enseignants pour
          ouvrir le dialogue.
        </p>
        <Link to="/contact?objet=ecole">Proposer un établissement ↗</Link>
      </aside>
    </section>
  );
}
