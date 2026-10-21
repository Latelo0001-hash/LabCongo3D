import PageIntro from "../../components/common/PageIntro";
import PartnerList from "../../components/common/PartnerList";
import PartnershipForm from "../../components/forms/PartnershipForm";
import { partnerRoles } from "../../data/impact";
import { partnerActors } from "../../data/editorialContent";
export default function Partners() {
  return (
    <>
      <PageIntro
        eyebrow="Partenaires"
        title="Construire LabCongo ensemble."
        description="Créer des laboratoires durables nécessite plus que du matériel. LabCongo veut réunir autour des établissements des partenaires éducatifs, techniques et logistiques, ainsi que des donateurs."
        sections={[{id: "partenaires", label: "Les acteurs et leurs rôles"}, {id: "devenir-partenaire", label: "Devenir partenaire"}]} />
      <div className="container editorial-page">
        <section id="partenaires">
          <h2>Des rôles complémentaires.</h2>
          <ul className="content-tags">{partnerActors.map((actor) => <li key={actor}>{actor}</li>)}</ul>
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
