import IntroSection from "./sections/IntroSection";
import ProblemSection from "./sections/ProblemSection";
import MissionSection from "./sections/MissionSection";
import ProcessSection from "./sections/ProcessSection";
import CollectionSection from "./sections/CollectionSection";
import JourneySection from "./sections/JourneySection";
import MapSection from "./sections/MapSection";
import SchoolsSection from "./sections/SchoolsSection";
import BeforeAfterSection from "./sections/BeforeAfterSection";
import EquipmentSection from "./sections/EquipmentSection";
import ImpactSection from "./sections/ImpactSection";
import PreviousExperienceSection from "./sections/PreviousExperienceSection";
import PartnersSection from "./sections/PartnersSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import StatisticsSection from "./sections/StatisticsSection";
import { useEffect } from "react";
import { ScrollTrigger } from "../../lib/gsap";
export default function DetailedHome() {
  useEffect(() => { const frame = requestAnimationFrame(() => ScrollTrigger.refresh()); return () => cancelAnimationFrame(frame); }, []);
  return <>
      <IntroSection />
      <ProblemSection />
      <MissionSection />
      <ProcessSection />
      <CollectionSection />
      <JourneySection />
      <MapSection />
      <SchoolsSection />
      <BeforeAfterSection />
      <EquipmentSection />
      <ImpactSection />
      <PreviousExperienceSection />
      <PartnersSection />
      <TestimonialsSection />
      <StatisticsSection />
  </>;
}
