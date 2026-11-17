import TeamMember from "../../components/common/TeamMember";
import { Building2, GraduationCap, Compass, Boxes, PackageCheck, ClipboardCheck, Truck, ArrowUpRight } from "lucide-react";
import { PhotoImage } from "../../components/common/Photo";
import { Link } from "react-router-dom";
import PageIntro from "../../components/common/PageIntro";
import EditorialCTA from "../../components/common/EditorialCTA";
import { presentationPhotos, team } from "../../data/presentation";
import { association, context, nationalChallenge, strategicFields, hospitalExperience } from "../../data/editorialContent";
import "./about.css";
import { MotifField } from "../../components/motifs/LabMotifs";
import { educationSource, miningProvinceCodes, miningSummary } from "../../data/educationStatistics";
import { provinces } from "../../data/provinces";

// Chiffres officiels du secondaire (Annuaire statistique 2023-2024), calculés depuis les données par province.
const statCount = new Intl.NumberFormat("fr-FR");
const nationalFigures = [
  { value: `${statCount.format(Math.round(miningSummary.pupils / 100000) / 10)} millions`, label: `d’élèves du secondaire dans les ${miningSummary.provinces} provinces minières, près de la moitié des élèves du pays.` },
  { value: `Moins de ${Math.ceil(miningSummary.maxElectricityElsewhere)}\u00a0%`, label: `des écoles secondaires ont l’électricité dans ${miningSummary.provincesElsewhere} des ${miningSummary.provinces} provinces minières, hors Haut-Katanga et Lualaba.` },
  { value: "Aucun", label: "chiffre officiel sur les laboratoires scolaires : l’annuaire statistique national ne les recense pas." },
];
const miningProvinceNames = new Intl.ListFormat("fr", { type: "conjunction" }).format(
  miningProvinceCodes.map((code) => provinces.find((province) => province.code === code)?.name ?? code),
);

const findingIcons = [Building2, GraduationCap, Compass];
const experienceIcons = [Boxes, ClipboardCheck, PackageCheck, Truck, Building2];
const sections = [
  { id: "constat", label: "Le constat" },
  { id: "enjeu-national", label: "L’enjeu national" },
  { id: "mission", label: "Notre mission" },
  { id: "experience", label: "Notre expérience" },
  { id: "equipe", label: "L’équipe" },
];

export default function About() {
  return <div className="about-page">
    <PageIntro className="about-intro" eyebrow="À propos" title={association.title} description={association.lead} sections={sections}>
      <figure className="about-intro-visual">
        <PhotoImage photo={presentationPhotos.laboratoireScolaire} priority sizes="(max-width: 760px) 90vw, 45vw" />
      </figure>
    </PageIntro>
    <div className="container editorial-page about-opening">
      <section id="constat" className="about-context" aria-labelledby="about-context-title">
        <div className="about-section-heading">
          <div><p className="eyebrow">01 — Le constat</p><h2 id="about-context-title">{context.title}.</h2></div>
          <div>{context.paragraphs.map((text) => <p key={text}>{text}</p>)}</div>
        </div>
        <div className="about-findings">{context.findings.map((item, index) => {
          const Icon = findingIcons[index];
          return <article key={item.title}><span className="about-icon"><Icon size={25} strokeWidth={1.5} aria-hidden="true" /></span><h3>{item.title}</h3><p>{item.text}</p></article>;
        })}</div>
      </section>
    </div>
      <section id="enjeu-national" className="color-stage has-section-background background-mining about-national" aria-labelledby="about-national-title">
        <div className="container about-national-content">
        <div><p className="eyebrow">02 — L’enjeu national</p><h2 id="about-national-title">{nationalChallenge.title}.</h2><span className="about-national-rule" aria-hidden="true" /></div>
        <div><p>{nationalChallenge.lead}</p><p className="about-national-action"><strong>{nationalChallenge.action}</strong></p><p>{nationalChallenge.text}</p><ul className="content-tags">{strategicFields.map((field) => <li key={field}>{field}</li>)}</ul><p>{nationalChallenge.conclusion}</p></div>
        </div>
        <div className="container about-national-data">
          <ul className="about-national-figures">{nationalFigures.map((figure) => <li key={figure.value}><strong>{figure.value}</strong> <span>{figure.label}</span></li>)}</ul>
          <p className="about-national-source">Source : <a href={educationSource.url} target="_blank" rel="noreferrer">{educationSource.title}</a>, {educationSource.publisher} (juin 2026), enseignement secondaire. Provinces minières retenues : {miningProvinceNames}.</p>
        </div>
      </section>
    <div className="container editorial-page about-body about-mission-body">
      <section id="mission" className="about-mission" aria-labelledby="about-mission-title">
        <div className="about-section-heading"><div><p className="eyebrow">03 — Notre ambition</p><h2 id="about-mission-title">Observer, manipuler, expérimenter.</h2></div><p>{association.ambition}</p></div>
        <div className="about-mission-grid">
          <figure className="editorial-photograph about-mission-photo"><PhotoImage photo={presentationPhotos.travauxPratiques} sizes="(max-width: 760px) 90vw, 40vw" /></figure>
          <div className="about-mission-panel"><p className="eyebrow">Notre mission</p><p className="about-mission-statement">{association.mission}</p><p>{association.response}</p><ul className="editorial-list">{association.services.map((service) => <li key={service}>{service}</li>)}</ul><Link className="text-link" to="/notre-approche">Découvrir notre approche <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
        </div>
      </section>
    </div>
      <section id="experience" className="about-experience has-motifs" aria-labelledby="about-experience-title">
        <MotifField set="mission" texture="lattice" drift={false} />
        <div className="container editorial-page about-experience-content">
        <div className="about-section-heading"><div><p className="eyebrow">04 — Notre expérience</p><h2 id="about-experience-title">{hospitalExperience.title}.</h2><p className="about-experience-label">L’équipement d’un hôpital</p></div><div><p>{hospitalExperience.lead}</p><p>Cette réalisation antérieure constitue une référence opérationnelle pour :</p></div></div>
        <ol className="about-logistics">{hospitalExperience.capacities.map((item, index) => {
          const Icon = experienceIcons[index];
          return <li key={item}><span className="about-logistics-top"><Icon size={25} strokeWidth={1.5} aria-hidden="true" /><span aria-hidden="true">0{index + 1}</span></span><p>{item}</p></li>;
        })}</ol>
        <p className="about-experience-conclusion">{hospitalExperience.conclusion}</p>
        </div>
      </section>
    <div className="container editorial-page about-body">
      <section id="equipe" className="about-team" aria-labelledby="about-team-title">
        <div className="about-team-heading"><div><p className="eyebrow">05 — L’équipe</p><h2 id="about-team-title">Les personnes qui portent LabCongo.</h2></div><Link className="text-link" to="/contact">Échanger avec l’équipe <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
        <ul className="about-team-list">{team.map((member) => <li key={member.name}><TeamMember member={member} /></li>)}</ul>
      </section>
      <EditorialCTA title="Créer les conditions pour apprendre." to="/nous-soutenir" label="Nous soutenir" />
    </div>
  </div>;
}
