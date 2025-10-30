import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import SimpleMenu from "../pages/Menu";
import Profile from "../pages/Profile";
import Admin from "../pages/Admin";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import RequireAdmin from "../components/layout/RequireAdmin";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <SimpleMenu /> },
      {
        path: "perfil",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <RequireAdmin>
            <Admin />
          </RequireAdmin>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
