import { ArrowUpRight, ClipboardList, MapPin, Microscope } from "lucide-react";
import { Link } from "react-router-dom";
import FadeIn from "../../../components/animations/FadeIn";
import SchoolCard from "../../../features/schools/components/SchoolCard";
import SchoolEmptyState from "../../../features/schools/components/SchoolEmptyState";
import { getPublishedSchools } from "../../../features/schools/services/catalog";
const information = [
  {
    icon: MapPin,
    title: "Comprendre le contexte",
    description:
      "La province, la ville et les conditions d’accueil du matériel.",
  },
  {
    icon: ClipboardList,
    title: "Identifier les besoins",
    description: "Les priorités de l’établissement et les équipements adaptés.",
  },
  {
    icon: Microscope,
    title: "Suivre la mise en place",
    description:
      "Les étapes du projet, de la préparation à l’utilisation en classe.",
  },
];
export default function SchoolsSection() {
  const schools = getPublishedSchools().slice(0, 3);
  return (
    <section
      className="schools-section"
      id="ecoles"
      aria-labelledby="schools-home-title"
    >
      <div className="container">
        <FadeIn>
          <div className="schools-heading">
            <div>
              <p className="eyebrow">09 — Les écoles au cœur du projet</p>
              <h2 id="schools-home-title">
                Une école, des besoins.
                <br />
                <em>Des réponses à construire.</em>
              </h2>
            </div>
            <Link to="/ecoles" className="school-directory-link">
              Explorer les écoles <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </FadeIn>
        <FadeIn>
          {schools.length ? (
            <div className="school-grid">
              {schools.map((school) => (
                <SchoolCard key={school.id} school={school} />
              ))}
            </div>
          ) : (
            <SchoolEmptyState />
          )}
        </FadeIn>
        <div className="school-information">
          {information.map(({ icon: Icon, title, description }) => (
            <div key={title}>
              <Icon size={23} strokeWidth={1.3} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
