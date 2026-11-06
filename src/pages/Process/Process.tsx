import { Link } from "react-router-dom";
import PageIntro from "../../components/common/PageIntro";
import EditorialCTA from "../../components/common/EditorialCTA";
import LearningPath from "../../components/common/LearningPath";
import { pillars } from "../../data/editorialContent";
import { presentationPhotos } from "../../data/presentation";
import { narrativePhotos } from "../../features/experience/photos";
import { PhotoImage, PhotoCredit } from "../../components/common/Photo";
const photos = [presentationPhotos.laboratoireScolaire, presentationPhotos.travauxPratiques, narrativePhotos.classe];
export default function Process() {
  return <>
    <PageIntro eyebrow="Notre approche" title="Équiper. Former. Pérenniser." description="Notre action repose sur trois piliers complémentaires : créer des environnements propices à l’apprentissage pratique, accompagner ceux qui les font vivre et relier les jeunes à de nouvelles perspectives."  sections={[{id: "equiper", label: "Équiper"}, {id: "former", label: "Former et accompagner"}, {id: "perenniser", label: "Pérenniser et relier"}, {id: "parcours", label: "Le parcours"}]} />
    <div className="container editorial-page">
      {pillars.map((pillar, index) => <section id={pillar.id} className="editorial-split approach-pillar" key={pillar.id}>
        <div><p className="eyebrow">{pillar.number} — {pillar.label}</p><h2>{pillar.title}.</h2><figure className="editorial-photograph"><PhotoImage photo={photos[index]} /><figcaption><PhotoCredit photo={photos[index]} /></figcaption></figure></div>
        <div><p>{pillar.text}</p><ul className="editorial-list">{pillar.items.map((item) => <li key={item}>{item}</li>)}</ul><p>{pillar.conclusion}</p></div>
      </section>)}
      <section id="parcours" aria-labelledby="material-journey"><p className="eyebrow">Le parcours LabCongo</p><h2 id="material-journey">Du besoin identifié dans une école à un laboratoire vivant.</h2><p>Un parcours progressif, de l’état des lieux aux usages pédagogiques et à leur suivi.</p><LearningPath /></section>
      <section className="editorial-split editorial-band"><h2>Un diagnostic avant chaque réponse.</h2><div><p>Le diagnostic et les cinq phases de développement sont regroupés dans le projet pilote : commencer à petite échelle pour tester une méthode, mesurer les résultats et construire un modèle durable.</p><Link className="text-link" to="/projet-pilote#diagnostic">Comprendre le projet pilote et son diagnostic ↗</Link></div></section>
      <EditorialCTA title="Des équipements disponibles ou une expertise à partager ?" to="/nous-soutenir" label="Choisir une façon de contribuer" />
    </div>
  </>;
}
