import { Navigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import FilmSequence from "../../features/film/FilmSequence";
import ProcessSection from "./sections/ProcessSection";
import PilotSection from "./sections/PilotSection";
import PreviousExperienceSection from "./sections/PreviousExperienceSection";
import MapSection from "./sections/MapSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import NewsSection from "./sections/NewsSection";
import CTASection from "./sections/CTASection";
import ProjectOverviewSection from "./sections/ProjectOverviewSection";
import TeamSection from "./sections/TeamSection";
import OpenPitMotifs from "../../components/motifs/OpenPitMotifs";
import "../../styles/home-editorial.css";
import "./home-summary.css";
export default function Home() {
  const { hash } = useLocation();
  const relocated: Record<string, string> = {
    "#avant-apres": "/activites-realisations#avant-apres", "#collecte": "/nous-soutenir#proposer",
    "#enjeu-national": "/a-propos#enjeu-national", "#presentation": "/a-propos",
    "#voyage": "/notre-approche#parcours",
    "#impact": "/projet-pilote#impact",
    "#equipements": "/equipements", "#chiffres": "/projet-pilote#suivi",
  };
  if (relocated[hash]) return <Navigate to={relocated[hash]} replace />;
  return <>
    <Helmet><title>LabCongo — La science en pratique</title><meta name="description" content="LabCongo développe depuis Kinshasa une initiative consacrée à l’éducation scientifique et technique des jeunes : équiper les laboratoires, former les encadreurs et pérenniser les usages." /></Helmet>
    <FilmSequence />
    <div className="home-content home-summary">
      <ProjectOverviewSection />
      <ProcessSection />
      <PilotSection />
      <PreviousExperienceSection />
      <div id="ecoles" className="home-summary-territories has-motifs">
        <OpenPitMotifs />
        <MapSection />
      </div>
      <TeamSection />
      <TestimonialsSection />
      <NewsSection />
      <CTASection />
    </div>
  </>;
}
