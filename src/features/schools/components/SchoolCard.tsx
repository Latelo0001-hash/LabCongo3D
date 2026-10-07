import { ArrowUpRight, MapPin, School as SchoolIcon } from "lucide-react";
import { Link } from "react-router-dom";
import type { School } from "../../../types/school";
import { provinceName, schoolPath } from "../services/catalog";
import SchoolStatus from "./SchoolStatus";
export default function SchoolCard({ school }: { school: School }) {
  return (
    <article className="school-card">
      <div className="school-card-image">
        {school.image ? (
          <img
            src={school.image.src}
            alt={school.image.alt}
            loading="lazy"
            width="720"
            height="480"
          />
        ) : (
          <div className="school-photo-placeholder">
            <SchoolIcon size={48} strokeWidth={1} aria-hidden="true" />
            <span>Photo à venir</span>
          </div>
        )}
      </div>
      <div className="school-card-content">
        <SchoolStatus status={school.status} />
        <p className="school-location">
          <MapPin size={14} aria-hidden="true" />
          {school.city} · {provinceName(school.provinceCode)}
        </p>
        <h3>
          <Link to={schoolPath(school)}>
            {school.name}
            <ArrowUpRight size={19} aria-hidden="true" />
          </Link>
        </h3>
        <p className="school-summary">{school.summary}</p>
      </div>
    </article>
  );
}
