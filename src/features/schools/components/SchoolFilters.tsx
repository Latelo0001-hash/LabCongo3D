import { Search, RotateCcw } from "lucide-react";
import { provinces } from "../../../data/provinces";
import { schoolStatusLabels } from "../services/catalog";
interface Props {
  search: string;
  province: string;
  status: string;
  onChange: (key: "recherche" | "province" | "statut", value: string) => void;
  onReset: () => void;
}
export default function SchoolFilters({
  search,
  province,
  status,
  onChange,
  onReset,
}: Props) {
  return (
    <form
      className="school-filters"
      role="search"
      aria-label="Rechercher une école"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="school-filter-search">
        <label htmlFor="school-search">Nom ou ville</label>
        <div className="school-input-wrap">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            id="school-search"
            value={search}
            onChange={(event) => onChange("recherche", event.target.value)}
            placeholder="Rechercher une école…"
            aria-controls="school-results"
          />
        </div>
      </div>
      <div>
        <label htmlFor="school-province">Province</label>
        <select
          id="school-province"
          value={province}
          onChange={(event) => onChange("province", event.target.value)}
          aria-controls="school-results"
        >
          <option value="">Toutes les provinces</option>
          {provinces.map((item) => (
            <option key={item.code} value={item.code}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="school-status">Avancement</label>
        <select
          id="school-status"
          value={status}
          onChange={(event) => onChange("statut", event.target.value)}
          aria-controls="school-results"
        >
          <option value="">Tous les statuts</option>
          {Object.entries(schoolStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        className="school-filter-reset"
        onClick={onReset}
        disabled={!search && !province && !status}
      >
        <RotateCcw size={17} aria-hidden="true" />
        <span>Réinitialiser</span>
      </button>
    </form>
  );
}
