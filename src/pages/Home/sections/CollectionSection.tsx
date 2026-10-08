import {
  ArrowDown,
  ArrowUpRight,
  FlaskConical,
  Microscope,
  Scale,
} from "lucide-react";
import FadeIn from "../../../components/animations/FadeIn";
import Button from "../../../components/common/Button";
import { PhotoImage } from "../../../components/common/Photo";
import { narrativePhotos } from "../../../features/experience/photos";

const equipment = [
  { icon: Microscope, name: "Observer", description: "Microscopes & optique" },
  {
    icon: FlaskConical,
    name: "Expérimenter",
    description: "Verrerie & matériel de laboratoire",
  },
  {
    icon: Scale,
    name: "Mesurer",
    description: "Balances & instruments de mesure",
  },
];

export default function CollectionSection() {
  return (
    <section
      className="collection-section"
      id="collecte"
      aria-labelledby="collection-title"
    >
      <div className="container">
        <FadeIn>
          <div className="collection-heading">
            <div>
              <p className="eyebrow">06 — La collecte en Europe</p>
              <h2 id="collection-title">
                Vos outils ont encore
                <br />
                <em>beaucoup à transmettre.</em>
              </h2>
            </div>
            <p>
              Un équipement disponible dans un laboratoire peut ouvrir de
              nouvelles possibilités dans une école. Le point de départ : faire
              correspondre ce matériel à un besoin réel.
            </p>
          </div>
        </FadeIn>
        <div className="collection-grid">
          <figure className="collection-figure">
            <PhotoImage photo={narrativePhotos.instruments} />
            <figcaption>
              <span className="eyebrow">Photographie d’illustration</span>
              <span>
                Établissements, laboratoires, entreprises et particuliers.
              </span>
            </figcaption>
          </figure>
          <FadeIn>
            <div className="collection-copy">
              <p className="eyebrow">Du matériel pour apprendre</p>
              <ul className="collection-equipment">
                {equipment.map(({ icon: Icon, name, description }) => (
                  <li key={name}>
                    <Icon aria-hidden="true" size={26} strokeWidth={1.4} />
                    <div>
                      <h3>{name}</h3>
                      <p>{description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="collection-guidance">
                Pour proposer un don, préparez une description du matériel, son
                état, sa localisation et quelques photos. Son adéquation aux
                besoins des écoles sera à examiner avant la collecte.
              </p>
              <Button to="/faire-un-don">
                Proposer du matériel{" "}
                <ArrowUpRight size={18} aria-hidden="true" />
              </Button>
              <a href="#voyage" className="collection-next">
                Suivre le parcours du matériel{" "}
                <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
