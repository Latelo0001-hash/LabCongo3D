import FadeIn from "../../../components/animations/FadeIn";
import { BookOpen, FlaskConical, Lightbulb } from "lucide-react";
const challenges = [
  {
    icon: BookOpen,
    title: "Passer de la théorie au réel",
    text: "Observer une réaction, mesurer une masse, regarder au microscope : l’expérience donne un sens concret aux connaissances.",
  },
  {
    icon: FlaskConical,
    title: "Rendre les outils accessibles",
    text: "Un matériel adapté et fonctionnel permet aux enseignants de proposer des activités pratiques dans de bonnes conditions.",
  },
  {
    icon: Lightbulb,
    title: "Ouvrir des perspectives",
    text: "La découverte des sciences peut nourrir la curiosité et aider les jeunes à envisager leur place dans les métiers de demain.",
  },
];
export default function ProblemSection() {
  return (
    <section className="problem-section" aria-labelledby="problem-title">
      <div className="container">
        <FadeIn>
          <div className="section-heading">
            <p className="eyebrow">02 — La problématique</p>
            <h2 id="problem-title">
              Comprendre les sciences.
              <br />
              <em>Pouvoir les expérimenter.</em>
            </h2>
            <p>
              Apprendre une formule est un point de départ. Disposer des outils
              pour la mettre à l’épreuve ouvre une autre dimension de
              l’apprentissage.
            </p>
          </div>
        </FadeIn>
        <div className="challenge-grid">
          {challenges.map(({ icon: Icon, title, text }, index) => (
            <FadeIn key={title}>
              <article className="challenge">
                <div className="challenge-top">
                  <Icon size={28} strokeWidth={1.4} aria-hidden="true" />
                  <span>0{index + 1}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
