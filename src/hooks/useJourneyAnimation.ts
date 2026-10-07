import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";

export function useJourneyAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const media = gsap.matchMedia();
    media.add(
      "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
      () => {
        const path = root.querySelector<SVGPathElement>(".journey-trace");
        const parcel = root.querySelector<SVGGElement>(".journey-parcel");
        if (!path || !parcel) return;
        const length = path.getTotalLength();
        const position = { progress: 0 };
        const placeParcel = () => {
          const point = path.getPointAtLength(position.progress * length);
          parcel.setAttribute("transform", `translate(${point.x} ${point.y})`);
        };
        gsap.set(parcel, { opacity: 1 });
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top center",
            end: "bottom 75%",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });
        timeline
          .to(path, { strokeDashoffset: 0 }, 0)
          .to(position, { progress: 1, onUpdate: placeParcel }, 0);
        return () => parcel.setAttribute("transform", "translate(110 100)");
      },
      ref,
    );
    return () => media.revert();
  }, []);
  return ref;
}
