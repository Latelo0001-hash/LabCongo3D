import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import Providers from "./app/providers";
import "./styles/globals.css";
import { dismissSplash } from "./lib/splash";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
);
// Garde-fou : l'écran de chargement ne doit jamais rester si une page ne parvient pas à s'afficher.
window.setTimeout(dismissSplash, 10000);
