import { Link } from "react-router-dom";
import FadeIn from "../../../components/animations/FadeIn";
import EquipmentCard from "../../../features/equipment/components/EquipmentCard";
import { getEquipment } from "../../../features/equipment/services/catalog";
export default function EquipmentSection() {
  return (
    <section
      className="equipment-section"
      id="equipements"
      aria-labelledby="equipment-home-title"
    >
      <div className="container">
        <FadeIn>
          <div className="media-section-heading">
            <div>
              <p className="eyebrow">11 — Les outils de l’apprentissage</p>
              <h2 id="equipment-home-title">
                Observer. Expérimenter.
                <br />
                <em>Et comprendre.</em>
              </h2>
            </div>
            <p>
              Des familles de matériel pour accompagner la pratique des
              sciences. Chaque proposition est à mettre en regard des besoins de
              l’école.
            </p>
          </div>
        </FadeIn>
        <div className="equipment-grid">
          {getEquipment().map((item) => (
            <EquipmentCard key={item.id} item={item} />
          ))}
        </div>
        <div className="equipment-section-footer">
          <p>
            Un matériel disponible peut devenir le point de départ d’une
            nouvelle expérience.
          </p>
          <Link to="/equipements">Explorer les équipements ↗</Link>
        </div>
      </div>
    </section>
  );
}
