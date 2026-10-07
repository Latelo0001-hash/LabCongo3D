import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { useMediaQuery } from "./useMediaQuery";

export function useHeroAnimation() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  useEffect(() => {
    if (reduced || !ref.current) return;
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .from(".hero-line", { yPercent: 105, stagger: 0.12, duration: 1 })
        .from(
          ".hero-description, .hero-actions",
          { y: 18, opacity: 0, stagger: 0.12, duration: 0.65 },
          "-=0.55",
        )
        .from(
          ".instrument-card",
          { y: 20, opacity: 0, duration: 0.7 },
          "-=0.5",
        );
      const media = gsap.matchMedia();
      media.add("(min-width: 761px)", () => {
        gsap.to(".hero-photo", {
          yPercent: 7,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
      return () => media.revert();
    }, ref);
    return () => context.revert();
  }, [reduced]);
  return ref;
}
