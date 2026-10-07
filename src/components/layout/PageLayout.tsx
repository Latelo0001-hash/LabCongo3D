import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "../common/ScrollToTop";
import ScrollProgress from "../animations/ScrollProgress";
export default function PageLayout() {
  const immersive = useLocation().pathname === "/";
  return (
    <>
      <a className="skip-link" href="#main">Aller au contenu</a>
      <ScrollToTop />
      {!immersive && <ScrollProgress />}
      <Header immersive={immersive} />
      <main id="main" tabIndex={-1}><Outlet /></main>
      <Footer />
    </>
  );
}
