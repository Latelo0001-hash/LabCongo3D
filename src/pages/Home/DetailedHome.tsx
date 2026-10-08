import CollectionSection from "./sections/CollectionSection";
import JourneySection from "./sections/JourneySection";
import MapSection from "./sections/MapSection";
import SchoolsSection from "./sections/SchoolsSection";
import BeforeAfterSection from "./sections/BeforeAfterSection";
import EquipmentSection from "./sections/EquipmentSection";
import PreviousExperienceSection from "./sections/PreviousExperienceSection";
import PartnersSection from "./sections/PartnersSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import StatisticsSection from "./sections/StatisticsSection";
import { useEffect } from "react";
import { ScrollTrigger } from "../../lib/gsap";
export default function DetailedHome() {
  useEffect(() => { const frame = requestAnimationFrame(() => ScrollTrigger.refresh()); return () => cancelAnimationFrame(frame); }, []);
  return <>
      <CollectionSection />
      <JourneySection />
      <MapSection />
      <SchoolsSection />
      <BeforeAfterSection />
      <EquipmentSection />
      <PreviousExperienceSection />
      <PartnersSection />
      <TestimonialsSection />
      <StatisticsSection />
  </>;
}
