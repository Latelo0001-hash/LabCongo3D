import { Link } from "react-router-dom";
import { MotifField } from "../../../components/motifs/LabMotifs";
import FadeIn from "../../../components/animations/FadeIn";
import { supportOptions } from "../../../data/editorialContent";
export default function CTASection() {
  return <section id="agir" className="final-cta section-space has-motifs" aria-labelledby="cta-title"><MotifField set="cta" texture="lattice" route /><div className="container">
    <FadeIn><p className="eyebrow">Nous soutenir</p><h2 id="cta-title">Plusieurs façons <em>de contribuer.</em></h2></FadeIn>
    <div className="home-support-options">{supportOptions.map((option) => <article key={option.title}><h3>{option.title}</h3><p>{option.text}</p><Link className="button button-secondary" to={option.to}>{option.label} ↗</Link></article>)}</div>
  </div></section>;
}
