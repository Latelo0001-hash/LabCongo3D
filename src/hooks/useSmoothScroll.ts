import { useEffect } from "react";
import { Lenis, registerSmoothScroll } from "../lib/lenis";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { useMediaQuery } from "./useMediaQuery";
export function useSmoothScroll() {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ duration: 1.05, anchors: true });
    const unregister = registerSmoothScroll(lenis);
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      unregister();
      lenis.destroy();
    };
  }, [reduced]);
}
