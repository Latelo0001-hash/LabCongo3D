import { MotifField } from "../../components/motifs/LabMotifs";
import "./process.css";
import { Link } from "react-router-dom";
import PageIntro from "../../components/common/PageIntro";
import EditorialCTA from "../../components/common/EditorialCTA";
import ProgressionPath from "../../components/common/ProgressionPath";
import { pillars } from "../../data/editorialContent";
import { presentationPhotos } from "../../data/presentation";
import { narrativePhotos } from "../../features/experience/photos";
import { PhotoImage } from "../../components/common/Photo";
const photos = [presentationPhotos.laboratoireScolaire, presentationPhotos.travauxPratiques, narrativePhotos.instruments];
export default function Process() {
  return <>
    <PageIntro eyebrow="Notre approche" title="Équiper. Former. Pérenniser." description="Notre action repose sur trois piliers complémentaires : créer des environnements propices à l’apprentissage pratique, accompagner ceux qui les font vivre et relier les jeunes à de nouvelles perspectives."  sections={[{id: "equiper", label: "Équiper"}, {id: "former", label: "Former et accompagner"}, {id: "perenniser", label: "Pérenniser et relier"}, {id: "parcours", label: "Le parcours"}]} />
    <div className="container editorial-page">
      {pillars.map((pillar, index) => <section id={pillar.id} className="editorial-split approach-pillar" key={pillar.id}>
        <div><p className="eyebrow">{pillar.number} — {pillar.label}</p><h2>{pillar.title}.</h2><figure className="editorial-photograph"><PhotoImage photo={photos[index]} /></figure></div>
        <div><p>{pillar.text}</p><ul className="editorial-list">{pillar.items.map((item) => <li key={item}>{item}</li>)}</ul><p>{pillar.conclusion}</p></div>
      </section>)}
      </div>
    <section id="parcours" className="approach-journey has-motifs" aria-labelledby="material-journey">
      <MotifField set="mission" texture="lattice" drift={false} />
      <div className="container editorial-page approach-journey-content">
        <div className="approach-journey-heading"><p className="eyebrow">Le parcours LabCongo</p><h2 id="material-journey">Du besoin identifié dans une école <em>à un laboratoire vivant.</em></h2><p>Un parcours progressif, de l’état des lieux aux usages pédagogiques et à leur suivi.</p></div>
        <ProgressionPath />
      </div>
    </section>
    <div className="container editorial-page approach-after-journey">
      <section className="editorial-split editorial-band"><h2>Un diagnostic avant chaque réponse.</h2><div><p>Le diagnostic et les cinq phases de développement sont regroupés dans le projet pilote : commencer à petite échelle pour tester une méthode, mesurer les résultats et construire un modèle durable.</p><Link className="text-link" to="/projet-pilote#diagnostic">Comprendre le projet pilote et son diagnostic ↗</Link></div></section>
      <EditorialCTA title="Des équipements disponibles ou une expertise à partager ?" to="/nous-soutenir" label="Choisir une façon de contribuer" />
    </div>
  </>;
}
