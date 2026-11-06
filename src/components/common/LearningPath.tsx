import { pathway } from "../../data/editorialContent";
export default function LearningPath({ compact = false }: { compact?: boolean }) {
  return <ol className={`learning-path${compact ? " is-compact" : ""}`}>
    {pathway.map((step) => <li key={step.id} id={compact ? undefined : step.id}>
      <span className="editorial-number">{step.number}</span>
      <div><h3>{step.title}</h3><p className="path-tagline">{step.tagline}</p>{!compact && <p>{step.text}</p>}</div>
    </li>)}
  </ol>;
}
