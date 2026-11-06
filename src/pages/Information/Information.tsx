import { Helmet } from "react-helmet-async";
import PageIntro from "../../components/common/PageIntro";
import { site } from "../../config/site";
export default function Information({ privacy = false }: { privacy?: boolean }) {
  return <>
    <Helmet><meta name="robots" content="noindex" /></Helmet>
    <PageIntro eyebrow="Informations" title={privacy ? "Politique de confidentialité" : "Mentions légales"} description={privacy ? "Le fonctionnement des formulaires et l’utilisation de vos coordonnées de contact." : "Les informations d’identification et de contact de LabCongo."} />
    <div className="container editorial-page information-page">
      {privacy ? <>
        <section><h2>Les informations que vous choisissez de communiquer.</h2><p>Les formulaires permettent de préparer une demande avec votre nom, votre e-mail, votre organisation, votre pays, votre téléphone et votre message. Selon l’objet de la demande, des informations sur le matériel ou l’établissement peuvent être ajoutées.</p></section>
        <section><h2>Un e-mail préparé dans votre messagerie.</h2><p>La saisie reste dans la page et n’est pas enregistrée dans une base de données du site. Le formulaire affiche un brouillon que vous pouvez relire, copier ou ouvrir dans votre messagerie. Vous choisissez ensuite de l’envoyer.</p><p>L’envoi depuis votre messagerie relève également des conditions de votre fournisseur de messagerie. Les coordonnées communiquées permettent à LabCongo de répondre à votre demande.</p></section>
        <section><h2>Une question sur vos informations ?</h2><p>Pour toute question concernant un message adressé à LabCongo ou vos coordonnées, contactez l’équipe à <a href={`mailto:${site.email}`}>{site.email}</a>.</p></section>
      </> : <section><h2>LabCongo</h2><p>Initiative basée à Kinshasa et dédiée au développement de l’éducation scientifique et technique des jeunes Congolais.</p><p>Contact : <a href={`mailto:${site.email}`}>{site.email}</a>.</p><p>Les références administratives, le responsable de publication et les informations d’hébergement seront complétés après validation par LabCongo.</p></section>}
    </div>
  </>;
}
