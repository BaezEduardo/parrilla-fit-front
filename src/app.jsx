import { Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./components/Topbar";
import Menu from "./pages/Menu";
import AdminPanel from "./pages/AdminPanel";
import RequireAdmin from "./routes/RequireAdmin";
import "./styles.css";

export default function App(){
  return (
    <>
      <Topbar />
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/debug/users" element={<div>UsersDebug aquí (temporal)</div>} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminPanel />
            </RequireAdmin>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
