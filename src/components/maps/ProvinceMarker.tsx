import type { Province } from "../../data/provinces";
interface Props {
  province: Province;
  path: string;
  selected: boolean;
  onSelect: (code: string) => void;
}
export default function ProvinceMarker({
  province,
  path,
  selected,
  onSelect,
}: Props) {
  return (
    <path
      d={path}
      fillRule="evenodd"
      className="province-shape"
      role="button"
      tabIndex={0}
      aria-label={province.name}
      aria-pressed={selected}
      aria-controls="province-details"
      data-province={province.code}
      onClick={() => onSelect(province.code)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(province.code);
        }
      }}
    >
      <title>{province.name}</title>
    </path>
  );
}
