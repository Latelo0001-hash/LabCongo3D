import { PhotoImage, PhotoCredit } from "../../components/common/Photo";
import { Link } from "react-router-dom";
import PageIntro from "../../components/common/PageIntro";
import EditorialCTA from "../../components/common/EditorialCTA";
import { presentationPhotos, response, team } from "../../data/presentation";
export default function About() {
  return (
    <>
      <PageIntro
        eyebrow="Le projet LabCongo"
        title="Une ASBL au service de la formation scientifique et technique des jeunes."
        description={response.lead}
      />
      <div className="container editorial-page">
        <section aria-labelledby="about-pillars">
          <h2 id="about-pillars" className="sr-only">
            L’association en bref
          </h2>
          <div className="editorial-columns">
            {response.pillars.map((pillar) => (
              <article key={pillar.title}>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </article>
            ))}
          </div>
        </section>
        <figure className="editorial-photo">
          <PhotoImage photo={presentationPhotos.travauxPratiques} />
          <figcaption>
            <PhotoCredit photo={presentationPhotos.travauxPratiques} />
          </figcaption>
        </figure>
        <section className="editorial-split">
          <div>
            <p className="eyebrow">La science en pratique</p>
            <h2>Apprendre en manipulant, en expérimentant.</h2>
          </div>
          <div>
            <p>
              Observer au microscope, mesurer une grandeur, comparer des
              résultats : la pratique donne une autre dimension aux sciences.
              LabCongo équipe des laboratoires, forme les encadreurs et
              accompagne les élèves pour que ces moments d’apprentissage
              deviennent réguliers.
            </p>
            <p>
              Pour équiper les laboratoires, LabCongo collecte aussi du
              matériel scientifique en Belgique et en France, le prépare, puis
              organise son acheminement et sa mise en service en RDC.
            </p>
            <Link className="text-link" to="/notre-demarche">
              Découvrir notre démarche ↗
            </Link>
          </div>
        </section>
        <section className="editorial-split">
          <h2>Des sciences de base aux métiers des secteurs stratégiques.</h2>
          <div>
            <p>
              Susciter l’intérêt des jeunes pour les sciences, c’est aussi les
              préparer aux métiers dont la RDC a besoin : les mines, la
              transformation locale et les technologies.
            </p>
            <p>
              Équiper un espace ne suffit pas : la formation des encadreurs, le
              mentorat, les stages et la maintenance des équipements font partie
              de la démarche.
            </p>
            <Link className="text-link" to="/mission">
              Découvrir notre mission ↗
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
        <section className="editorial-split" aria-labelledby="about-team">
          <div>
            <p className="eyebrow">L’équipe</p>
            <h2 id="about-team">Les personnes qui portent LabCongo.</h2>
          </div>
          <ul className="team-list">
            {team.map((member) => (
              <li key={member.name}>
                <strong>{member.name}</strong>
                <span>{member.role}</span>
              </li>
            ))}
          </ul>
        </section>
        <EditorialCTA />
      </div>
    </>
  );
}
