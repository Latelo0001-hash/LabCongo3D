import type { PropsWithChildren } from "react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
export default function FadeIn({ children }: PropsWithChildren) {
  const ref = useScrollAnimation();
  return <div ref={ref}>{children}</div>;
}
