import { Component, lazy, Suspense, useCallback, useState } from "react";
import type { PropsWithChildren } from "react";
import { RotateCw } from "lucide-react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useNearViewport } from "../../hooks/useNearViewport";
import SceneLoader from "./SceneLoader";
import { modelCatalog } from "./modelCatalog";
import type { ModelKind } from "./modelCatalog";
const Scene = lazy(() => import("./Scene"));
class SceneBoundary extends Component<
  PropsWithChildren<{ model: ModelKind; onFailure: () => void }>,
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? (
      <SceneLoader model={this.props.model} />
    ) : (
      this.props.children
    );
  }
}
export default function LaboratoryScene({
  model = "microscope",
  controls = false,
}: {
  model?: ModelKind;
  controls?: boolean;
}) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { ref, visible } = useNearViewport();
  const [failed, setFailed] = useState(false);
  const [angle, setAngle] = useState(0);
  const [supported] = useState(() => {
    try {
      const context = document.createElement("canvas").getContext("webgl2");
      const ok = Boolean(context);
      context?.getExtension("WEBGL_lose_context")?.loseContext();
      return ok;
    } catch {
      return false;
    }
  });
  const onFailure = useCallback(() => setFailed(true), []);
  const active = visible && supported && !reduced && !failed;
  return (
    <div ref={ref} className="model-viewer" data-model={model}>
      <div
        className="laboratory-scene"
        role="img"
        aria-label={modelCatalog[model].description}
      >
        <div aria-hidden="true" className="scene-canvas">
          {active ? (
            <SceneBoundary model={model} onFailure={onFailure}>
              <Suspense fallback={<SceneLoader model={model} />}>
                <Scene model={model} angle={angle} onFailure={onFailure} />
              </Suspense>
            </SceneBoundary>
          ) : (
            <SceneLoader model={model} />
          )}
        </div>
      </div>
      {controls && active && (
        <button
          type="button"
          className="model-turn"
          onClick={() => setAngle((value) => value + Math.PI / 2)}
          aria-label={`Tourner le modèle : ${modelCatalog[model].label}`}
        >
          <RotateCw size={14} aria-hidden="true" />
          Changer l’angle
        </button>
      )}
    </div>
  );
}
