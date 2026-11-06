import { Link } from "react-router-dom";
import FadeIn from "../../../components/animations/FadeIn";
import { supportOptions } from "../../../data/editorialContent";
import PartnerList from "../../../components/common/PartnerList";
import { getPartners } from "../../../services/publication";
export default function CTASection() {
  return <section id="agir" className="final-cta section-space has-section-background background-learning" aria-labelledby="cta-title"><div className="container">
    <FadeIn><p className="eyebrow">Participer · Nous soutenir</p><h2 id="cta-title">Construire LabCongo, <em>ensemble.</em></h2><p className="participation-lead">Du matériel, un soutien pour une école, une expertise ou un partenariat : trouvez votre façon de contribuer à la pratique des sciences.</p></FadeIn>
    <div className="home-support-options">{supportOptions.map((option) => <article key={option.title}><h3>{option.title}</h3><p>{option.text}</p><Link className="button button-secondary" to={option.to}>{option.label} ↗</Link></article>)}</div>
    <div id="partenaires" className="home-partnerships" role="group" aria-labelledby="participation-partners-title">
      <div><h3 id="participation-partners-title">Vous représentez une organisation ?</h3><p>Écoles, universités, entreprises, laboratoires et partenaires techniques ou logistiques : réunissons les moyens de faire vivre les laboratoires dans la durée.</p></div>
      <Link className="button button-secondary" to="/nous-soutenir#devenir-partenaire">Devenir partenaire ↗</Link>
    </div>
    {getPartners().length > 0 && <PartnerList />}
  </div></section>;
}
