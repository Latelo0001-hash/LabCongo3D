import { useState } from "react";
import { RotateCcw } from "lucide-react";
import FadeIn from "../../../components/animations/FadeIn";
import CongoMap from "../../../components/maps/CongoMap";
import ProvinceDetails from "../../../components/maps/ProvinceDetails";
import { getPublishedSchools } from "../../../features/schools/services/catalog";
import { provinces } from "../../../data/provinces";
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
            <p className="eyebrow">08 — Ancrer le projet en RDC</p>
            <h2 id="map-title">
              Au plus près des écoles.
              <br />
              <em>À l’écoute des territoires.</em>
            </h2>
          </div>
          <p>
            Explorez les provinces de la République démocratique du Congo. Les
            informations sur les écoles et les projets viendront enrichir cette
            carte au fil de leur validation.
          </p>
        </div>
      </FadeIn>
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
        <span className="map-province-count">26 provinces à explorer</span>
      </div>
      <p id="map-instructions" className="map-instructions">
        Cliquez sur une province ou utilisez la liste. Au clavier : Tab pour
        parcourir la carte, Entrée pour sélectionner.
      </p>
      <div className="map-grid">
        <div className="map-surface">
          <CongoMap selectedCode={selectedCode} onSelect={setSelectedCode} />
          <div className="map-legend">
            <span>
              <i aria-hidden="true" />
              Province
            </span>
            <span>
              <i className="selected" aria-hidden="true" />
              Province sélectionnée
            </span>
          </div>
        </div>
        <ProvinceDetails province={selectedProvince} />
      </div>
      <p
        className="map-announcement"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {selectedProvince
          ? `${selectedProvince.name} : ${publishedCount ? `${publishedCount} fiche(s) publiée(s).` : "informations sur les écoles à venir."}`
          : "Vue d’ensemble des 26 provinces de la RDC."}
      </p>
      <div className="map-attribution">
        <p>
          Fond de carte :{" "}
          <a href="https://www.geoboundaries.org/">geoBoundaries</a> / ©{" "}
          <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ·{" "}
          <a href="https://opendatacommons.org/licenses/odbl/1-0/">ODbL</a>.
          Limites simplifiées, données 2017.
        </p>
        <a href="/maps/rdc-provinces-source.geojson" download>
          Télécharger le fond de carte ↗
        </a>
      </div>
    </section>
  );
}
