import { Link } from "react-router-dom";
import PageIntro from "../../components/common/PageIntro";
import EditorialCTA from "../../components/common/EditorialCTA";
import { impactAxes } from "../../data/impact";
import { PhotoImage, PhotoCredit } from "../../components/common/Photo";
import { narrativePhotos } from "../../features/experience/photos";
export default function Mission() {
  return (
    <>
      <PageIntro
        eyebrow="Notre mission"
        title="Rendre la science accessible par l’expérience."
        description="Accompagner progressivement les écoles de RDC pour que les élèves puissent observer, expérimenter et comprendre avec du matériel adapté."
      />
      <div className="container editorial-page">
        <section
          className="editorial-split mission-model-block"
          data-scene-scroll
        >
          <div>
            <p className="eyebrow">Un espace pour apprendre</p>
            <h2>Le laboratoire commence avec un usage.</h2>
            <p>
              Un instrument doit répondre à un objectif pédagogique. LabCongo
              souhaite réunir du matériel, un espace adapté et des enseignants
              accompagnés pour donner une place durable aux travaux pratiques.
            </p>
            <Link className="text-link" to="/equipements">
              Explorer les équipements ↗
            </Link>
          </div>
          <figure className="editorial-photograph">
            <PhotoImage photo={narrativePhotos.classe} />
            <figcaption>
              <PhotoCredit photo={narrativePhotos.classe} />
            </figcaption>
          </figure>
        </section>
        <section aria-labelledby="mission-objectives">
          <h2 id="mission-objectives">Trois objectifs qui se complètent.</h2>
          <div className="editorial-columns">
            {impactAxes.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="editorial-split editorial-band">
          <h2>Relier les sciences aux réalités du territoire.</h2>
          <div>
            <p>
              Mathématiques, physique, chimie, biologie, mécanique et
              électronique offrent des outils pour comprendre le monde. Dans les
              provinces minières notamment, cette culture scientifique peut
              nourrir des vocations et des parcours de formation.
            </p>
            <p>
              Les activités et les équipements doivent être adaptés à l’âge des
              élèves, au programme scolaire et aux conditions de sécurité de
              l’établissement.
            </p>
          </div>
        </section>
        <EditorialCTA
          title="Votre école souhaite développer la pratique ?"
          to="/contact?objet=ecole"
          label="Présenter une école"
        />
      </div>
    </>
  );
}
