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
      <div className="menu-header">
        <h2>Menu</h2>
        <button type="button" onClick={() => setOpen(false)} aria-label="Fermer le menu" autoFocus>
          <X aria-hidden="true" />
        </button>
      </div>
      <nav aria-label="Toutes les rubriques">
        {navigation.map((item) => (
          <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>{item.label}</NavLink>
        ))}
      </nav>
    </dialog>
  );
}
