import { createBrowserRouter } from "react-router";
import { MainDashboard } from "./components/main-dashboard";
import { SharePage } from "./components/share-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainDashboard,
  },
  // Link Type 1: View + PNG Download
  {
    path: "/share/view/:type",
    Component: SharePage,
  },
  {
    path: "/share/view/:type/:id",
    Component: SharePage,
  },
  // Link Type 2: View + Data Download (click nodes to download fed data)
  {
    path: "/share/data/:type",
    Component: SharePage,
  },
  {
    path: "/share/data/:type/:id",
    Component: SharePage,
  },
  // Legacy routes (backward compat — treated as view mode)
  {
    path: "/share/:type",
    Component: SharePage,
  },
  {
    path: "/share/:type/:id",
    Component: SharePage,
  },
]);