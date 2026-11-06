import { stakes } from "../../data/presentation";

// L'enjeu de la présentation : chiffres de contexte sur la RDC, toujours affichés avec leurs sources.
export default function StakesFigures({ eyebrow = "L’enjeu" }: { eyebrow?: string }) {
  return (
    <section className="stakes" aria-labelledby="stakes-title">
      <p className="eyebrow">{eyebrow}</p>
      <h3 id="stakes-title">{stakes.title}</h3>
      <p className="stakes-lead">{stakes.lead}</p>
      <dl className="stakes-figures">
        {stakes.figures.map((figure) => (
          <div key={figure.source}>
            <dt>{figure.label}</dt>
            <dd className="stakes-value">{figure.value}</dd>
            <dd>{figure.detail}</dd>
          </div>
        ))}
      </dl>
      <p className="stakes-conclusion">{stakes.conclusion}</p>
      <p className="stakes-sources">{stakes.sources}</p>
    </section>
  );
}
