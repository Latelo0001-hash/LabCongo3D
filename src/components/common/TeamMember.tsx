import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { TeamMemberProfile } from "../../data/presentation";
import "./team-member.css";

export default function TeamMember({ member, portraitCrop }: { member: TeamMemberProfile; portraitCrop?: { position: string; zoom?: number } }) {
  const { name, role, photo } = member;
  const portrait = () => (
    <div className="team-member-photo-frame">
      <img className="team-member-photo" src={photo.src}
        srcSet={`${photo.small} ${Math.floor(photo.width / 2)}w, ${photo.src} ${photo.width}w`}
        sizes="(max-width: 640px) 90vw, (max-width: 1050px) 43vw, 390px"
        alt={`Portrait de ${name}`} width={photo.width} height={photo.height}
        loading="lazy" decoding="async"
        style={{ objectPosition: portraitCrop?.position ?? photo.position, transform: `scale(${portraitCrop?.zoom ?? photo.zoom ?? 1})` }} />
    </div>
  );

  return (
    <article className="team-member">
      {portrait()}
      <div className="team-member-caption">
        <h3>{name}</h3>
        <p className="team-member-role">{role ?? "Équipe LabCongo"}</p>
        <Link to={`/equipe/${member.slug}`} className="team-member-open" aria-label={`Voir le profil de ${name}`}>
          Voir le profil <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>

    </article>
  );
}
