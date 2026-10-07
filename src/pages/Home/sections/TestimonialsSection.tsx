import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import FadeIn from "../../../components/animations/FadeIn";
import { getTestimonials } from "../../../services/publication";
export default function TestimonialsSection() {
  const items = getTestimonials();
  return (
    <section
      id="temoignages"
      className="testimonials-section container section-space"
      aria-labelledby="testimonials-title"
    >
      <FadeIn>
        <div className="section-heading">
          <p className="eyebrow">14 — Les voix du terrain</p>
          <h2 id="testimonials-title">
            Écouter celles et ceux
            <br />
            <em>qui font l’école.</em>
          </h2>
        </div>
      </FadeIn>
      {items.length ? (
        <div className="testimonial-grid">
          {items.map((item) => (
            <figure key={item.id}>
              <blockquote>{item.quote}</blockquote>
              <figcaption>
                <strong>{item.author}</strong>
                <span>
                  {item.role} · {item.context}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="testimonial-invitation">
          <MessageCircle size={40} strokeWidth={1} aria-hidden="true" />
          <div>
            <h3>Les expériences se racontent avec leurs acteurs.</h3>
            <p>
              Les témoignages seront publiés avec l’accord des personnes
              concernées. Vous enseignez, vous accompagnez une école ou vous
              contribuez au projet ? Votre regard nous intéresse.
            </p>
            <Link className="text-link" to="/contact?objet=temoignage">
              Partager une expérience ↗
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
