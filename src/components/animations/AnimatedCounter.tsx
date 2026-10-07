import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { useMediaQuery } from "../../hooks/useMediaQuery";
export default function AnimatedCounter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const formatted = new Intl.NumberFormat("fr-FR").format(value);
  useEffect(() => {
    const element = ref.current;
    if (!element || reduced) return;
    const context = gsap.context(() => {
      const state = { value: 0 };
      gsap.to(state, {
        value,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: { trigger: element, start: "top 95%", once: true },
        onUpdate: () => {
          element.textContent = new Intl.NumberFormat("fr-FR", {
            maximumFractionDigits: 0,
          }).format(state.value);
        },
        onComplete: () => {
          element.textContent = formatted;
        },
      });
    });
    return () => {
      context.revert();
      element.textContent = formatted;
    };
  }, [value, reduced, formatted]);
  return (
    <>
      <span className="sr-only">{formatted}</span>
      <span aria-hidden="true" ref={ref}>
        {formatted}
      </span>
    </>
  );
}
