import { PhotoImage, PhotoCredit } from "../../components/common/Photo";
import { Link } from "react-router-dom";
import PageIntro from "../../components/common/PageIntro";
import EditorialCTA from "../../components/common/EditorialCTA";
import { presentationPhotos, team } from "../../data/presentation";
import { association, context, nationalChallenge, strategicFields, hospitalExperience } from "../../data/editorialContent";
export default function About() {
  return <>
    <PageIntro eyebrow="À propos" title={association.title} description={association.lead}  sections={[{id: "constat", label: "Le constat"}, {id: "enjeu-national", label: "L’enjeu national"}, {id: "mission", label: "Notre mission"}, {id: "experience", label: "Notre expérience"}, {id: "equipe", label: "L’équipe"}]} />
    <div className="container editorial-page">
      <section id="constat" className="editorial-split">
        <div><p className="eyebrow">Le constat</p><h2>{context.title}.</h2></div>
        <div>{context.paragraphs.map((text) => <p key={text}>{text}</p>)}<ul className="editorial-list">{context.findings.map((item) => <li key={item.title}>{item.title}</li>)}</ul></div>
      </section>
      <section id="enjeu-national" className="editorial-split editorial-band">
        <div><p className="eyebrow">L’enjeu national</p><h2>{nationalChallenge.title}.</h2></div>
        <div><p>{nationalChallenge.lead}</p><p><strong>{nationalChallenge.action}</strong></p><p>{nationalChallenge.text}</p><ul className="content-tags">{strategicFields.map((field) => <li key={field}>{field}</li>)}</ul><p>{nationalChallenge.conclusion}</p></div>
      </section>
      <section id="mission" className="editorial-split">
        <div><p className="eyebrow">Notre ambition</p><h2>Observer, manipuler, expérimenter.</h2><p>{association.ambition}</p><figure className="editorial-photograph"><PhotoImage photo={presentationPhotos.travauxPratiques} /><figcaption><PhotoCredit photo={presentationPhotos.travauxPratiques} /></figcaption></figure></div>
        <div><h3>Notre mission</h3><p className="content-emphasis">{association.mission}</p><p>{association.response}</p><ul className="editorial-list">{association.services.map((service) => <li key={service}>{service}</li>)}</ul><Link className="text-link" to="/notre-approche">Découvrir notre approche ↗</Link></div>
      </section>
      <section id="experience" className="editorial-split editorial-band">
        <div><p className="eyebrow">Notre expérience · L’équipement d’un hôpital</p><h2>{hospitalExperience.title}.</h2></div>
        <div><p>{hospitalExperience.lead}</p><p>Cette réalisation antérieure constitue une référence opérationnelle pour :</p><ul className="editorial-list">{hospitalExperience.capacities.map((item) => <li key={item}>{item}</li>)}</ul><p><strong>{hospitalExperience.conclusion}</strong></p></div>
      </section>
      <section id="equipe" className="editorial-split" aria-labelledby="about-team"><div><p className="eyebrow">L’équipe</p><h2 id="about-team">Les personnes qui portent LabCongo.</h2></div><ul className="team-list">{team.map((member) => <li key={member.name}><strong>{member.name}</strong><span>{member.role}</span></li>)}</ul></section>
      <EditorialCTA title="Créer les conditions pour apprendre." to="/nous-soutenir" label="Nous soutenir" />
    </div>
  </>;
}
