import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Equipment } from "../../../types/equipment";
import { equipmentPurposes } from "../services/catalog";
import EquipmentIllustration from "./EquipmentIllustration";
export default function EquipmentCard({ item }: { item: Equipment }) {
  return (
    <article className="equipment-card">
      <div className="equipment-card-art">
        <span className="eyebrow">{equipmentPurposes[item.purpose]}</span>
        <EquipmentIllustration purpose={item.purpose} />
      </div>
      <div className="equipment-card-copy">
        <h3>
          <Link to={`/equipements/${item.slug}`}>
            {item.name}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </h3>
        <p>{item.summary}</p>
      </div>
    </article>
  );
}
