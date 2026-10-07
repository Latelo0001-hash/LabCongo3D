import { useQuery } from "@tanstack/react-query";
import { Map, RotateCcw } from "lucide-react";
import { provinces } from "../../data/provinces";
import { getProvinceShapes } from "../../services/provinces.api";
import { useNearViewport } from "../../hooks/useNearViewport";
import ProvinceMarker from "./ProvinceMarker";
interface Props {
  selectedCode: string | null;
  onSelect: (code: string) => void;
}
export default function CongoMap({ selectedCode, onSelect }: Props) {
  const { ref, visible } = useNearViewport();
  const { data, isError, refetch, isFetching } = useQuery({
    queryKey: ["province-shapes"],
    queryFn: ({ signal }) => getProvinceShapes(signal),
    enabled: visible,
    staleTime: Infinity,
    retry: 1,
  });
  return (
    <div ref={ref} className="congo-map" aria-busy={isFetching}>
      {data ? (
        <svg
          viewBox="0 0 720 650"
          role="group"
          aria-label="Carte interactive des provinces de la RDC"
          aria-describedby="map-instructions"
        >
          <g className="map-compass" aria-hidden="true">
            <path d="M666 92V52M658 64 666 52 674 64" />
            <text x="666" y="42">
              N
            </text>
          </g>
          {provinces.map((province) => {
            const shape = data.find((item) => item.code === province.code);
            return shape ? (
              <ProvinceMarker
                key={province.code}
                province={province}
                path={shape.path}
                selected={selectedCode === province.code}
                onSelect={onSelect}
              />
            ) : null;
          })}
        </svg>
      ) : (
        <div className="map-placeholder">
          <Map size={42} strokeWidth={1} aria-hidden="true" />
          {isError ? (
            <>
              <p role="alert">La carte est momentanément indisponible.</p>
              <p>Vous pouvez choisir une province dans la liste.</p>
              <button
                type="button"
                disabled={isFetching}
                onClick={() => void refetch()}
              >
                <RotateCcw size={16} aria-hidden="true" /> Réessayer
              </button>
            </>
          ) : (
            <p role="status">Chargement de la carte des provinces…</p>
          )}
        </div>
      )}
    </div>
  );
}
