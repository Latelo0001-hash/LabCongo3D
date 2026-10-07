import { Link } from "react-router-dom";
import PageIntro from "../../components/common/PageIntro";
import DonationForm from "../../components/forms/DonationForm";
import { PackageCheck, Wrench, HeartHandshake } from "lucide-react";
const options = [
  {
    icon: PackageCheck,
    title: "Donner du matériel",
    text: "Des instruments utiles, fonctionnels et adaptés à la pratique scolaire.",
    to: "#proposer",
    label: "Décrire mon matériel",
  },
  {
    icon: Wrench,
    title: "Partager une compétence",
    text: "Préparation, logistique, maintenance, pédagogie : chaque savoir-faire a sa place.",
    to: "/contact?objet=soutien",
    label: "Proposer mon aide",
  },
  {
    icon: HeartHandshake,
    title: "Soutenir une action",
    text: "Échangeons sur les besoins et les modalités d’un soutien au projet, y compris financier.",
    to: "/contact?objet=soutien",
    label: "Parler d’un soutien",
  },
];
export default function Donate() {
  return (
    <>
      <PageIntro
        eyebrow="Soutenir LabCongo"
        title="Une seconde vie pour le matériel. Un nouvel horizon pour les élèves."
        description="Votre contribution commence par un échange : identifier ce qui est disponible, comprendre les besoins et préparer une transmission utile."
      />
      <div className="container editorial-page">
        <div className="editorial-columns support-options">
          {options.map(({ icon: Icon, ...item }) => (
            <article key={item.title}>
              <Icon size={30} strokeWidth={1.4} aria-hidden="true" />
              <h2>{item.title}</h2>
              <p>{item.text}</p>
              <Link className="text-link" to={item.to}>
                {item.label} ↗
              </Link>
            </article>
          ))}
        </div>
        <section className="editorial-split editorial-band">
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
