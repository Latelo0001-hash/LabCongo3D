import { ChevronDown, Globe2 } from "lucide-react";

export default function LanguageSelector() {
  return (
    <div className="language-selector">
      <Globe2 className="language-globe" size={16} aria-hidden="true" />
      <select className="language-select" aria-label="Langue du site" defaultValue="fr">
        <option value="fr" lang="fr">FR</option>
        <option value="en" lang="en" disabled>EN — bientôt disponible</option>
      </select>
      <ChevronDown className="language-chevron" size={12} aria-hidden="true" />
    </div>
  );
}
