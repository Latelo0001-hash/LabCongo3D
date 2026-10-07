import { Helmet } from "react-helmet-async";
import ImmersiveJourney from "../../features/immersive/ImmersiveJourney";
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
    <ImmersiveJourney />
    <HomeDetails />
    <CTASection />
  </>;
}
