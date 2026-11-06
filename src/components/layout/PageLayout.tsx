import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "../common/ScrollToTop";
import BackToTop from "../common/BackToTop";
import ScrollProgress from "../animations/ScrollProgress";
import EditorialNavigation from "../common/EditorialNavigation";
export default function PageLayout() {
  const { pathname } = useLocation();
  const immersive = pathname === "/";
  return (
    <>
      <a className="skip-link" href="#main">Aller au contenu</a>
      <ScrollToTop />
      {!immersive && <ScrollProgress />}
      <Header immersive={immersive} />
      <main id="main" className={!immersive && pathname !== "/experience" ? "public-content" : undefined} tabIndex={-1}><Outlet /><EditorialNavigation /></main>
      <Footer />
      <BackToTop />
    </>
  );
}
