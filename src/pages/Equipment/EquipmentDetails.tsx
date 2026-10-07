import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  equipmentPurposes,
  findEquipment,
} from "../../features/equipment/services/catalog";
import EquipmentIllustration from "../../features/equipment/components/EquipmentIllustration";
export default function EquipmentDetails() {
  const { slug } = useParams();
  const item = findEquipment(slug);
  if (!item)
    return (
      <section className="equipment-not-found container">
        <Helmet>
          <title>Équipement introuvable — LabCongo</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <p className="eyebrow">Le matériel scientifique</p>
        <h1>Cette fiche n’est pas disponible.</h1>
        <Link className="button" to="/equipements">
          <ArrowLeft size={18} aria-hidden="true" /> Voir les équipements
        </Link>
      </section>
    );
  return (
    <article className="equipment-page container">
      <Helmet>
        <title>{`${item.name} — LabCongo`}</title>
        <meta name="description" content={item.summary} />
      </Helmet>
      <nav className="school-breadcrumb" aria-label="Fil d’Ariane">
        <Link to="/">Accueil</Link>
        <span aria-hidden="true">/</span>
        <Link to="/equipements">Les équipements</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{item.name}</span>
      </nav>
      <header className="equipment-detail-hero">
        <div>
          <p className="eyebrow">{equipmentPurposes[item.purpose]}</p>
          <h1>{item.name}</h1>
          <p className="equipment-detail-summary">{item.summary}</p>
          <p>{item.description}</p>
        </div>
        <div className="equipment-detail-art">
          <EquipmentIllustration purpose={item.purpose} />
          <span>Illustration · Famille de matériel</span>
        </div>
      </header>
      <div className="equipment-detail-columns">
        <section aria-labelledby="equipment-examples">
          <p className="eyebrow">Les instruments</p>
          <h2 id="equipment-examples">Quelques exemples</h2>
          <ul>
            {item.examples.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="equipment-uses">
          <p className="eyebrow">En classe</p>
          <h2 id="equipment-uses">Pour quoi faire ?</h2>
          <ul>
            {item.uses.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </section>
      </div>
      <section
        className="equipment-donation-note"
        aria-labelledby="equipment-donation-title"
      >
        <div>
          <p className="eyebrow">Préparer une proposition</p>
          <h2 id="equipment-donation-title">Les informations utiles</h2>
          <ul>
            {item.donationDetails.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
          <p>
            Ajoutez les quantités disponibles et le lieu de collecte.
            L’adéquation du matériel sera examinée selon les besoins et les
            conditions d’accueil de l’école.
          </p>
        </div>
        <Link className="button" to="/faire-un-don">
          Proposer du matériel ↗
        </Link>
      </section>
      <Link to="/equipements" className="text-link">
        Toutes les familles de matériel ↗
      </Link>
    </article>
  );
}
