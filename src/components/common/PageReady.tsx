import { useEffect } from "react";
import { dismissSplash } from "../../lib/splash";

// Placé à côté de chaque page, dans sa limite Suspense : il ne s'affiche que lorsque la page est prête.
export default function PageReady() {
  useEffect(() => dismissSplash(), []);
  return null;
}
