import { Routes, Route } from "react-router-dom";
import Home from "./screens/Home.jsx"; // luego movemos tu App a Home

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
