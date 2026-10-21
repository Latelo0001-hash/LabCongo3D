import { Navigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import FilmSequence from "../../features/film/FilmSequence";
import JourneyAccess from "../../features/film/JourneyAccess";
import SchoolVideoSection from "./sections/SchoolVideoSection";
import ProblemSection from "./sections/ProblemSection";
import NationalChallengeSection from "./sections/NationalChallengeSection";
import ProcessSection from "./sections/ProcessSection";
import PilotSection from "./sections/PilotSection";
import JourneySection from "./sections/JourneySection";
import SchoolsSection from "./sections/SchoolsSection";
import PreviousExperienceSection from "./sections/PreviousExperienceSection";
import ImpactSection from "./sections/ImpactSection";
import MapSection from "./sections/MapSection";
import PartnersSection from "./sections/PartnersSection";
import NewsSection from "./sections/NewsSection";
import CTASection from "./sections/CTASection";
import { MotifField } from "../../components/motifs/LabMotifs";
import "../../styles/home-editorial.css";
export default function Home() {
  const { hash } = useLocation();
  const relocated: Record<string, string> = {
    "#avant-apres": "/ecoles#avant-apres", "#collecte": "/nous-soutenir#proposer",
    "#equipements": "/equipements", "#chiffres": "/impact#suivi", "#temoignages": "/contact?objet=temoignage",
  };
  if (relocated[hash]) return <Navigate to={relocated[hash]} replace />;
  return <>
    <Helmet><title>LabCongo — La science en pratique</title><meta name="description" content="LabCongo développe depuis Kinshasa une initiative consacrée à l’éducation scientifique et technique des jeunes : équiper les laboratoires, former les encadreurs et pérenniser les usages." /></Helmet>
    <FilmSequence />
    <div className="home-content">
      <ProblemSection />
      <NationalChallengeSection />
      <JourneyAccess />
      <ProcessSection />
      <PilotSection />
      <JourneySection />
      <SchoolVideoSection />
      <SchoolsSection />
      <PreviousExperienceSection />
      <div className="home-still">
        <div className="home-still-backdrop"><MotifField set="impact" texture="dots" drift={false} /></div>
        <ImpactSection />
        <MapSection />
      </div>
      <PartnersSection />
      <NewsSection />
      <CTASection />
    </div>
  </>;
}
