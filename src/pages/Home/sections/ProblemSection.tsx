import { MotifField } from "../../../components/motifs/LabMotifs";
import FadeIn from "../../../components/animations/FadeIn";
import { Building2, GraduationCap, Compass } from "lucide-react";
import { context } from "../../../data/editorialContent";
const icons = [Building2, GraduationCap, Compass];
export default function ProblemSection() {
  return (
    <section id="decouvrir" className="problem-section has-motifs" aria-labelledby="problem-title">
      <MotifField set="problem" texture="dots" />
      <div className="container" id="enjeux">
        <FadeIn>
          <div className="section-heading">
            <p className="eyebrow">01 — Le constat</p>
            <h2 id="problem-title">Les sciences s’apprennent aussi <em>par l’expérience.</em></h2>
            {context.paragraphs.map((text) => <p className="home-section-lead" key={text}>{text}</p>)}
          </div>
        </FadeIn>
        <div className="challenge-grid">
          {context.findings.map(({ title, text }, index) => {
            const Icon = icons[index];
            return <FadeIn key={title}>
              <article className="challenge">
                <div className="challenge-top"><Icon size={28} strokeWidth={1.4} aria-hidden="true" /><span>0{index + 1}</span></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            </FadeIn>;
          })}
        </div>

      </div>
    </section>
  );
}
