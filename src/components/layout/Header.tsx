import { Link } from "react-router-dom";
import { ArrowUpRight, Menu } from "lucide-react";
import Navigation from "./Navigation";
import MobileMenu from "./MobileMenu";
import { useNavigation } from "../../features/navigation";
export default function Header({ immersive = false }: { immersive?: boolean }) {
  const { open, setOpen } = useNavigation();
  return (
    <>
      <header className={`site-header container${immersive ? " home-header" : ""}`}>
        <Link to="/" className="brand" aria-label="LabCongo — Accueil">
          <img
            src={immersive ? "/images/brand/logo-white.png" : "/images/brand/logo-color.png"}
            alt="LabCongo"
            className="brand-logo"
            width="800"
            height="382"
          />
        </Link>
        <Navigation />
        <Link className="header-cta" to="/faire-un-don">
          Soutenir le projet <ArrowUpRight size={16} />
        </Link>
        <button
          className="menu-toggle"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu />
        </button>
      </header>
      <MobileMenu />
    </>
  );
}
