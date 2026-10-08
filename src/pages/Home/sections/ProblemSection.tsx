import FadeIn from "../../../components/animations/FadeIn";
import StakesFigures from "../../../components/common/StakesFigures";
import { Building2, GraduationCap, Pickaxe } from "lucide-react";
import { findings } from "../../../data/presentation";
const icons = [Building2, GraduationCap, Pickaxe];
export default function ProblemSection() {
  return (
    <section id="enjeux" className="problem-section" aria-labelledby="problem-title">
      <div className="container">
        <FadeIn>
          <div className="section-heading">
            <p className="eyebrow">02 — Le constat et l’enjeu</p>
            <h2 id="problem-title">
              Les conditions pour apprendre
              <br />
              <em>restent à créer.</em>
            </h2>
            <p>
              Trois constats expliquent pourquoi la pratique des sciences reste
              difficile d’accès pour de nombreux jeunes en RDC.
            </p>
          </div>
        </FadeIn>
        <div className="challenge-grid">
          {findings.map(({ title, text }, index) => {
            const Icon = icons[index];
            return (
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
            );
          })}
        </div>
        <FadeIn>
          <StakesFigures />
        </FadeIn>
      </div>
    </section>
  );
}
