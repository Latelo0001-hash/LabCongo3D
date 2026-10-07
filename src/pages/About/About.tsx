import { PhotoImage, PhotoCredit } from "../../components/common/Photo";
import { narrativePhotos } from "../../features/experience/photos";
import { Link } from "react-router-dom";
import PageIntro from "../../components/common/PageIntro";
import EditorialCTA from "../../components/common/EditorialCTA";
export default function About() {
  return (
    <>
      <PageIntro
        eyebrow="Le projet LabCongo"
        title="Du matériel disponible. Un savoir à transmettre."
        description="LabCongo relie les équipements scientifiques disponibles en Europe aux besoins d’apprentissage des écoles de République démocratique du Congo."
      />
      <div className="container editorial-page">
        <section className="editorial-split">
          <div>
            <p className="eyebrow">La science en pratique</p>
            <h2>Faire le lien entre une leçon et une expérience.</h2>
          </div>
          <div>
            <p>
              Observer au microscope, mesurer une grandeur, comparer des
              résultats : la pratique donne une autre dimension aux sciences.
              LabCongo veut aider les écoles à créer ces moments
              d’apprentissage.
            </p>
            <p>
              La démarche consiste à collecter du matériel scientifique en
              Belgique et en France, à le préparer, puis à organiser son
              acheminement et sa mise en service en RDC.
            </p>
            <Link className="text-link" to="/mission">
              Découvrir notre mission ↗
            </Link>
          </div>
        </section>
        <figure className="editorial-photo">
          <PhotoImage photo={narrativePhotos.pratique} />
          <figcaption>
            <PhotoCredit photo={narrativePhotos.pratique} />
          </figcaption>
        </figure>
        <section className="editorial-split">
          <h2>Une démarche guidée par les besoins des écoles.</h2>
          <div>
            <p>
              Le choix du matériel part des enseignements, des conditions
              d’accueil et des possibilités d’utilisation. Une attention
              particulière est portée aux provinces minières, où les sciences et
              les techniques peuvent ouvrir de nouvelles perspectives.
            </p>
            <p>
              Équiper un espace ne suffit pas : la prise en main, l’entretien et
              l’accompagnement des enseignants font partie de la démarche.
            </p>
            <Link className="text-link" to="/notre-demarche">
              Suivre le parcours du matériel ↗
            </Link>
          </div>
        </section>
        <section id="experience" className="editorial-split editorial-band">
          <div>
            <p className="eyebrow">L’expérience antérieure de l’équipe</p>
            <h2>Une capacité logistique au service de l’école.</h2>
          </div>
          <div>
            <p>
              L’équipe dispose d’une expérience d’équipement d’une structure
              hospitalière en RDC, de la collecte en Europe à la réception et à
              l’installation auprès du bénéficiaire.
            </p>
            <p>
              Cette expérience constitue un appui pour organiser le parcours du
              matériel scolaire : vérifier, inventorier, conditionner, acheminer
              et mettre en service. La mission de LabCongo reste centrée sur
              l’éducation scientifique.
            </p>
          </div>
        </section>
        <EditorialCTA />
      </div>
    </>
  );
}
