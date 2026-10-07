import { useSearchParams } from "react-router-dom";
import PageIntro from "../../components/common/PageIntro";
import ContactForm from "../../components/forms/ContactForm";
import { normalizeSubject } from "../../features/contact/message";
import { site } from "../../config/site";
export default function Contact() {
  const [params] = useSearchParams();
  const subject = normalizeSubject(params.get("objet"));
  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Le projet avance par la rencontre."
        description="Présenter une école, partager une compétence, proposer du matériel ou poser une question : écrivez à l’équipe LabCongo."
      />
      <div className="container editorial-page">
        <section className="form-layout">
          <div>
            <p className="eyebrow">Commençons la conversation</p>
            <h2>Quelle contribution souhaitez-vous construire ?</h2>
            <p>
              Expliquez votre situation et votre lien avec le projet. La nature
              de votre demande nous aidera à préparer un échange utile.
            </p>
            <a className="contact-email" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <div className="contact-note">
              <h3>Une école à présenter ?</h3>
              <p>
                Précisez son nom, sa ville, les niveaux d’enseignement et les
                besoins prioritaires. La présentation d’un établissement ouvre
                un échange ; elle ne vaut pas confirmation d’équipement.
              </p>
            </div>
          </div>
          <ContactForm subject={subject} />
        </section>
      </div>
    </>
  );
}
