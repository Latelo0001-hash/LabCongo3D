import { Helmet } from "react-helmet-async";
import FilmSequence from "../../features/film/FilmSequence";
import JourneyAccess from "../../features/film/JourneyAccess";
import HomeDetails from "./HomeDetails";
import IntroSection from "./sections/IntroSection";
import ProblemSection from "./sections/ProblemSection";
import MissionSection from "./sections/MissionSection";
import ProcessSection from "./sections/ProcessSection";
import ImpactSection from "./sections/ImpactSection";
import CTASection from "./sections/CTASection";
import "../../styles/home-editorial.css";
export default function Home() {
  return <>
    <Helmet>
      <title>LabCongo — La science en pratique</title>
      <meta
        name="description"
        content="LabCongo, ASBL créée à Kinshasa, équipe des laboratoires scolaires, forme les encadreurs et accompagne les jeunes vers les sciences et les métiers des secteurs stratégiques de la RDC."
      />
    </Helmet>
    <FilmSequence />
    <div className="home-content">
      <JourneyAccess />
      {/* L'essentiel de la présentation de LabCongo, toujours visible. */}
      <IntroSection />
      <ProblemSection />
      <MissionSection />
      <ProcessSection />
      <ImpactSection />
      <HomeDetails />
      <CTASection />
    </div>
  </>;
}
