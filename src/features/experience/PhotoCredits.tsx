import { narrativePhotos } from "./photos";
export default function PhotoCredits() {
  return (
    <section
      id="credits-photos"
      className="photo-credits container"
      aria-labelledby="photo-credits-title"
    >
      <p className="eyebrow">Les images du récit</p>
      <h2 id="photo-credits-title">Photographies & crédits</h2>
      <p>
        Des lieux, des instruments et des personnes photographiés pour illustrer
        la démarche. Ces images ne représentent ni les équipes ni les écoles
        bénéficiaires de LabCongo. Les cadrages s’adaptent à l’écran ; les
        personnes et les lieux n’ont pas été modifiés.
      </p>
      <ul>
        {Object.entries(narrativePhotos).map(([key, photo]) => (
          <li key={key}>
            <strong>{photo.caption}</strong>
            <span>{photo.author}</span>
            {photo.source ? (
              <a href={photo.source} target="_blank" rel="noreferrer">
                Voir la photographie d’origine ↗
              </a>
            ) : (
              <span>
                Fichier fourni avec le projet · provenance à confirmer
              </span>
            )}
            {photo.licenseUrl ? (
              <a href={photo.licenseUrl} target="_blank" rel="noreferrer">
                {photo.license} · format adapté au web
              </a>
            ) : (
              <span>
                {photo.license ??
                  "Crédit et droits à confirmer avant publication"}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
