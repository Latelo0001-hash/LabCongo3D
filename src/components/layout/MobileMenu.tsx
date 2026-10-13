import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  useEffect(() => {
    if (!open) return;
    const compactHeader = window.matchMedia("(max-width: 1050px)");
    const closeOnDesktop = () => {
      if (!compactHeader.matches) setOpen(false);
    };
    closeOnDesktop();
    compactHeader.addEventListener("change", closeOnDesktop);
    return () => compactHeader.removeEventListener("change", closeOnDesktop);
  }, [open, setOpen]);
  return (
    <dialog
      ref={dialog}
      id="mobile-navigation"
      className="mobile-menu"
      aria-label="Menu principal"
      data-lenis-prevent
      onCancel={() => setOpen(false)}
      onClose={(event) => {
        // Un événement close peut arriver après une réouverture rapide.
        if (!event.currentTarget.open) setOpen(false);
      }}
    >
      <button type="button" onClick={() => setOpen(false)} aria-label="Fermer le menu">
        <X aria-hidden="true" />
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
          <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </dialog>
  );
}
