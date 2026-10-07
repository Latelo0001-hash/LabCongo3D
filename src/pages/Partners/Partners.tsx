import PageIntro from "../../components/common/PageIntro";
import PartnerList from "../../components/common/PartnerList";
import PartnershipForm from "../../components/forms/PartnershipForm";
import { partnerRoles } from "../../data/impact";
export default function Partners() {
  return (
    <>
      <PageIntro
        eyebrow="Nos partenaires"
        title="Faire équipe autour de la science."
        description="Établissements, laboratoires, entreprises, acteurs logistiques et diaspora : construisons des contributions utiles aux écoles."
      />
      <div className="container editorial-page">
        <section>
          <h2>Des rôles complémentaires.</h2>
          <div className="editorial-columns">
            {partnerRoles.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <PartnerList />
        </section>
        <section id="devenir-partenaire" className="form-layout">
          <div>
            <p className="eyebrow">Devenir partenaire</p>
            <h2>Partons de votre contribution.</h2>
            <p>
              Présentez votre organisation, les compétences ou les ressources
              que vous souhaitez mobiliser et vos possibilités d’intervention.
            </p>
            <p>
              Un premier échange permet de rapprocher votre proposition des
              besoins, puis de préciser ensemble les responsabilités et les
              prochaines étapes.
            </p>
          </div>
          <PartnershipForm />
        </section>
      </div>
    </>
  );
}
