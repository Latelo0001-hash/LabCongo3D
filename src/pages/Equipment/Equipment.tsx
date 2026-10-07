import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import EquipmentCard from "../../features/equipment/components/EquipmentCard";
import {
  equipmentPurposes,
  getEquipment,
} from "../../features/equipment/services/catalog";
export default function Equipment() {
  const [params, setParams] = useSearchParams();
  const raw = params.get("usage") ?? "";
  const purpose = Object.hasOwn(equipmentPurposes, raw) ? raw : "";
  const items = getEquipment(purpose);
  function select(value: string) {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value) next.set("usage", value);
        else next.delete("usage");
        return next;
      },
      { preventScrollReset: true },
    );
  }
  return (
    <section
      className="equipment-page container"
      aria-labelledby="equipment-page-title"
    >
      <Helmet>
        <title>Les équipements scientifiques — LabCongo</title>
        <meta
          name="description"
          content="Microscopes, verrerie, instruments de mesure et accessoires : découvrez le matériel pour la pratique des sciences dans les écoles."
        />
      </Helmet>
      <nav className="school-breadcrumb" aria-label="Fil d’Ariane">
        <Link to="/">Accueil</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Les équipements</span>
      </nav>
      <header className="equipment-page-heading">
        <p className="eyebrow">Le matériel scientifique</p>
        <h1 id="equipment-page-title">
          Des outils pour apprendre.
          <br />
          <em>Des savoirs à transmettre.</em>
        </h1>
        <p>
          Découvrez les usages et les exemples de matériel qui peuvent
          accompagner un laboratoire scolaire. Ces familles présentent la
          démarche de collecte ; elles ne constituent pas un inventaire de
          matériel déjà reçu.
        </p>
      </header>
      <fieldset className="equipment-filters">
        <legend>Explorer par usage</legend>
        <div>
          {[["", "Tous les usages"], ...Object.entries(equipmentPurposes)].map(
            ([value, label]) => (
              <button
                type="button"
                key={value}
                onClick={() => select(value)}
                aria-pressed={value === purpose}
                aria-controls="equipment-results"
              >
                {label}
              </button>
            ),
          )}
        </div>
      </fieldset>
      <p className="equipment-results-count" role="status">
        {items.length}{" "}
        {items.length > 1 ? "familles de matériel" : "famille de matériel"}
      </p>
      <div className="equipment-grid" id="equipment-results">
        {items.map((item) => (
          <EquipmentCard key={item.id} item={item} />
        ))}
      </div>
      <aside className="equipment-donation-note">
        <div>
          <p className="eyebrow">Vous avez du matériel à proposer ?</p>
          <h2>Commençons par le connaître.</h2>
          <p>
            Nature, état, quantités, localisation et photos : ces informations
            aideront à examiner votre proposition.
          </p>
        </div>
        <Link className="button" to="/faire-un-don">
          Proposer du matériel ↗
        </Link>
      </aside>
    </section>
  );
}
