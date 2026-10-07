import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import PageLayout from "../components/layout/PageLayout";
import Loader from "../components/common/Loader";
const Experience = lazy(() => import("../pages/Experience/Experience"));
const Home = lazy(() => import("../pages/Home/Home"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));
const About = lazy(() => import("../pages/About/About"));
const Mission = lazy(() => import("../pages/Mission/Mission"));
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
  <Suspense fallback={<Loader />}>{node}</Suspense>
);
export const router = createBrowserRouter([
  {
    element: <PageLayout />,
    children: [
      { index: true, element: deferred(<Home />) },
      { path: "experience", element: deferred(<Experience />) },
      { path: "a-propos", element: deferred(<About />) },
      { path: "mission", element: deferred(<Mission />) },
      { path: "notre-demarche", element: deferred(<Process />) },
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
      { path: "faire-un-don", element: deferred(<Donate />) },
      { path: "actualites", element: deferred(<News />) },
      { path: "actualites/:slug", element: deferred(<Article />) },
      { path: "contact", element: deferred(<Contact />) },
      { path: "*", element: deferred(<NotFound />) },
    ],
  },
]);
