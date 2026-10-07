import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
export default function App() {
  useSmoothScroll();
  return <RouterProvider router={router} />;
}
