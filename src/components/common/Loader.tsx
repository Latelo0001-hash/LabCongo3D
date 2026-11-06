// Chargement d'une page : le même écran que l'ouverture du site (styles et icône dans index.html).
// Il n'apparaît qu'après un court délai, pour ne pas clignoter quand la page arrive tout de suite.
export default function Loader() {
  return (
    <div className="splash is-delayed" role="status" aria-label="Chargement de la page">
      <div className="splash-mark">
        <span className="splash-icon" />
        <span className="splash-bar" />
      </div>
    </div>
  );
}
