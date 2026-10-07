import { useSyncExternalStore } from "react";
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (callback) => {
      const m = matchMedia(query);
      m.addEventListener("change", callback);
      return () => m.removeEventListener("change", callback);
    },
    () => matchMedia(query).matches,
    () => false,
  );
}
