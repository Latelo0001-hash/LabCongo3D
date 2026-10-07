import { Helmet } from "react-helmet-async";
import FilmSequence from "../../features/film/FilmSequence";
import JourneyAccess from "../../features/film/JourneyAccess";
import HomeDetails from "./HomeDetails";
import CTASection from "./sections/CTASection";
export default function Home() {
  return <>
      <Helmet>
        <title>LabCongo — La science en pratique</title>
        <meta
          name="description"
          content="LabCongo relie le matériel scientifique disponible en Europe aux besoins des écoles de RDC. Découvrez le projet et contribuez à la pratique des sciences."
        />
      </Helmet>
    <FilmSequence />
    <JourneyAccess />
    <HomeDetails />
    <CTASection />
  </>;
}
