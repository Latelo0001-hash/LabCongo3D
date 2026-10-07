import { getPartners, safeWebsite } from "../../services/publication";
export default function PartnerList() {
  const items = getPartners();
  if (!items.length)
    return (
      <p className="publication-note">
        Les partenaires seront présentés ici après confirmation de leur
        participation et accord de publication.
      </p>
    );
  return (
    <div className="partner-grid">
      {items.map((item) => {
        const url = safeWebsite(item.website);
        return (
          <article key={item.id}>
            {item.logo && (
              <img
                src={item.logo}
                alt=""
                loading="lazy"
                width="180"
                height="90"
              />
            )}
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            {url && (
              <a
                className="text-link"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visiter le site{" "}
                <span className="sr-only">de {item.name} (nouvel onglet)</span>↗
              </a>
            )}
          </article>
        );
      })}
    </div>
  );
}
