import { Link } from "react-router-dom";
import PageIntro from "../../components/common/PageIntro";
import DonationForm from "../../components/forms/DonationForm";
import { PackageCheck, Wrench, HeartHandshake } from "lucide-react";
import { supportOptions } from "../../data/editorialContent";
const icons = [PackageCheck, HeartHandshake, Wrench];
export default function Donate() {
  return (
    <>
      <PageIntro
        eyebrow="Nous soutenir"
        title="Plusieurs façons de contribuer."
        description="Donner du matériel, soutenir un établissement ou partager une expertise : chaque contribution peut aider à créer des conditions durables pour apprendre et expérimenter."
        sections={[{id: "contribuer", label: "Les façons de contribuer"}, {id: "preparer", label: "Préparer un don"}, {id: "proposer", label: "Proposer un équipement"}]} />
      <div className="container editorial-page">
        <section id="contribuer" aria-label="Les façons de contribuer" className="editorial-columns support-options">
          {supportOptions.map((item, index) => { const Icon = icons[index]; return (
            <article key={item.title}>
              <Icon size={30} strokeWidth={1.4} aria-hidden="true" />
              <h2>{item.title}</h2>
              <p>{item.text}</p>
              <Link className="text-link" to={item.to}>
                {item.label} ↗
              </Link>
            </article>
          ); })}
        </section>
        <section id="preparer" className="editorial-split editorial-band">
          <h2>Avant de déplacer le matériel.</h2>
          <div>
            <p>
              Transmettez une description, les références, l’état de
              fonctionnement, les accessoires disponibles, la quantité et le
              lieu de stockage. Des photos aident à examiner la proposition.
            </p>
            <p>
              Attendez un échange avec l’équipe pour convenir de la prise en
              charge. L’adéquation aux besoins, la sécurité, l’entretien et les
              possibilités de transport doivent être vérifiés.
            </p>
            <Link className="text-link" to="/equipements">
              Voir les familles de matériel ↗
            </Link>
          </div>
        </section>
        <section id="proposer" className="form-layout">
          <div>
            <p className="eyebrow">Proposer un don matériel</p>
            <h2>Présentez-nous vos équipements.</h2>
            <p>
              Ce premier message permet d’étudier votre proposition. Il
              n’organise pas automatiquement une collecte.
            </p>
            <p>
              Les modalités d’un éventuel soutien financier sont à discuter
              directement avec l’équipe ; aucun paiement n’est effectué sur
              cette page.
            </p>
          </div>
          <DonationForm />
        </section>
      </div>
    </>
  );
}
