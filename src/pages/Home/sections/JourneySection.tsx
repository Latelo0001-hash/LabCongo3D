import { Link } from "react-router-dom";
import FadeIn from "../../../components/animations/FadeIn";
import LearningPath from "../../../components/common/LearningPath";
export default function JourneySection() {
  return <section id="voyage" className="journey-section" aria-labelledby="journey-title"><div className="container">
    <FadeIn><div className="journey-heading"><p className="eyebrow">06 — Le parcours LabCongo</p><h2 id="journey-title">Du besoin identifié dans une école <em>à un laboratoire vivant.</em></h2><p>Un parcours progressif qui part de l’établissement et se prolonge dans l’utilisation quotidienne du laboratoire.</p></div></FadeIn>
    <LearningPath compact />
    <Link className="text-link" to="/notre-approche#parcours">Suivre les neuf étapes du parcours ↗</Link>
  </div></section>;
}
