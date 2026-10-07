import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { provinces } from "../../data/provinces";
import SchoolCard from "../../features/schools/components/SchoolCard";
import SchoolEmptyState from "../../features/schools/components/SchoolEmptyState";
import SchoolFilters from "../../features/schools/components/SchoolFilters";
import {
  getPublishedSchools,
  schoolStatusLabels,
} from "../../features/schools/services/catalog";
export default function Schools() {
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
      className="school-directory container"
      aria-labelledby="school-directory-title"
    >
      <Helmet>
        <title>Les écoles — LabCongo</title>
        <meta
          name="description"
          content="Découvrez les écoles du projet LabCongo en RDC, leurs besoins scientifiques et l’avancement de leur équipement."
        />
      </Helmet>
      <nav aria-label="Fil d’Ariane" className="school-breadcrumb">
        <Link to="/">Accueil</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Les écoles</span>
      </nav>
      <header className="school-directory-heading">
        <p className="eyebrow">LabCongo dans les écoles</p>
        <h1 id="school-directory-title">
          L’apprentissage commence
          <br />
          <em>sur le terrain.</em>
        </h1>
        <p>
          Retrouvez les établissements présentés par LabCongo, leurs besoins et
          les étapes de leur équipement.
        </p>
        <Link to="/#carte-rdc" className="text-link">
          Explorer la carte des provinces ↗
        </Link>
      </header>
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
      <aside className="school-directory-note">
        <p>
          <strong>Vous représentez une école en RDC ?</strong>
          <br />
          Présentez votre établissement et les besoins de vos enseignants pour
          ouvrir le dialogue.
        </p>
        <Link to="/contact">Parlons de votre école ↗</Link>
      </aside>
    </section>
  );
}
