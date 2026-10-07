import { ArrowUpRight, MapPin, School } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getPublishedSchools,
  schoolPath,
} from "../../features/schools/services/catalog";
import type { Province } from "../../data/provinces";
interface Props {
  province?: Province;
}
export default function ProvinceDetails({ province }: Props) {
  const schools = getPublishedSchools({ province: province?.code });
  return (
    <aside
      className="province-details"
      id="province-details"
      aria-labelledby="province-title"
    >
      <div className="province-detail-top">
        <MapPin size={20} strokeWidth={1.4} aria-hidden="true" />
        <span className="eyebrow">
          {province ? "Province sélectionnée" : "Le projet en RDC"}
        </span>
      </div>
      <div className="province-heading">
        <h3 id="province-title">
          {province?.name ?? "Un territoire, des possibilités."}
        </h3>
        <p>
          {province
            ? "République démocratique du Congo"
            : "Sélectionnez une province sur la carte ou dans la liste."}
        </p>
      </div>
      <div className="province-school-state">
        <School size={27} strokeWidth={1.2} aria-hidden="true" />
        <h4>Les écoles, au cœur du projet</h4>
        {schools.length ? (
          <>
            <p>
              {schools.length}{" "}
              {schools.length > 1
                ? "fiches d’écoles publiées"
                : "fiche d’école publiée"}
              {province ? " dans cette province" : " en RDC"}.
            </p>
            <ul className="province-school-links">
              {schools.slice(0, 3).map((school) => (
                <li key={school.id}>
                  <Link to={schoolPath(school)}>{school.name} ↗</Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <p>
              {province
                ? "Les fiches des écoles de cette province seront ajoutées après validation de leurs informations."
                : "LabCongo vise à équiper progressivement des écoles, avec une attention particulière portée aux provinces minières."}
            </p>
            <span className="province-data-status">
              Informations sur les écoles à venir
            </span>
          </>
        )}
        <Link
          className="province-directory-link"
          to={
            province
              ? `/ecoles?province=${encodeURIComponent(province.code)}`
              : "/ecoles"
          }
        >
          {province
            ? "Voir les écoles de cette province"
            : "Consulter les écoles"}{" "}
          ↗
        </Link>
      </div>
      <Link to="/contact" className="province-contact">
        Présenter une école <ArrowUpRight size={18} aria-hidden="true" />
      </Link>
      <p className="province-context">
        Une école à proposer ou un partenaire local à mobiliser ? Échangeons sur
        les besoins et les possibilités d’accompagnement.
      </p>
    </aside>
  );
}
