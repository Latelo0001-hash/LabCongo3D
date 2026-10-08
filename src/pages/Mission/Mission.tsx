import { Link } from "react-router-dom";
import PageIntro from "../../components/common/PageIntro";
import EditorialCTA from "../../components/common/EditorialCTA";
import StakesFigures from "../../components/common/StakesFigures";
import { PhotoImage, PhotoCredit } from "../../components/common/Photo";
import { approach, presentationPhotos } from "../../data/presentation";
import { narrativePhotos } from "../../features/experience/photos";
export default function Mission() {
  return (
    <>
      <PageIntro
        eyebrow="Notre mission"
        title="Susciter l’intérêt des jeunes pour les sciences."
        description="Susciter l’intérêt des jeunes pour les sciences de base et les préparer aux métiers des secteurs stratégiques de la RDC."
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
              réunit des laboratoires équipés, des encadreurs formés et des
              travaux pratiques réguliers pour donner une place durable à
              l’expérimentation.
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
        <StakesFigures eyebrow="Pourquoi c’est essentiel" />
        <section aria-labelledby="mission-approach">
          <p className="eyebrow">Notre approche</p>
          <h2 id="mission-approach">{approach.title}.</h2>
          <div className="editorial-columns">
            {approach.steps.map((step) => (
              <article key={step.number}>
                <span className="editorial-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>
        <figure className="editorial-photo">
          <PhotoImage photo={presentationPhotos.siteMinier} />
          <figcaption>
            <PhotoCredit photo={presentationPhotos.siteMinier} />
          </figcaption>
        </figure>
        <section className="editorial-split editorial-band">
          <h2>Relier les sciences aux réalités du territoire.</h2>
          <div>
            <p>
              Mathématiques, physique, chimie, biologie, mécanique et
              électronique offrent des outils pour comprendre le monde. Elles
              ouvrent aussi la voie aux métiers des mines, de la transformation
              locale et des technologies.
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
