import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { navigation } from "../../data/navigation";
import { useNavigation } from "../../features/navigation";
export default function MobileMenu() {
  const dialog = useRef<HTMLDialogElement>(null);
  const { open, setOpen } = useNavigation();
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);
  useEffect(() => {
    const el = dialog.current;
    if (open) el?.showModal();
    else el?.close();
  }, [open]);
  return (
    <dialog
      ref={dialog}
      className="mobile-menu"
      aria-label="Menu principal"
      data-lenis-prevent
      onCancel={() => setOpen(false)}
    >
      <button onClick={() => setOpen(false)} aria-label="Fermer le menu">
        <X />
      </button>
      <nav aria-label="Navigation mobile">
        {[
          ...navigation,
          { label: "L’expérience 3D", to: "/experience" },
          { label: "Projets & réalisations", to: "/projets" },
          { label: "Équipements", to: "/equipements" },
          { label: "Actualités", to: "/actualites" },
          { label: "Partenaires", to: "/partenaires" },
          { label: "Soutenir le projet", to: "/faire-un-don" },
          { label: "Contact", to: "/contact" },
        ].map((item) => (
          <Link key={item.to} to={item.to} onClick={() => setOpen(false)}>
            {item.label}
          </Link>
        ))}
      </nav>
    </dialog>
  );
}
