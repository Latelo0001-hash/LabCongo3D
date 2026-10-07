import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getProvinceShapes } from "../../services/provinces.api";
import { getPublishedSchools } from "../schools/services/catalog";
export default function StoryMap() {
  const { data } = useQuery({
    queryKey: ["province-shapes"],
    queryFn: ({ signal }) => getProvinceShapes(signal),
    staleTime: Infinity,
  });
  const schools = getPublishedSchools();
  const codes = new Set(schools.map((item) => item.provinceCode));
  return (
    <aside className="story-map">
      <p>République démocratique du Congo</p>
      {data && (
        <svg
          viewBox="0 0 720 650"
          role="img"
          aria-label="Provinces de la RDC ; seules les provinces avec des écoles publiées sont mises en évidence."
        >
          {data.map((shape) => (
            <path
              key={shape.code}
              d={shape.path}
              fill={codes.has(shape.code) ? "#fff200" : "#e0eaf5"}
              stroke="#0054a6"
              strokeWidth="1.4"
            />
          ))}
        </svg>
      )}
      <span>
        {schools.length
          ? `${schools.length} école${schools.length > 1 ? "s" : ""} publiée${schools.length > 1 ? "s" : ""}`
          : "Les écoles seront situées après validation."}
      </span>
      <Link to="/#carte-rdc">Explorer la carte ↗</Link>
      <small>geoBoundaries / OpenStreetMap · ODbL</small>
    </aside>
  );
}
