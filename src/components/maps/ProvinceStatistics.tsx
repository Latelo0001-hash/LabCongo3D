import {
  educationSource,
  miningSummary,
  type SecondaryStats,
} from "../../data/educationStatistics";

interface Props {
  stats: SecondaryStats;
  /** Sans province sélectionnée, le bloc présente l’ensemble de la RDC. */
  national?: boolean;
}

const count = new Intl.NumberFormat("fr-FR");
const percent = (value: number) => `${Math.round(value)}\u00a0%`;

export default function ProvinceStatistics({ stats, national = false }: Props) {
  return (
    <section className="province-stats" aria-labelledby="province-stats-title">
      <h4 id="province-stats-title">
        {national ? "Le secondaire en RDC" : "Le secondaire en chiffres"}{" "}
        <span>2023-2024</span>
      </h4>
      <dl>
        <div>
          <dt>Écoles secondaires</dt>
          <dd>{count.format(stats.schools)}</dd>
        </div>
        <div>
          <dt>Élèves</dt>
          <dd>{count.format(stats.pupils)}</dd>
        </div>
        <div>
          <dt>Écoles avec l’électricité</dt>
          <dd>{percent(stats.electricity)}</dd>
        </div>
        <div>
          <dt>Écoles avec un point d’eau</dt>
          <dd>{percent(stats.water)}</dd>
        </div>
        <div className="province-stats-wide">
          <dt>Jeunes qui achèvent le secondaire</dt>
          <dd>
            {percent(stats.completion)}{" "}
            <small>dont filles : {percent(stats.girlsCompletion)}</small>
          </dd>
        </div>
      </dl>
      {national && (
        <p className="province-stats-note">
          Les {miningSummary.provinces} provinces minières, en jaune sur la
          carte, comptent{" "}
          {count.format(Math.round(miningSummary.pupils / 100000) / 10)}{" "}
          millions d’élèves du secondaire.
        </p>
      )}
      <p className="province-stats-source">
        Source :{" "}
        <a href={educationSource.url} target="_blank" rel="noreferrer">
          {educationSource.title}
        </a>
        , {educationSource.publisher}. Écoles ayant répondu au recensement :{" "}
        {percent(stats.coverage)}.
      </p>
    </section>
  );
}
