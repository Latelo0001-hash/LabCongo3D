import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { team } from "../../data/presentation";
import TeamMember from "../../components/common/TeamMember";
import "./member-profile.css";

export default function MemberProfile() {
  const { slug } = useParams();
  const member = team.find((item) => item.slug === slug);
  if (!member) return <section className="container member-profile-missing">
    <Helmet><title>Membre introuvable — LabCongo</title><meta name="robots" content="noindex" /></Helmet>
    <h1>Ce profil n’est pas disponible.</h1>
    <Link className="text-link" to="/a-propos#equipe"><ArrowLeft size={18} aria-hidden="true" /> Revenir à l’équipe</Link>
  </section>;
  const { name, role, biography, photo } = member;
  return <div className="member-profile container">
    <Helmet><title>{name} — L’équipe LabCongo</title><meta name="description" content={`${name} — ${role ?? "Équipe LabCongo"}. Découvrez son profil au sein de LabCongo.`} /></Helmet>
    <Link className="member-profile-back" to="/a-propos#equipe"><ArrowLeft size={18} aria-hidden="true" /> Revenir à l’équipe</Link>
    <section className="member-profile-layout" aria-labelledby="member-profile-title">
      <figure className="member-profile-photo">
        <img src={photo.src} srcSet={`${photo.small} ${Math.floor(photo.width / 2)}w, ${photo.src} ${photo.width}w`}
          sizes="(max-width: 760px) 90vw, 480px" alt={`Portrait de ${name}`} width={photo.width} height={photo.height} decoding="async" />
      </figure>
      <div className="member-profile-copy">
        <p className="eyebrow">L’équipe LabCongo</p>
        <h1 id="member-profile-title">{name}</h1>
        <p className="member-profile-role">{role ?? "Équipe LabCongo"}</p>
        <section className="member-profile-biography" aria-labelledby="member-biography-title">
          <h2 id="member-biography-title">Biographie</h2>
          {biography?.trim() ? biography.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>) : <p>La biographie de ce membre sera publiée prochainement.</p>}
        </section>
        <Link className="text-link" to="/contact">Échanger avec l’équipe <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </div>
    </section>
    <section className="member-profile-others" aria-labelledby="other-members-title">
      <p className="eyebrow">Un engagement collectif</p>
      <h2 id="other-members-title">Découvrez aussi l’équipe.</h2>
      <ul>{team.filter((item) => item.slug !== slug).map((item) => <li key={item.slug}><TeamMember member={item} /></li>)}</ul>
    </section>
  </div>;
}
