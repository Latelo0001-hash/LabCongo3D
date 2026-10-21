export default function LanguageSelector() {
  return (
    <div className="language-selector" role="group" aria-label="Langue du site">
      <button type="button" lang="fr" aria-label="Français, langue actuelle" aria-pressed="true">Fr</button>
      <button type="button" lang="en" disabled title="Version anglaise bientôt disponible" aria-label="English, bientôt disponible">En</button>
    </div>
  );
}
