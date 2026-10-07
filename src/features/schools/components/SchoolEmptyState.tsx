import { ArrowUpRight, School } from "lucide-react";
import { Link } from "react-router-dom";
interface Props {
  filtered?: boolean;
  onReset?: () => void;
}
export default function SchoolEmptyState({ filtered = false, onReset }: Props) {
  return (
    <div className="school-empty">
      <div className="school-empty-symbol" aria-hidden="true">
        <School size={46} strokeWidth={1} />
      </div>
      <div>
        <p className="eyebrow">
          {filtered ? "Votre recherche" : "Les écoles LabCongo"}
        </p>
        <h3>
          {filtered
            ? "Aucune fiche ne correspond à ces critères."
            : "Les premières fiches restent à publier."}
        </h3>
        <p>
          {filtered
            ? "Essayez une autre province, un autre statut ou une recherche plus courte."
            : "Les écoles seront présentées ici avec leur localisation, leurs besoins et l’avancement de leur équipement, après validation de leurs informations."}
        </p>
        {filtered && onReset ? (
          <button type="button" className="text-link" onClick={onReset}>
            Effacer les filtres
          </button>
        ) : (
          <Link className="school-empty-link" to="/contact">
            Présenter une école <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}
