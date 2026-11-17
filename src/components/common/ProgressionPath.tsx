import { useEffect, useRef, useState } from "react";
import { pathway } from "../../data/editorialContent";

export default function ProgressionPath() {
  const steps = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const items = Array.from(steps.current?.children ?? []);
      const threshold = Math.min(window.innerHeight * .35, 260);
      let current = 0;
      items.forEach((item, index) => {
        if (item.getBoundingClientRect().top <= threshold) current = index;
      });
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div className="progression-path">
    <nav className="progression-nav" aria-label="Les neuf étapes du parcours">
      <ol>{pathway.map((step, index) => <li key={step.id}>
        <a href={`#${step.id}`} className={`${index === active ? "is-current" : ""}${index < active ? " is-past" : ""}`}
          aria-current={index === active ? "step" : undefined} aria-label={`Étape ${step.number} : ${step.title}`}>
          <span className="progression-dot" aria-hidden="true">{step.number}</span><span className="progression-label">{step.title}</span>
        </a>
      </li>)}</ol>
    </nav>
    <ol ref={steps} className="progression-steps">{pathway.map((step, index) => <li key={step.id} id={step.id} className={index === active ? "is-current" : undefined}>
      <span className="progression-step-number">{step.number} / 09</span>
      <h3>{step.title}</h3>
      <p className="progression-tagline">{step.tagline}</p>
      <p>{step.text}</p>
    </li>)}</ol>
  </div>;
}
