import type { Province } from "../../data/provinces";
interface Props {
  province: Province;
  path: string;
  selected: boolean;
  mining?: boolean;
  onSelect: (code: string) => void;
}
export default function ProvinceMarker({
  province,
  path,
  selected,
  mining = false,
  onSelect,
}: Props) {
  const label = mining ? `${province.name}, province minière` : province.name;
  return (
    <path
      d={path}
      fillRule="evenodd"
      className={mining ? "province-shape is-mining" : "province-shape"}
      role="button"
      tabIndex={0}
      aria-label={label}
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
      <title>{label}</title>
    </path>
  );
}
