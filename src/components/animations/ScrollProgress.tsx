import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { useMediaQuery } from "../../hooks/useMediaQuery";
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: true },
      });
    });
    return () => ctx.revert();
  }, [reduced]);
  return <div ref={ref} className="scroll-progress" aria-hidden="true" />;
}
