import "./territories.css";
import { useState } from "react";
import { MapPin, RotateCcw } from "lucide-react";
import FadeIn from "../../../components/animations/FadeIn";
import CongoMap from "../../../components/maps/CongoMap";
import ProvinceDetails from "../../../components/maps/ProvinceDetails";
import { getPublishedSchools } from "../../../features/schools/services/catalog";
import { provinces } from "../../../data/provinces";
import { isMiningProvince } from "../../../data/educationStatistics";
export default function MapSection() {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const selectedProvince = provinces.find(
    (province) => province.code === selectedCode,
  );
  const publishedCount = getPublishedSchools({
    province: selectedCode ?? undefined,
  }).length;
  return (
    <section
      className="map-section container"
      id="carte-rdc"
      aria-labelledby="map-title"
    >
      <FadeIn>
        <div className="map-heading">
          <div>
            <p className="eyebrow">05 — Les territoires et les établissements</p>
            <h2 id="map-title">
              Chaque école a son contexte.
              <br />
              <em>Chaque besoin mérite d’être compris.</em>
            </h2>
          </div>
          <p>
            Explorez les provinces de la RDC pour situer les territoires du projet.
            Les fiches d’écoles et les informations sur les interventions seront
            ajoutées à mesure de leur validation.
          </p>
        </div>
      </FadeIn>
      <div className="map-grid">
        <div className="map-surface">
          <div className="map-surface-heading"><span><MapPin size={17} aria-hidden="true" /> RDC · 26 provinces à explorer</span><span className="map-view-label">{selectedProvince?.name ?? "Vue d’ensemble"}</span></div>
          <CongoMap selectedCode={selectedCode} onSelect={setSelectedCode} />
          <p id="map-instructions" className="map-instructions">Cliquez sur une province ou utilisez la liste. Au clavier : Tab pour parcourir la carte, Entrée pour sélectionner.</p>
          <div className="map-legend">
            <span>
              <i aria-hidden="true" />
              Province
            </span>
            <span>
              <i className="mining" aria-hidden="true" />
              Province minière
            </span>
            <span>
              <i className="selected" aria-hidden="true" />
              Province sélectionnée
            </span>
          </div>
        </div>
        <div className="map-details-panel">
      <div className="map-toolbar">
        <div className="province-select">
          <label htmlFor="province-select">Explorer une province</label>
          <select
            id="province-select"
            value={selectedCode ?? ""}
            onChange={(event) => setSelectedCode(event.target.value || null)}
          >
            <option value="">Toute la RDC</option>
            {provinces.map((province) => (
              <option key={province.code} value={province.code}>
                {province.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="map-reset"
          disabled={!selectedCode}
          onClick={() => setSelectedCode(null)}
        >
          <RotateCcw size={16} aria-hidden="true" /> Vue d’ensemble
        </button>
      </div>
          <ProvinceDetails province={selectedProvince} collapsibleStats />
        </div>
      </div>
      <p
        className="map-announcement"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {selectedProvince
          ? `${selectedProvince.name}${isMiningProvince(selectedProvince.code) ? ", province minière" : ""} : ${publishedCount ? `${publishedCount} fiche(s) publiée(s).` : "informations sur les écoles à venir."}`
          : "Vue d’ensemble des 26 provinces de la RDC."}
      </p>
    </section>
  );
}
