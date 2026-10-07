import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import type { Group } from "three";
import Lighting from "./Lighting";
import { GLBModel } from "./MicroscopeModel";
import { modelCatalog } from "./modelCatalog";
import type { ModelKind } from "./modelCatalog";
import { gsap } from "../../lib/gsap";
function Model({
  model,
  angle,
  onFailure,
}: {
  model: ModelKind;
  angle: number;
  onFailure: () => void;
}) {
  const group = useRef<Group>(null);
  const { gl, invalidate } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const contextLost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    canvas.addEventListener("webglcontextlost", contextLost);
    const target = canvas.closest("[data-scene-scroll]");
    const context = gsap.context(() => {
      if (!group.current || !target) return;
      gsap.fromTo(
        group.current.rotation,
        { y: -0.25 },
        {
          y: 0.65,
          ease: "none",
          onUpdate: invalidate,
          scrollTrigger: {
            trigger: target,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });
    return () => {
      context.revert();
      canvas.removeEventListener("webglcontextlost", contextLost);
    };
  }, [gl, invalidate, onFailure]);
  return (
    <group ref={group}>
      <group rotation={[0, angle, 0]}>
        <GLBModel url={modelCatalog[model].url} />
      </group>
    </group>
  );
}
export default function Scene({
  model,
  angle,
  onFailure,
}: {
  model: ModelKind;
  angle: number;
  onFailure: () => void;
}) {
  return (
    <Canvas
      camera={{
        position: model === "laboratory" ? [3.5, 2.5, 5.2] : [2.8, 1.3, 4.4],
        fov: 35,
      }}
      dpr={[1, 1.5]}
      frameloop="demand"
      gl={{ alpha: true, antialias: true }}
    >
      <Lighting />
      <Suspense fallback={null}>
        <Model model={model} angle={angle} onFailure={onFailure} />
      </Suspense>
    </Canvas>
  );
}
