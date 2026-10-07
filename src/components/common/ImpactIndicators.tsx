import { getStatistics } from "../../services/publication";
import { impactMeasures } from "../../data/impact";
import AnimatedCounter from "../animations/AnimatedCounter";
export default function ImpactIndicators() {
  const items = getStatistics();
  if (!items.length)
    return (
      <div className="indicator-grid">
        {impactMeasures.map((item) => (
          <article key={item.title}>
            <p className="indicator-status">À documenter</p>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    );
  return (
    <div className="indicator-grid">
      {items.map((item) => (
        <article key={item.id}>
          <p className="indicator-value">
            <AnimatedCounter value={item.value} /> {item.unit}
          </p>
          <h3>{item.label}</h3>
          <p>{item.period}</p>
          <small>Source : {item.source}</small>
        </article>
      ))}
    </div>
  );
}
