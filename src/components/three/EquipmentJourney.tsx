import { useState } from "react";
import LaboratoryScene from "./LaboratoryScene";
const stages = [
  {
    model: "microscope",
    label: "Collecter",
    text: "Identifier les instruments utiles à l’apprentissage.",
  },
  {
    model: "crate",
    label: "Acheminer",
    text: "Vérifier, protéger et préparer le matériel pour son voyage.",
  },
  {
    model: "laboratory",
    label: "Équiper",
    text: "Réunir les conditions pour pratiquer les sciences à l’école.",
  },
] as const;
export default function EquipmentJourney() {
  const [index, setIndex] = useState(0);
  const stage = stages[index];
  return (
    <div className="equipment-journey-3d" data-scene-scroll>
      <div
        className="model-stage-selector"
        role="group"
        aria-label="Explorer le parcours du matériel"
      >
        {stages.map((item, i) => (
          <button
            type="button"
            key={item.model}
            aria-pressed={index === i}
            aria-controls="journey-model"
            onClick={() => setIndex(i)}
          >
            <span>0{i + 1}</span>
            {item.label}
          </button>
        ))}
      </div>
      <div id="journey-model">
        <LaboratoryScene key={stage.model} model={stage.model} controls />
      </div>
      <p className="model-stage-description" role="status">
        {stage.text}
      </p>
      <p className="model-illustration-note">
        Illustrations du parcours — les équipements sont adaptés à chaque école.
      </p>
    </div>
  );
}
