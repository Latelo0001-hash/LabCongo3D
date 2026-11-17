import PartnershipContent from "./sections/PartnershipContent";
import { Link } from "react-router-dom";
import PageIntro from "../../components/common/PageIntro";
import DonationForm from "../../components/forms/DonationForm";
import { PackageCheck, Wrench, HeartHandshake, Check, ArrowUpRight } from "lucide-react";
import { supportOptions } from "../../data/editorialContent";
import "./donate.css";
const icons = [PackageCheck, HeartHandshake, Wrench];
export default function Donate() {
  return (
    <div className="donate-page">
      <PageIntro
        className="donate-intro"
        eyebrow="Nous soutenir"
        title="Plusieurs façons de contribuer."
        description="Donner du matériel, soutenir un établissement ou partager une expertise : chaque contribution peut aider à créer des conditions durables pour apprendre et expérimenter."
        sections={[{id: "contribuer", label: "Les façons de contribuer"}, {id: "preparer", label: "Préparer un don"}, {id: "proposer", label: "Proposer un équipement"}, {id: "partenaires", label: "Les partenariats"}, {id: "devenir-partenaire", label: "Devenir partenaire"}]} >
        <figure className="donate-intro-visual"><img src="/media/parcours/ecole-labo.jpg" alt="Illustration d’un laboratoire scolaire avec du matériel scientifique" width="1920" height="1080" /><figcaption><HeartHandshake size={24} aria-hidden="true" /><span>Du matériel aux savoirs.<small>Contribuer à la pratique des sciences.</small></span></figcaption></figure>
      </PageIntro>
      <div className="container editorial-page">
        <section id="contribuer" aria-labelledby="contribuer-title" className="donate-contributions">
          <div className="donate-heading"><p className="eyebrow">01 — Choisir sa contribution</p><h2 id="contribuer-title">Chaque engagement a sa place.</h2></div>
          <div className="editorial-columns support-options">
          {supportOptions.map((item, index) => { const Icon = icons[index]; return (
            <article key={item.title}>
              <div className="donate-card-top"><Icon size={28} strokeWidth={1.5} aria-hidden="true" /><span aria-hidden="true">0{index + 1}</span></div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <Link className="text-link" to={item.to}>
                {item.label} <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </article>
          ); })}
          </div>
        </section>
        <section id="preparer" className="editorial-split editorial-band">
          <div><p className="eyebrow">02 — Préparer un don</p><h2>Avant de déplacer le matériel.</h2><ul className="donate-checklist">{["Nature et références des équipements", "Quantité, état et accessoires disponibles", "Photos et lieu de stockage"].map(item => <li key={item}><Check size={18} aria-hidden="true" />{item}</li>)}</ul></div>
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
            <p className="eyebrow">03 — Proposer un don matériel</p>
            <h2>Présentez-nous vos équipements.</h2>
            <p>
              Ce premier message permet d’étudier votre proposition. Il
              n’organise pas automatiquement une collecte.
            </p>
            <p className="donate-contact-note">
              Les modalités d’un éventuel soutien financier sont à discuter
              directement avec l’équipe ; aucun paiement n’est effectué sur
              cette page.
            </p>
          </div>
          <DonationForm />
        </section>
        <PartnershipContent />
      </div>
    </div>
  );
}
