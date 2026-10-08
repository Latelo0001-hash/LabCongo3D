import { Link } from "react-router-dom";
import FadeIn from "../../../components/animations/FadeIn";
import { quote } from "../../../data/presentation";
export default function IntroSection() {
  return (
    <section id="presentation" className="intro container" aria-labelledby="intro-title">
      <FadeIn>
        <div className="intro-layout">
          <div className="intro-context">
            <p className="eyebrow">01 — Le constat</p>
            <h2 id="intro-title">Créer les conditions <em>pour apprendre.</em></h2>
            <p>{quote.context}</p>
            <Link className="text-link" to="/mission">Notre mission ↗</Link>
          </div>
          <figure className="quote-block">
            <blockquote><p>« {quote.text} »</p></blockquote>
            <figcaption>{quote.author}<span>{quote.role}</span></figcaption>
          </figure>
        </div>
      </FadeIn>
    </section>
  );
}
