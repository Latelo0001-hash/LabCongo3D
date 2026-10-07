import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { useMediaQuery } from "./useMediaQuery";
export function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  useEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: ref.current, start: "top 92%", once: true },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, [reduced]);
  return ref;
}
