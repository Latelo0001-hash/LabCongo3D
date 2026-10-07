import { Box, FlaskConical, Microscope } from "lucide-react";
import type { ModelKind } from "./modelCatalog";
export default function SceneLoader({
  model = "microscope",
}: {
  model?: ModelKind;
}) {
  const Icon =
    model === "microscope"
      ? Microscope
      : model === "crate"
        ? Box
        : FlaskConical;
  return (
    <div className="scene-fallback" aria-hidden="true">
      <Icon size={82} strokeWidth={1} />
      <p>Observer. Expérimenter. Comprendre.</p>
    </div>
  );
}
