import { Link, useLocation } from "react-router-dom";
import { navigation } from "../../data/navigation";

// Suit le récit institutionnel uniquement sur les neuf pages principales.
export default function EditorialNavigation() {
  const { pathname } = useLocation();
  const index = navigation.findIndex((item) => item.to === pathname.replace(/\/$/, ""));
  if (index < 0) return null;
  const previous = navigation[index - 1];
  const next = navigation[index + 1];
  return (
    <nav className="container editorial-navigation" aria-label="Poursuivre la découverte de LabCongo">
      {previous && <Link to={previous.to}><span>Rubrique précédente</span><strong>← {previous.label}</strong></Link>}
      {next && <Link className="editorial-navigation-next" to={next.to}><span>Poursuivre la découverte</span><strong>{next.label} →</strong></Link>}
    </nav>
  );
}
