import { Camera, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import FadeIn from "../../../components/animations/FadeIn";
import ComparisonGallery from "../../../components/gallery/ComparisonGallery";
import { getPublishedComparisons } from "../../../services/comparisons";
export default function BeforeAfterSection() {
  const comparisons = getPublishedComparisons();
  return (
    <section
      className="before-after-section container"
      id="avant-apres"
      aria-labelledby="before-after-title"
    >
      <FadeIn>
        <div className="media-section-heading">
          <div>
            <p className="eyebrow">09 — Le suivi en images</p>
            <h2 id="before-after-title">
              Un même lieu.
              <br />
              <em>De nouvelles possibilités.</em>
            </h2>
          </div>
          <p>
            Du premier état des lieux à l’installation du matériel, les photos
            permettent de documenter ce qui change dans chaque école.
          </p>
        </div>
      </FadeIn>
      {comparisons.length ? (
        <ComparisonGallery comparisons={comparisons} />
      ) : (
        <div className="comparison-pending">
          <div className="comparison-pending-intro">
            <Camera size={34} strokeWidth={1.2} aria-hidden="true" />
            <h3>
              Chaque installation mérite
              <br />
              d’être documentée.
            </h3>
            <p>
              Les premières comparaisons seront publiées avec les photos
              validées des écoles.
            </p>
            <Link to="/ecoles">
              Découvrir les écoles <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <ol>
            <li>
              <span>01 / Avant</span>
              <h4>Comprendre le point de départ</h4>
              <p>
                Photographier l’espace et identifier les besoins de
                l’établissement.
              </p>
            </li>
            <li>
              <span>02 / Après</span>
              <h4>Montrer le chemin parcouru</h4>
              <p>
                Documenter l’installation et la place du matériel dans les
                activités pédagogiques.
              </p>
            </li>
          </ol>
        </div>
      )}
    </section>
  );
}
