import { Link } from "react-router-dom";
import FadeIn from "../../../components/animations/FadeIn";
import { PhotoImage, PhotoCredit } from "../../../components/common/Photo";
import { nationalChallenge, strategicFields } from "../../../data/editorialContent";
import { presentationPhotos } from "../../../data/presentation";
export default function NationalChallengeSection() {
  return <section id="enjeu-national" className="national-section container" aria-labelledby="national-title">
    <div className="national-layout"><FadeIn><div><p className="eyebrow">02 — L’enjeu pour la RDC</p><h2 id="national-title">Transformer la richesse du sous-sol <em>en richesse humaine.</em></h2><p>{nationalChallenge.lead}</p><p className="content-emphasis">{nationalChallenge.action}</p></div></FadeIn><figure><PhotoImage photo={presentationPhotos.siteMinier} /><figcaption><PhotoCredit photo={presentationPhotos.siteMinier} /></figcaption></figure></div>
    <p className="national-intro">{nationalChallenge.text}</p><ul className="content-tags">{strategicFields.map((field) => <li key={field}>{field}</li>)}</ul><Link className="text-link" to="/a-propos#enjeu-national">Comprendre l’enjeu national ↗</Link>
  </section>;
}
