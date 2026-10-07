import { useId, useState } from "react";
import type { PhotoComparison } from "../../types/gallery";
import BeforeAfterSlider from "./BeforeAfterSlider";
import Gallery from "./Gallery";
export default function ComparisonGallery({
  comparisons,
}: {
  comparisons: readonly PhotoComparison[];
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const selectId = useId();
  const current =
    comparisons.find((item) => item.id === selected) ?? comparisons[0];
  if (!current) return null;
  return (
    <div className="comparison-gallery">
      {comparisons.length > 1 && (
        <div className="comparison-select">
          <label htmlFor={selectId}>Choisir une comparaison</label>
          <select
            id={selectId}
            value={current.id}
            onChange={(event) => setSelected(event.target.value)}
          >
            {comparisons.map((item) => (
              <option value={item.id} key={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>
      )}
      <BeforeAfterSlider key={`slider-${current.id}`} comparison={current} />
      <Gallery key={current.id} images={[current.before, current.after]} />
    </div>
  );
}
