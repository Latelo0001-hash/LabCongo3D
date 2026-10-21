import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import PageLayout from "../components/layout/PageLayout";
import Loader from "../components/common/Loader";
import PageReady from "../components/common/PageReady";
const Experience = lazy(() => import("../pages/Experience/Experience"));
const Home = lazy(() => import("../pages/Home/Home"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));
const About = lazy(() => import("../pages/About/About"));
const Pilot = lazy(() => import("../pages/Pilot/Pilot"));
const Information = lazy(() => import("../pages/Information/Information"));
const Process = lazy(() => import("../pages/Process/Process"));
const Schools = lazy(() => import("../pages/Schools/Schools"));
const SchoolDetails = lazy(() => import("../pages/Schools/SchoolDetails"));
const Projects = lazy(() => import("../pages/Projects/Projects"));
const ProjectDetails = lazy(() => import("../pages/Projects/ProjectDetails"));
const Equipment = lazy(() => import("../pages/Equipment/Equipment"));
const EquipmentDetails = lazy(
  () => import("../pages/Equipment/EquipmentDetails"),
);
const Impact = lazy(() => import("../pages/Impact/Impact"));
const Partners = lazy(() => import("../pages/Partners/Partners"));
const Donate = lazy(() => import("../pages/Donate/Donate"));
const News = lazy(() => import("../pages/News/News"));
const Article = lazy(() => import("../pages/News/Article"));
const Contact = lazy(() => import("../pages/Contact/Contact"));
const deferred = (node: ReactNode) => (
  <Suspense fallback={<Loader />}>
    {node}
    <PageReady />
  </Suspense>
);
function LegacyProcess() {
  const { hash, search } = useLocation();
  const pilotAnchors = ["#diagnostic", "#diagnostic-title", "#diagnostic-challenges", "#projet-pilote", "#projet-integre", "#perennisation", "#evaluation"];
  if (pilotAnchors.includes(hash)) return <Navigate to={`/projet-pilote${search}${hash.startsWith("#diagnostic") ? "#diagnostic" : `#phase-${hash.slice(1)}`}`} replace />;
  const aliases: Record<string, string> = { "#material-journey": "#parcours", "#collecte": "#mobiliser", "#preparation": "#preparer", "#transport": "#acheminer", "#installation": "#installer" };
  return <Navigate to={`/notre-approche${search}${aliases[hash] ?? hash}`} replace />;
}
function LegacySupport() {
  const { hash, search } = useLocation();
  return <Navigate to={`/nous-soutenir${search}${hash}`} replace />;
}
export const router = createBrowserRouter([
  {
    element: <PageLayout />,
    children: [
      { index: true, element: deferred(<Home />) },
      { path: "experience", element: deferred(<Experience />) },
      { path: "a-propos", element: deferred(<About />) },
      { path: "mission", element: <Navigate to="/a-propos#mission" replace /> },
      { path: "notre-demarche", element: <LegacyProcess /> },
      { path: "notre-approche", element: deferred(<Process />) },
      { path: "projet-pilote", element: deferred(<Pilot />) },
      { path: "ecoles", element: deferred(<Schools />) },
      { path: "ecoles/:slug", element: deferred(<SchoolDetails />) },
      { path: "projets", element: deferred(<Projects />) },
      {
        path: "realisations",
        element: <Navigate to="/projets?statut=completed" replace />,
      },
      { path: "projets/:slug", element: deferred(<ProjectDetails />) },
      { path: "equipements", element: deferred(<Equipment />) },
      { path: "equipements/:slug", element: deferred(<EquipmentDetails />) },
      { path: "impact", element: deferred(<Impact />) },
      { path: "partenaires", element: deferred(<Partners />) },
      { path: "faire-un-don", element: <LegacySupport /> },
      { path: "nous-soutenir", element: deferred(<Donate />) },
      { path: "confidentialite", element: deferred(<Information privacy />) },
      { path: "mentions-legales", element: deferred(<Information />) },
      { path: "actualites", element: deferred(<News />) },
      { path: "actualites/:slug", element: deferred(<Article />) },
      { path: "contact", element: deferred(<Contact />) },
      { path: "*", element: deferred(<NotFound />) },
    ],
  },
]);
