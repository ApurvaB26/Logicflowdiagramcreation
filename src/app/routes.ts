import { createBrowserRouter } from "react-router";
import { MainDashboard } from "./components/main-dashboard";
import { SharePage } from "./components/share-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainDashboard,
  },
  {
    path: "/share/:type",
    Component: SharePage,
  },
  {
    path: "/share/:type/:id",
    Component: SharePage,
  },
]);
